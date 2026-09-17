import { z } from "zod";
import { CATEGORIES, type Answer, type CategoryId } from "./lifelink-data";

export const MissingFieldSchema = z.enum([
  "incident_type",
  "responsive",
  "breathing",
  "visible_bleeding",
  "bleeding_location",
  "patient_relationship",
  "location",
]);

export type MissingField = z.infer<typeof MissingFieldSchema>;

export const AiExtractionSchema = z
  .object({
    incident_type: z
      .enum(["road", "bike", "cardiac", "breathing", "burn", "fall", "stroke", "other"])
      .nullable(),
    responsive: z.boolean().nullable(),
    breathing_normally: z.boolean().nullable(),
    visible_bleeding: z.boolean().nullable(),
    bleeding_location: z.string().max(80).nullable(),
    visible_injuries: z.boolean().nullable(),
    patient_relationship: z.string().max(80).nullable(),
    patient_known: z.boolean().nullable(),
    immediate_concern: z.boolean(),
    missing: z.array(MissingFieldSchema).max(8),
    confidence: z
      .object({
        incident_type: z.number().min(0).max(1).nullable(),
        responsive: z.number().min(0).max(1).nullable(),
        breathing_normally: z.number().min(0).max(1).nullable(),
        visible_bleeding: z.number().min(0).max(1).nullable(),
      })
      .strict(),
  })
  .strict();

export type AiExtraction = z.infer<typeof AiExtractionSchema>;

export interface SafeExtraction {
  category: CategoryId | null;
  answers: Partial<Record<"patientKnown" | "conscious" | "breathing" | "bleeding" | "injuries", Answer>>;
  bleedingLocation: string;
  patientRelationship: string;
  immediateConcern: boolean;
  confidence: AiExtraction["confidence"];
  missing: MissingField[];
  summary: string;
}

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

function asAnswer(value: boolean | null | undefined, inverted = false): Answer {
  if (value === true) return inverted ? "no" : "yes";
  if (value === false) return inverted ? "yes" : "no";
  return "unknown";
}

