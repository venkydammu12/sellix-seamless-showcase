export type LangCode = "en" | "te" | "hi" | "ta" | "kn" | "ml" | "mr" | "bn";

export type Answer = "yes" | "no" | "unknown";

export type ReceivingStatus = "accepting" | "limited" | "unable";

export interface Hospital {
  id: string;
  name: string;
  distanceKm: number;
  etaMin: number;
  capabilities: string[];
  status: ReceivingStatus;
}

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

export interface UIStrings {
  listening: string;
  talk: string;
  yes: string;
  no: string;
  unknown: string;
  conscious: string;
  breathing: string;
  bleeding: string;
  injuries: string;
  category: string;
  hospitals: string;
  request: string;
}

const EN: UIStrings = {
  listening: "Listening…",
  talk: "Talk to LIFE-LINK",
  yes: "YES",
  no: "NO",
  unknown: "DON'T KNOW",
  conscious: "Is the person conscious?",
  breathing: "Is the person breathing normally?",
  bleeding: "Is there heavy bleeding?",
  injuries: "Are there visible injuries?",
  category: "What kind of emergency is this?",
  hospitals: "Nearby participating hospitals",
  request: "Request Reception",
};

export const UI: Record<LangCode, UIStrings> = {
  en: EN,
  te: {
    ...EN,
    listening: "వింటున్నాము…",
    talk: "LIFE-LINK తో మాట్లాడండి",
    yes: "అవును",
    no: "కాదు",
    unknown: "తెలియదు",
    conscious: "వ్యక్తి స్పృహలో ఉన్నారా?",
    breathing: "సాధారణంగా శ్వాస తీసుకుంటున్నారా?",
    bleeding: "అధిక రక్తస్రావం ఉందా?",
    injuries: "కనిపించే గాయాలు ఉన్నాయా?",
    category: "ఇది ఎలాంటి అత్యవసర పరిస్థితి?",
    hospitals: "సమీప భాగస్వామ్య ఆసుపత్రులు",
    request: "రిసెప్షన్ కోరండి",
  },
  hi: {
    ...EN,
    listening: "सुन रहे हैं…",
    talk: "LIFE-LINK से बात करें",
    yes: "हाँ",
    no: "नहीं",
    unknown: "पता नहीं",
    conscious: "व्यक्ति होश में है?",
    breathing: "सामान्य रूप से सांस ले रहा है?",
    bleeding: "तेज़ खून बह रहा है?",
    injuries: "दिखाई देने वाली चोटें हैं?",
    category: "यह किस प्रकार की आपात स्थिति है?",
    hospitals: "आस-पास के सहभागी अस्पताल",
    request: "रिसेप्शन का अनुरोध करें",
  },
  ta: {
    ...EN,
    listening: "கேட்கிறோம்…",
    talk: "LIFE-LINK உடன் பேசுங்கள்",
    yes: "ஆம்",
    no: "இல்லை",
    unknown: "தெரியாது",
    conscious: "நபர் நினைவில் உள்ளாரா?",
    breathing: "சாதாரணமாக மூச்சு விடுகிறாரா?",
    bleeding: "அதிக இரத்தப்போக்கு உள்ளதா?",
    injuries: "தெரியும் காயங்கள் உள்ளதா?",
    category: "இது எந்த வகை அவசரநிலை?",
    hospitals: "அருகிலுள்ள பங்கேற்பு மருத்துவமனைகள்",
    request: "வரவேற்பு கோரிக்கை",
  },
  kn: {
    ...EN,
    listening: "ಕೇಳುತ್ತಿದ್ದೇವೆ…",
    talk: "LIFE-LINK ಜೊತೆ ಮಾತನಾಡಿ",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    unknown: "ಗೊತ್ತಿಲ್ಲ",
    conscious: "ವ್ಯಕ್ತಿ ಎಚ್ಚರವಾಗಿದ್ದಾರೆಯೇ?",
    breathing: "ಸಾಮಾನ್ಯವಾಗಿ ಉಸಿರಾಡುತ್ತಿದ್ದಾರೆಯೇ?",
    bleeding: "ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ ಇದೆಯೇ?",
    injuries: "ಕಾಣುವ ಗಾಯಗಳಿವೆಯೇ?",
    category: "ಇದು ಯಾವ ರೀತಿಯ ತುರ್ತು?",
    hospitals: "ಹತ್ತಿರದ ಪಾಲುದಾರ ಆಸ್ಪತ್ರೆಗಳು",
    request: "ಸ್ವಾಗತ ಕೋರಿಕೆ",
  },
  ml: {
    ...EN,
    listening: "കേൾക്കുന്നു…",
    talk: "LIFE-LINK നോട് സംസാരിക്കുക",
    yes: "അതെ",
    no: "അല്ല",
    unknown: "അറിയില്ല",
    conscious: "വ്യക്തിക്ക് ബോധമുണ്ടോ?",
    breathing: "സാധാരണ ശ്വാസം എടുക്കുന്നുണ്ടോ?",
    bleeding: "കടുത്ത രക്തസ്രാവം ഉണ്ടോ?",
    injuries: "കാണാവുന്ന പരിക്കുകൾ ഉണ്ടോ?",
    category: "ഇത് ഏത് തരം അടിയന്തരാവസ്ഥയാണ്?",
    hospitals: "അടുത്തുള്ള പങ്കാളി ആശുപത്രികൾ",
    request: "സ്വീകരണം അഭ്യർത്ഥിക്കുക",
  },
  mr: {
    ...EN,
    listening: "ऐकत आहोत…",
    talk: "LIFE-LINK शी बोला",
    yes: "होय",
    no: "नाही",
    unknown: "माहित नाही",
    conscious: "व्यक्ती शुद्धीत आहे?",
    breathing: "सामान्यपणे श्वास घेत आहे?",
    bleeding: "जास्त रक्तस्राव आहे?",
    injuries: "दिसणाऱ्या जखमा आहेत?",
    category: "ही कोणत्या प्रकारची आपत्कालीन स्थिती आहे?",
    hospitals: "जवळील सहभागी रुग्णालये",
    request: "स्वागताची विनंती",
  },
  bn: {
    ...EN,
    listening: "শুনছি…",
    talk: "LIFE-LINK এর সাথে কথা বলুন",
    yes: "হ্যাঁ",
    no: "না",
    unknown: "জানি না",
    conscious: "ব্যক্তি সজ্ঞান আছেন?",
    breathing: "স্বাভাবিকভাবে শ্বাস নিচ্ছেন?",
    bleeding: "প্রচুর রক্তক্ষরণ হচ্ছে?",
    injuries: "দৃশ্যমান আঘাত আছে?",
    category: "এটি কী ধরনের আপৎকাল?",
    hospitals: "নিকটবর্তী অংশগ্রহণকারী হাসপাতাল",
    request: "রিসেপশন অনুরোধ",
  },
};

