import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEmergencyInfoLocal, normalizeAiExtraction } from "./lifelink-extraction";

const InputSchema = z.object({
  text: z.string().trim().min(1).max(2000),
  language: z.enum(["en", "te", "hi", "ta", "kn", "ml", "mr", "bn"]),
});

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    incident_type: { type: ["string", "null"], enum: ["road", "bike", "cardiac", "breathing", "burn", "fall", "stroke", "other", null] },
    responsive: { type: ["boolean", "null"] },
    breathing_normally: { type: ["boolean", "null"] },
    visible_bleeding: { type: ["boolean", "null"] },
    bleeding_location: { type: ["string", "null"] },
    visible_injuries: { type: ["boolean", "null"] },
    patient_relationship: { type: ["string", "null"] },
    patient_known: { type: ["boolean", "null"] },
    immediate_concern: { type: "boolean" },
    missing: {
      type: "array",
      items: { type: "string", enum: ["incident_type", "responsive", "breathing", "visible_bleeding", "bleeding_location", "patient_relationship", "location"] },
    },
    confidence: {
      type: "object",
      additionalProperties: false,
      properties: {
        incident_type: { type: ["number", "null"] },
        responsive: { type: ["number", "null"] },
        breathing_normally: { type: ["number", "null"] },
        visible_bleeding: { type: ["number", "null"] },
      },
      required: ["incident_type", "responsive", "breathing_normally", "visible_bleeding"],
    },
  },
  required: [
    "incident_type",
    "responsive",
    "breathing_normally",
    "visible_bleeding",
    "bleeding_location",
    "visible_injuries",
    "patient_relationship",
    "patient_known",
    "immediate_concern",
    "missing",
    "confidence",
  ],
} as const;

export const extractEmergencyWithAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const fallback = extractEmergencyInfoLocal(data.text);
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      return {
        ok: false,
        source: "local-rules" as const,
        message: "AI extraction is not configured. Manual form and local extraction remain available.",
        result: fallback,
      };
    }

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          stream: true,
          reasoning: { effort: "low", summary: "auto" },
          include: ["reasoning.encrypted_content"],
          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: "Extract emergency coordination fields from the user's statement. Do not diagnose, prescribe, invent symptoms, invent location, invent hospital availability, or make treatment recommendations. Use null when a fact is not provided or unclear. Return only schema-valid JSON.",
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `Selected language: ${data.language}\nEmergency statement: ${data.text}`,
                },
              ],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "lifelink_emergency_extraction",
              strict: true,
              schema: RESPONSE_SCHEMA,
            },
          },
        }),
      });

      if (!response.ok) {
        return {
          ok: false,
          source: "local-rules" as const,
          message: cleanGatewayMessage(response.status, await response.text().catch(() => "")),
          result: fallback,
        };
      }

      const outputText = await readSseText(response);
      const parsed = JSON.parse(outputText) as unknown;
      return {
        ok: true,
        source: "lovable-ai" as const,
        message: "Structured details extracted. Please confirm anything uncertain.",
        result: normalizeAiExtraction(parsed, data.text),
      };
    } catch {
      return {
        ok: false,
        source: "local-rules" as const,
        message: "AI extraction was unavailable. Manual form and local extraction remain available.",
        result: fallback,
      };
    }
  });

async function readSseText(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Missing response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let output = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      const event = JSON.parse(payload) as { type?: string; delta?: string; response?: { output_text?: string } };
      if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
        output += event.delta;
      }
      if (!output && event.type === "response.completed" && typeof event.response?.output_text === "string") {
        output = event.response.output_text;
      }
    }
  }

  const finalText = output.trim();
  if (!finalText) throw new Error("Empty extraction response");
  return finalText;
}

function cleanGatewayMessage(status: number, body: string) {
  let message = body;
  try {
    const parsed = JSON.parse(body) as { message?: unknown; error?: { message?: unknown } };
    message = String(parsed.error?.message ?? parsed.message ?? body);
  } catch {
    message = body;
  }
  const safe = message.replace(/\s+/g, " ").slice(0, 260);
  if (status === 402) return safe || "AI credits are unavailable. Manual form remains available.";
  if (status === 403) return safe || "AI extraction is blocked for this workspace. Manual form remains available.";
  if (status === 429) return safe || "AI extraction is rate limited. Manual form remains available.";
  return safe || "AI extraction failed. Manual form remains available.";
}