function cleanText(value: string | null | undefined, max = 80) {
  return (value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function computeMissing(result: SafeExtraction): MissingField[] {
  const missing = new Set<MissingField>();
  if (!result.category) missing.add("incident_type");
  if (!result.answers.conscious || result.answers.conscious === "unknown") missing.add("responsive");
  if (!result.answers.breathing || result.answers.breathing === "unknown") missing.add("breathing");
  if (!result.answers.bleeding || result.answers.bleeding === "unknown") missing.add("visible_bleeding");
  if (result.answers.bleeding === "yes" && !result.bleedingLocation) missing.add("bleeding_location");
  if (!result.patientRelationship) missing.add("patient_relationship");
  return Array.from(missing);
}

function summaryFrom(text: string, result: SafeExtraction) {
  const pieces = [
    result.category ? `Incident: ${result.category.replace(/_/g, " ")}` : "Incident type not provided",
    `Responsive: ${result.answers.conscious ?? "unknown"}`,
    `Breathing: ${result.answers.breathing ?? "unknown"}`,
    `Bleeding: ${result.answers.bleeding ?? "unknown"}${result.bleedingLocation ? `, ${result.bleedingLocation}` : ""}`,
    result.patientRelationship ? `Reporter relation: ${result.patientRelationship}` : "Reporter relation not provided",
  ];
  const raw = cleanText(text, 180);
  return `${pieces.join(". ")}.${raw ? ` Original statement: ${raw}` : ""}`;
}

export function normalizeAiExtraction(raw: unknown, text: string): SafeExtraction {
  const parsed = AiExtractionSchema.parse(raw);
  const category = parsed.incident_type && CATEGORY_IDS.has(parsed.incident_type) ? parsed.incident_type : null;
  const result: SafeExtraction = {
    category,
    answers: {
      patientKnown: asAnswer(parsed.patient_known),
      conscious: asAnswer(parsed.responsive),
      breathing: asAnswer(parsed.breathing_normally),
      bleeding: asAnswer(parsed.visible_bleeding),
      injuries: asAnswer(parsed.visible_injuries),
    },
    bleedingLocation: cleanText(parsed.bleeding_location),
    patientRelationship: cleanText(parsed.patient_relationship),
    immediateConcern: parsed.immediate_concern,
    confidence: parsed.confidence,
    missing: parsed.missing,
    summary: "",
  };
  result.missing = Array.from(new Set([...result.missing, ...computeMissing(result)]));
  result.summary = summaryFrom(text, result);
  return result;
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function categoryFrom(text: string): CategoryId | null {
  if (hasAny(text, ["bike", "motorcycle", "బైక్", "बाइक", "பைக்", "ಬೈಕ್", "ബൈക്ക്" ])) return "bike";
  if (hasAny(text, ["chest", "heart", "cardiac", "ఛాతి", "सीने", "இதயம்", "ಹೃದಯ", "നെഞ്ച്"])) return "cardiac";
  if (hasAny(text, ["breathless", "cannot breathe", "difficulty breathing", "శ్వాస తీసుకోల", "सांस नहीं", "மூச்சு", "ಉಸಿರಾಡ", "ശ്വാസം"])) return "breathing";
  if (hasAny(text, ["burn", "fire", "కాలిన", "जल", "தீ", "ಬೆಂಕಿ", "പൊള്ളൽ"])) return "burn";
  if (hasAny(text, ["fell", "fall", "fallen", "head injury", "పడిపోయ", "गिर", "விழ", "ಬಿದ್ದ", "വീണ"])) return "fall";
  if (hasAny(text, ["stroke", "face droop", "slurred", "పక్షవాతం", "स्ट्रोक", "பக்கவாதம்", "ಸ್ಟ್ರೋಕ್"])) return "stroke";
  if (hasAny(text, ["accident", "hit by", "car", "road", "highway", "junction", "ఢీకొ", "रोड", "कार", "सड़क", "விபத்து", "கார்", "ಅಪಘಾತ", "കാർ", "গাড়ি"])) return "road";
  return null;
}

function answerFrom(text: string, yesTerms: string[], noTerms: string[]): Answer {
  if (hasAny(text, noTerms)) return "no";
  if (hasAny(text, yesTerms)) return "yes";
  return "unknown";
}

export function extractEmergencyInfoLocal(text: string): SafeExtraction {
  const normalized = text.toLocaleLowerCase();
  const category = categoryFrom(normalized);
  const bleeding = answerFrom(
    normalized,
    ["bleeding", "blood", "రక్త", "खून", "रक्त", "இரத்த", "ರಕ್ತ", "രക്ത", "রক্ত"],
    ["no bleeding", "not bleeding", "blood is not", "రక్తం లేదు", "खून नहीं"],
  );
  const result: SafeExtraction = {
    category,
    answers: {
      patientKnown: answerFrom(
        normalized,
        ["my brother", "my sister", "my father", "my mother", "friend", "నా అన్న", "मेरे भाई", "என்", "ನನ್ನ", "എന്റെ", "আমার"],
        ["unknown person", "stranger", "do not know", "don't know him", "తెలియదు", "नहीं जानता"],
      ),
      conscious: answerFrom(
        normalized,
        ["conscious", "awake", "responding", "స్పృహలో", "होश में", "நினைவில்", "ಎಚ್ಚರ", "ബോധ"],
        ["unconscious", "not responding", "unresponsive", "no response", "స్పందించడం లేదు", "होश में नहीं", "बेहोश", "பதில் இல்லை", "ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಿಲ್ಲ", "പ്രതികരിക്കുന്നില്ല", "সাড়া দিচ্ছেন না"],
      ),
      breathing: answerFrom(
        normalized,
        ["breathing", "breath is", "శ్వాస ఉంది", "सांस चल", "மூச்சு உள்ளது", "ಉಸಿರಾಟ ಇದೆ", "ശ്വാസം ഉണ്ട്", "শ্বাস নিচ্ছেন"],
        ["not breathing", "cannot breathe", "no breathing", "శ్వాస లేదు", "सांस नहीं"],
      ),
      bleeding,
      injuries: answerFrom(
        normalized,
        ["injury", "injured", "hurt", "wound", "గాయ", "चोट", "காய", "ಗಾಯ", "പരിക്ക്", "আঘাত"],
        ["no injury", "not injured", "चोट नहीं"],
      ),
    },
    bleedingLocation: bleeding === "yes" ? cleanText(extractLocation(normalized), 80) : "",
    patientRelationship: cleanText(extractRelationship(normalized), 80),
    immediateConcern: hasAny(normalized, ["unconscious", "not breathing", "heavy bleeding", "not responding", "స్పందించడం లేదు", "बेहोश", "सांस नहीं"]),
    confidence: {
      incident_type: category ? 0.72 : null,
      responsive: undefinedToNull(answerConfidence(normalized, ["conscious", "unconscious", "not responding", "స్పందించడం లేదు", "बेहोश"])),
      breathing_normally: undefinedToNull(answerConfidence(normalized, ["breathing", "not breathing", "శ్వాస", "सांस"])),
      visible_bleeding: undefinedToNull(answerConfidence(normalized, ["bleeding", "blood", "రక్త", "खून"])),
    },
    missing: [],
    summary: "",
  };
  result.missing = computeMissing(result);
  result.summary = summaryFrom(text, result);
  return result;
}

function undefinedToNull(value: number | undefined) {
  return value ?? null;
}

function answerConfidence(text: string, terms: string[]) {
  return hasAny(text, terms) ? 0.74 : undefined;
}

function extractRelationship(text: string) {
  const pairs: [string, string][] = [
    ["brother", "brother"],
    ["sister", "sister"],
    ["father", "father"],
    ["mother", "mother"],
    ["friend", "friend"],
    ["నా అన్న", "brother"],
    ["मेरे भाई", "brother"],
    ["என் அண்ண", "brother"],
    ["ನನ್ನ ಅಣ್ಣ", "brother"],
    ["എന്റെ സഹോദര", "brother"],
    ["আমার ভাই", "brother"],
  ];
  return pairs.find(([needle]) => text.includes(needle))?.[1] ?? "";
}

function extractLocation(text: string) {
  const pairs: [string, string][] = [
    ["head", "head"],
    ["leg", "leg"],
    ["arm", "arm"],
    ["తల", "head"],
    ["కాలు", "leg"],
    ["सिर", "head"],
    ["पैर", "leg"],
    ["தலை", "head"],
    ["கால்", "leg"],
    ["ತಲೆ", "head"],
    ["ಕಾಲು", "leg"],
    ["തല", "head"],
    ["കാൽ", "leg"],
    ["মাথা", "head"],
    ["পা", "leg"],
  ];
  return pairs.find(([needle]) => text.includes(needle))?.[1] ?? "";
}