export interface CategoryDef {
  id: string;
  icon: string;
  label: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "road", icon: "🚗", label: "Road Accident" },
  { id: "bike", icon: "🏍️", label: "Bike Accident" },
  { id: "cardiac", icon: "❤️", label: "Cardiac / Chest Pain" },
  { id: "breathing", icon: "🫁", label: "Breathing Difficulty" },
  { id: "burn", icon: "🔥", label: "Burn Injury" },
  { id: "fall", icon: "🧱", label: "Fall / Head Injury" },
  { id: "stroke", icon: "🧠", label: "Stroke Symptoms" },
  { id: "other", icon: "➕", label: "Other Emergency" },
];

export const HOSPITALS: Hospital[] = [
  {
    id: "alpha",
    name: "Demo Hospital Alpha",
    distanceKm: 3.2,
    etaMin: 8,
    capabilities: ["Trauma", "ICU", "CT / Imaging", "Blood Bank"],
    status: "accepting",
  },
  {
    id: "trauma",
    name: "Demo Trauma Center",
    distanceKm: 6.8,
    etaMin: 14,
    capabilities: ["Level-1 Trauma", "Neuro", "OT Ready"],
    status: "limited",
  },
  {
    id: "city",
    name: "City Hospital",
    distanceKm: 9.4,
    etaMin: 21,
    capabilities: ["Cardiac", "ICU", "Dialysis"],
    status: "unable",
  },
];

export const STATUS_META: Record<ReceivingStatus, { dot: string; label: string }> = {
  accepting: { dot: "🟢", label: "ACCEPTING" },
  limited: { dot: "🟡", label: "LIMITED" },
  unable: { dot: "🔴", label: "UNABLE TO RECEIVE" },
};

export const TIMELINE_STEPS = [
  "Emergency Started",
  "Information Collected",
  "Hospital Request Sent",
  "Hospital Acknowledged",
  "Travelling",
  "Preparing",
  "Arrived",
] as const;

/** Simulated speech transcript lines per language, used by the voice demo. */
export const TRANSCRIPTS: Record<LangCode, string[]> = {
  en: [
    "There has been a road accident near the highway junction.",
    "A man on a bike is on the ground, he is not responding.",
    "He is breathing but there is bleeding from his leg.",
  ],
  te: [
    "హైవే జంక్షన్ దగ్గర రోడ్డు ప్రమాదం జరిగింది.",
    "బైక్ మీద ఉన్న వ్యక్తి కింద పడ్డాడు, స్పందించడం లేదు.",
    "శ్వాస ఉంది కానీ కాలు నుంచి రక్తం కారుతోంది.",
  ],
  hi: [
    "हाईवे जंक्शन के पास सड़क दुर्घटना हुई है.",
    "बाइक सवार ज़मीन पर है, कोई प्रतिक्रिया नहीं दे रहा.",
    "सांस चल रही है लेकिन पैर से खून बह रहा है.",
  ],
  ta: [
    "நெடுஞ்சாலை சந்திப்பில் சாலை விபத்து நடந்தது.",
    "பைக்கில் இருந்தவர் தரையில் கிடக்கிறார், பதில் இல்லை.",
    "மூச்சு உள்ளது ஆனால் காலில் இரத்தப்போக்கு உள்ளது.",
  ],
  kn: [
    "ಹೆದ್ದಾರಿ ಜಂಕ್ಷನ್ ಬಳಿ ರಸ್ತೆ ಅಪಘಾತ ಸಂಭವಿಸಿದೆ.",
    "ಬೈಕ್ ಸವಾರ ನೆಲದ ಮೇಲಿದ್ದಾರೆ, ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಿಲ್ಲ.",
    "ಉಸಿರಾಟ ಇದೆ ಆದರೆ ಕಾಲಿನಿಂದ ರಕ್ತಸ್ರಾವ ಆಗುತ್ತಿದೆ.",
  ],
  ml: [
    "ഹൈവേ ജംഗ്ഷനിൽ റോഡ് അപകടം ഉണ്ടായി.",
    "ബൈക്കിലുണ്ടായിരുന്ന ആൾ നിലത്താണ്, പ്രതികരിക്കുന്നില്ല.",
    "ശ്വാസം ഉണ്ട് പക്ഷേ കാലിൽ നിന്ന് രക്തസ്രാവം ഉണ്ട്.",
  ],
  mr: [
    "महामार्ग जंक्शनजवळ रस्ता अपघात झाला आहे.",
    "बाईकवरील व्यक्ती जमिनीवर आहे, प्रतिसाद देत नाही.",
    "श्वास चालू आहे पण पायातून रक्तस्राव होत आहे.",
  ],
  bn: [
    "হাইওয়ে জংশনের কাছে সড়ক দুর্ঘটনা ঘটেছে.",
    "বাইক চালক মাটিতে পড়ে আছেন, সাড়া দিচ্ছেন না.",
    "শ্বাস চলছে কিন্তু পা থেকে রক্ত ঝরছে.",
  ],
};

export function makeTempId() {
  return `LL-${Math.floor(100000 + Math.random() * 900000)}`;
}
