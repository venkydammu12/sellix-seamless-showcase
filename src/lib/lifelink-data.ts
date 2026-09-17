export type LangCode = "en" | "te" | "hi" | "ta" | "kn" | "ml" | "mr" | "bn";

export type Answer = "yes" | "no" | "unknown";

export type ReceivingStatus = "accepting" | "limited" | "unable";

export type CasePhase =
  | "created"
  | "information_collecting"
  | "ready"
  | "request_sent"
  | "hospital_reviewing"
  | "hospital_accepted"
  | "hospital_review"
  | "hospital_unable"
  | "travelling"
  | "preparing"
  | "arrived";

export type CategoryId =
  | "road"
  | "bike"
  | "cardiac"
  | "breathing"
  | "burn"
  | "fall"
  | "stroke"
  | "other";

export interface Hospital {
  id: string;
  name: string;
  distanceKm: number;
  etaMin: number;
  capabilities: string[];
  teamStatus: string[];
  status: ReceivingStatus;
  lastUpdated: string;
  demo: boolean;
}

export const LANGUAGES: { code: LangCode; label: string; native: string; speechLocale: string }[] = [
  { code: "en", label: "English", native: "English", speechLocale: "en-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", speechLocale: "te-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", speechLocale: "hi-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", speechLocale: "ta-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", speechLocale: "kn-IN" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", speechLocale: "ml-IN" },
  { code: "mr", label: "Marathi", native: "मराठी", speechLocale: "mr-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", speechLocale: "bn-IN" },
];

export interface UIStrings {
  listening: string;
  understanding: string;
  checking: string;
  talk: string;
  voiceUnavailable: string;
  typeInstead: string;
  yes: string;
  no: string;
  unknown: string;
  language: string;
  reporting: string;
  selfMode: string;
  bystanderMode: string;
  temporaryIdNote: string;
  voiceFirst: string;
  tellWhatHappened: string;
  narrativeLabel: string;
  narrativePlaceholder: string;
  analyze: string;
  useDemoStatement: string;
  extracted: string;
  manualFallback: string;
  oneDetailMissing: string;
  coreDetailsReady: string;
  previous: string;
  next: string;
  changeAnswer: string;
  patientKnown: string;
  conscious: string;
  breathing: string;
  bleeding: string;
  bleedingLocation: string;
  injuries: string;
  category: string;
  hospitals: string;
  request: string;
  waiting: string;
  locationTitle: string;
  locationWhy: string;
  shareLocation: string;
  locationDenied: string;
  manualLocation: string;
  manualLocationPlaceholder: string;
  caseForm: string;
  caseId: string;
  languageField: string;
  incidentType: string;
  patientRelationship: string;
  location: string;
  description: string;
  emergencySummary: string;
  source: string;
  notProvided: string;
  estimatedEta: string;
  capabilities: string;
  teamStatus: string;
  demoData: string;
  simulatedEnvironment: string;
  requestSent: string;
  reviewState: string;
  unableState: string;
  acceptedState: string;
  safety: string;
}

const EN: UIStrings = {
  listening: "Listening",
  understanding: "Understanding",
  checking: "Checking the information",
  talk: "Talk to LIFE-LINK",
  voiceUnavailable: "Voice input is not available on this device. You can type instead.",
  typeInstead: "Type instead",
  yes: "YES",
  no: "NO",
  unknown: "DON'T KNOW",
  language: "Language",
  reporting: "Who is reporting?",
  selfMode: "Patient or family",
  bystanderMode: "Bystander or unknown patient",
  temporaryIdNote: "Temporary case ID created. No personal identity is needed for this demo request.",
  voiceFirst: "Voice first",
  tellWhatHappened: "Tell us what happened. Use normal words.",
  narrativeLabel: "Emergency description",
  narrativePlaceholder: "Example: My brother was hit by a car. He is unconscious and bleeding from his head.",
  analyze: "Understand statement",
  useDemoStatement: "Load demo statement",
  extracted: "Structured details extracted. Please confirm anything uncertain.",
  manualFallback: "Manual form remains available.",
  oneDetailMissing: "One detail is missing.",
  coreDetailsReady: "Core details are ready for review.",
  previous: "Previous",
  next: "Next",
  changeAnswer: "Change answer",
  patientKnown: "Do you know the patient?",
  conscious: "Is the person conscious?",
  breathing: "Is the person breathing normally?",
  bleeding: "Is there heavy bleeding?",
  bleedingLocation: "Where is the bleeding?",
  injuries: "Are there visible injuries?",
  category: "What kind of emergency is this?",
  hospitals: "Nearby participating hospitals",
  request: "Request Reception",
  waiting: "Waiting for hospital response",
  locationTitle: "Location sharing",
  locationWhy: "Share an approximate location only if you choose to. It is used to show distance and estimated travel time to participating demo hospitals.",
  shareLocation: "Share approximate location",
  locationDenied: "Location not shared. You can enter an approximate location manually.",
  manualLocation: "Use manual location",
  manualLocationPlaceholder: "Nearest landmark, road, or area",
  caseForm: "Live case form",
  caseId: "Case ID",
  languageField: "Language",
  incidentType: "Incident type",
  patientRelationship: "Patient relationship",
  location: "Location",
  description: "Description",
  emergencySummary: "Emergency summary",
  source: "Source",
  notProvided: "Not provided",
  estimatedEta: "Estimated ETA",
  capabilities: "Capabilities",
  teamStatus: "Team status",
  demoData: "DEMO DATA",
  simulatedEnvironment: "SIMULATED ENVIRONMENT",
  requestSent: "Hospital request sent.",
  reviewState: "Hospital is reviewing the request.",
  unableState: "Selected hospital cannot receive this case. Choose another participating hospital.",
  acceptedState: "Hospital acknowledged the request.",
  safety: "If someone is in immediate danger, contact local emergency services and seek emergency medical care immediately. LIFE-LINK helps coordinate information and does not replace emergency medical care.",
};

export const UI: Record<LangCode, UIStrings> = {
  en: EN,
  te: {
    ...EN,
    listening: "వింటున్నాము",
    understanding: "అర్థం చేసుకుంటున్నాము",
    checking: "సమాచారాన్ని పరిశీలిస్తున్నాము",
    talk: "LIFE-LINK తో మాట్లాడండి",
    voiceUnavailable: "ఈ పరికరంలో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. మీరు టైప్ చేయవచ్చు.",
    typeInstead: "టైప్ చేయండి",
    yes: "అవును",
    no: "కాదు",
    unknown: "తెలియదు",
    language: "భాష",
    reporting: "ఎవరు సమాచారం ఇస్తున్నారు?",
    selfMode: "రోగి లేదా కుటుంబం",
    bystanderMode: "చూసిన వ్యక్తి లేదా తెలియని రోగి",
    voiceFirst: "ముందుగా వాయిస్",
    tellWhatHappened: "ఏమి జరిగిందో సహజంగా చెప్పండి.",
    narrativeLabel: "అత్యవసర వివరణ",
    analyze: "వివరాలను అర్థం చేసుకోండి",
    useDemoStatement: "డెమో వాక్యం ఉపయోగించండి",
    oneDetailMissing: "ఒక వివరము కావాలి.",
    coreDetailsReady: "ప్రధాన వివరాలు సిద్ధంగా ఉన్నాయి.",
    previous: "మునుపటి",
    next: "తరువాత",
    patientKnown: "రోగి మీకు తెలుసా?",
    conscious: "వ్యక్తి స్పృహలో ఉన్నారా?",
    breathing: "సాధారణంగా శ్వాస తీసుకుంటున్నారా?",
    bleeding: "అధిక రక్తస్రావం ఉందా?",
    bleedingLocation: "రక్తస్రావం ఎక్కడ ఉంది?",
    injuries: "కనిపించే గాయాలు ఉన్నాయా?",
    category: "ఇది ఎలాంటి అత్యవసర పరిస్థితి?",
    hospitals: "సమీప భాగస్వామ్య ఆసుపత్రులు",
    request: "స్వీకరణ కోరండి",
    waiting: "ఆసుపత్రి స్పందన కోసం వేచి ఉంది",
    locationTitle: "స్థానం పంచుకోవడం",
    shareLocation: "సుమారు స్థానం పంచుకోండి",
    manualLocation: "స్థానాన్ని టైప్ చేయండి",
    caseForm: "ప్రత్యక్ష కేసు ఫారం",
    incidentType: "సంఘటన రకం",
    emergencySummary: "అత్యవసర సారాంశం",
  },
  hi: {
    ...EN,
    listening: "सुन रहे हैं",
    understanding: "समझ रहे हैं",
    checking: "जानकारी जांच रहे हैं",
    talk: "LIFE-LINK से बात करें",
    voiceUnavailable: "इस डिवाइस पर वॉइस इनपुट उपलब्ध नहीं है. आप टाइप कर सकते हैं.",
    typeInstead: "टाइप करें",
    yes: "हाँ",
    no: "नहीं",
    unknown: "पता नहीं",
    language: "भाषा",
    reporting: "कौन बता रहा है?",
    selfMode: "मरीज या परिवार",
    bystanderMode: "राहगीर या अज्ञात मरीज",
    tellWhatHappened: "जो हुआ है उसे सामान्य भाषा में बताएं.",
    narrativeLabel: "आपात स्थिति का विवरण",
    analyze: "विवरण समझें",
    useDemoStatement: "डेमो वाक्य डालें",
    oneDetailMissing: "एक जानकारी बाकी है.",
    coreDetailsReady: "मुख्य जानकारी समीक्षा के लिए तैयार है.",
    previous: "पिछला",
    next: "अगला",
    patientKnown: "क्या आप मरीज को जानते हैं?",
    conscious: "व्यक्ति होश में है?",
    breathing: "सामान्य रूप से सांस ले रहा है?",
    bleeding: "तेज़ खून बह रहा है?",
    bleedingLocation: "खून कहां से बह रहा है?",
    injuries: "दिखाई देने वाली चोटें हैं?",
    category: "यह किस प्रकार की आपात स्थिति है?",
    hospitals: "आस-पास के सहभागी अस्पताल",
    request: "रिसेप्शन का अनुरोध करें",
    waiting: "अस्पताल की प्रतिक्रिया की प्रतीक्षा",
    locationTitle: "स्थान साझा करना",
    shareLocation: "अनुमानित स्थान साझा करें",
    manualLocation: "स्थान टाइप करें",
    caseForm: "लाइव केस फॉर्म",
    incidentType: "घटना का प्रकार",
    emergencySummary: "आपात सारांश",
  },
  ta: {
    ...EN,
    listening: "கேட்கிறோம்",
    understanding: "புரிந்துகொள்கிறோம்",
    checking: "தகவலை சரிபார்க்கிறோம்",
    talk: "LIFE-LINK உடன் பேசுங்கள்",
    voiceUnavailable: "இந்த சாதனத்தில் குரல் உள்ளீடு கிடைக்கவில்லை. நீங்கள் தட்டச்சு செய்யலாம்.",
    typeInstead: "தட்டச்சு செய்க",
    yes: "ஆம்",
    no: "இல்லை",
    unknown: "தெரியாது",
    language: "மொழி",
    reporting: "யார் தெரிவிக்கிறார்?",
    selfMode: "நோயாளி அல்லது குடும்பம்",
    bystanderMode: "பார்த்தவர் அல்லது தெரியாத நோயாளி",
    tellWhatHappened: "என்ன நடந்தது என்பதை இயல்பாகச் சொல்லுங்கள்.",
    narrativeLabel: "அவசரநிலை விவரம்",
    analyze: "விவரத்தை புரிந்து கொள்",
    useDemoStatement: "டெமோ வாக்கியம் பயன்படுத்து",
    oneDetailMissing: "ஒரு விவரம் தேவை.",
    coreDetailsReady: "முக்கிய விவரங்கள் தயார்.",
    previous: "முந்தைய",
    next: "அடுத்து",
    patientKnown: "நோயாளியை அறிந்திருக்கிறீர்களா?",
    conscious: "நபர் நினைவில் உள்ளாரா?",
    breathing: "சாதாரணமாக மூச்சு விடுகிறாரா?",
    bleeding: "அதிக இரத்தப்போக்கு உள்ளதா?",
    bleedingLocation: "இரத்தப்போக்கு எங்கே?",
    injuries: "தெரியும் காயங்கள் உள்ளதா?",
    category: "இது எந்த வகை அவசரநிலை?",
    hospitals: "அருகிலுள்ள பங்கேற்பு மருத்துவமனைகள்",
    request: "வரவேற்பு கோரிக்கை",
    waiting: "மருத்துவமனை பதிலுக்காக காத்திருக்கிறது",
    locationTitle: "இடம் பகிர்வு",
    shareLocation: "தற்காலிக இடத்தை பகிரவும்",
    manualLocation: "இடத்தை தட்டச்சு செய்க",
    caseForm: "நேரடி வழக்கு படிவம்",
    incidentType: "சம்பவ வகை",
    emergencySummary: "அவசர சுருக்கம்",
  },
  kn: {
    ...EN,
    listening: "ಕೇಳುತ್ತಿದ್ದೇವೆ",
    understanding: "ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ",
    checking: "ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇವೆ",
    talk: "LIFE-LINK ಜೊತೆ ಮಾತನಾಡಿ",
    voiceUnavailable: "ಈ ಸಾಧನದಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು.",
    typeInstead: "ಟೈಪ್ ಮಾಡಿ",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    unknown: "ಗೊತ್ತಿಲ್ಲ",
    language: "ಭಾಷೆ",
    reporting: "ಯಾರು ವರದಿ ಮಾಡುತ್ತಿದ್ದಾರೆ?",
    selfMode: "ರೋಗಿ ಅಥವಾ ಕುಟುಂಬ",
    bystanderMode: "ನೋಡಿದವರು ಅಥವಾ ತಿಳಿಯದ ರೋಗಿ",
    tellWhatHappened: "ಏನಾಯಿತು ಎಂದು ಸಹಜವಾಗಿ ಹೇಳಿ.",
    narrativeLabel: "ತುರ್ತು ವಿವರಣೆ",
    analyze: "ವಿವರಗಳನ್ನು ಅರ್ಥಮಾಡಿ",
    useDemoStatement: "ಡೆಮೋ ವಾಕ್ಯ ಬಳಸಿ",
    oneDetailMissing: "ಒಂದು ವಿವರ ಬೇಕಿದೆ.",
    coreDetailsReady: "ಮುಖ್ಯ ವಿವರಗಳು ಸಿದ್ಧವಾಗಿವೆ.",
    previous: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    patientKnown: "ನಿಮಗೆ ರೋಗಿ ಗೊತ್ತಿದೆಯೇ?",
    conscious: "ವ್ಯಕ್ತಿ ಎಚ್ಚರವಾಗಿದ್ದಾರೆಯೇ?",
    breathing: "ಸಾಮಾನ್ಯವಾಗಿ ಉಸಿರಾಡುತ್ತಿದ್ದಾರೆಯೇ?",
    bleeding: "ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ ಇದೆಯೇ?",
    bleedingLocation: "ರಕ್ತಸ್ರಾವ ಎಲ್ಲಿ?",
    injuries: "ಕಾಣುವ ಗಾಯಗಳಿವೆಯೇ?",
    category: "ಇದು ಯಾವ ರೀತಿಯ ತುರ್ತು?",
    hospitals: "ಹತ್ತಿರದ ಪಾಲುದಾರ ಆಸ್ಪತ್ರೆಗಳು",
    request: "ಸ್ವೀಕಾರ ಕೋರಿಕೆ",
    waiting: "ಆಸ್ಪತ್ರೆಯ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಕಾಯುತ್ತಿದೆ",
    locationTitle: "ಸ್ಥಳ ಹಂಚಿಕೆ",
    shareLocation: "ಅಂದಾಜು ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ",
    manualLocation: "ಸ್ಥಳ ಟೈಪ್ ಮಾಡಿ",
    caseForm: "ಲೈವ್ ಪ್ರಕರಣ ಫಾರ್ಮ್",
    incidentType: "ಘಟನೆ ವಿಧ",
    emergencySummary: "ತುರ್ತು ಸಾರಾಂಶ",
  },
  ml: {
    ...EN,
    listening: "കേൾക്കുന്നു",
    understanding: "മനസ്സിലാക്കുന്നു",
    checking: "വിവരം പരിശോധിക്കുന്നു",
    talk: "LIFE-LINK നോട് സംസാരിക്കുക",
    voiceUnavailable: "ഈ ഉപകരണത്തിൽ ശബ്ദ ഇൻപുട്ട് ലഭ്യമല്ല. നിങ്ങൾക്ക് ടൈപ്പ് ചെയ്യാം.",
    typeInstead: "ടൈപ്പ് ചെയ്യുക",
    yes: "അതെ",
    no: "അല്ല",
    unknown: "അറിയില്ല",
    language: "ഭാഷ",
    reporting: "ആരാണ് അറിയിക്കുന്നത്?",
    selfMode: "രോഗി അല്ലെങ്കിൽ കുടുംബം",
    bystanderMode: "കണ്ട വ്യക്തി അല്ലെങ്കിൽ അറിയാത്ത രോഗി",
    tellWhatHappened: "എന്ത് സംഭവിച്ചുവെന്ന് സ്വാഭാവികമായി പറയുക.",
    narrativeLabel: "അടിയന്തര വിവരണം",
    analyze: "വിവരം മനസ്സിലാക്കുക",
    useDemoStatement: "ഡെമോ വാചകം ഉപയോഗിക്കുക",
    oneDetailMissing: "ഒരു വിവരം കൂടി വേണം.",
    coreDetailsReady: "പ്രധാന വിവരങ്ങൾ തയ്യാറാണ്.",
    previous: "മുൻപ്",
    next: "അടുത്തത്",
    patientKnown: "നിങ്ങൾക്ക് രോഗിയെ അറിയാമോ?",
    conscious: "വ്യക്തിക്ക് ബോധമുണ്ടോ?",
    breathing: "സാധാരണ ശ്വാസം എടുക്കുന്നുണ്ടോ?",
    bleeding: "കടുത്ത രക്തസ്രാവം ഉണ്ടോ?",
    bleedingLocation: "രക്തസ്രാവം എവിടെ?",
    injuries: "കാണാവുന്ന പരിക്കുകൾ ഉണ്ടോ?",
    category: "ഇത് ഏത് തരം അടിയന്തരാവസ്ഥയാണ്?",
    hospitals: "അടുത്തുള്ള പങ്കാളി ആശുപത്രികൾ",
    request: "സ്വീകരണം അഭ്യർത്ഥിക്കുക",
    waiting: "ആശുപത്രിയുടെ മറുപടിക്കായി കാത്തിരിക്കുന്നു",
    locationTitle: "സ്ഥലം പങ്കിടൽ",
    shareLocation: "അനുമാന സ്ഥലം പങ്കിടുക",
    manualLocation: "സ്ഥലം ടൈപ്പ് ചെയ്യുക",
    caseForm: "ലൈവ് കേസ് ഫോം",
    incidentType: "സംഭവ തരം",
    emergencySummary: "അടിയന്തര സംഗ്രഹം",
  },
  mr: {
    ...EN,
    listening: "ऐकत आहोत",
    understanding: "समजून घेत आहोत",
    checking: "माहिती तपासत आहोत",
    talk: "LIFE-LINK शी बोला",
    voiceUnavailable: "या डिव्हाइसवर आवाज इनपुट उपलब्ध नाही. तुम्ही टाइप करू शकता.",
    typeInstead: "टाइप करा",
    yes: "होय",
    no: "नाही",
    unknown: "माहित नाही",
    language: "भाषा",
    reporting: "कोण माहिती देत आहे?",
    selfMode: "रुग्ण किंवा कुटुंब",
    bystanderMode: "प्रत्यक्षदर्शी किंवा अज्ञात रुग्ण",
    tellWhatHappened: "काय झाले ते साध्या भाषेत सांगा.",
    narrativeLabel: "आपत्कालीन वर्णन",
    analyze: "विवरण समजून घ्या",
    useDemoStatement: "डेमो वाक्य वापरा",
    oneDetailMissing: "एक माहिती बाकी आहे.",
    coreDetailsReady: "मुख्य माहिती तयार आहे.",
    previous: "मागे",
    next: "पुढे",
    patientKnown: "तुम्हाला रुग्ण माहिती आहे का?",
    conscious: "व्यक्ती शुद्धीत आहे?",
    breathing: "सामान्यपणे श्वास घेत आहे?",
    bleeding: "जास्त रक्तस्राव आहे?",
    bleedingLocation: "रक्तस्राव कुठे आहे?",
    injuries: "दिसणाऱ्या जखमा आहेत?",
    category: "ही कोणत्या प्रकारची आपत्कालीन स्थिती आहे?",
    hospitals: "जवळील सहभागी रुग्णालये",
    request: "स्वीकार विनंती पाठवा",
    waiting: "रुग्णालयाच्या प्रतिसादाची प्रतीक्षा",
    locationTitle: "स्थान शेअर करणे",
    shareLocation: "अंदाजे स्थान शेअर करा",
    manualLocation: "स्थान टाइप करा",
    caseForm: "लाईव्ह केस फॉर्म",
    incidentType: "घटनेचा प्रकार",
    emergencySummary: "आपत्कालीन सारांश",
  },
  bn: {
    ...EN,
    listening: "শুনছি",
    understanding: "বোঝা হচ্ছে",
    checking: "তথ্য যাচাই করা হচ্ছে",
    talk: "LIFE-LINK এর সাথে কথা বলুন",
    voiceUnavailable: "এই ডিভাইসে ভয়েস ইনপুট নেই. আপনি টাইপ করতে পারেন.",
    typeInstead: "টাইপ করুন",
    yes: "হ্যাঁ",
    no: "না",
    unknown: "জানি না",
    language: "ভাষা",
    reporting: "কে জানাচ্ছেন?",
    selfMode: "রোগী বা পরিবার",
    bystanderMode: "প্রত্যক্ষদর্শী বা অজানা রোগী",
    tellWhatHappened: "যা ঘটেছে স্বাভাবিক ভাষায় বলুন.",
    narrativeLabel: "জরুরি বিবরণ",
    analyze: "বিবরণ বুঝুন",
    useDemoStatement: "ডেমো বাক্য ব্যবহার করুন",
    oneDetailMissing: "একটি তথ্য বাকি আছে.",
    coreDetailsReady: "মূল তথ্য প্রস্তুত.",
    previous: "আগের",
    next: "পরের",
    patientKnown: "আপনি কি রোগীকে চেনেন?",
    conscious: "ব্যক্তি সজ্ঞান আছেন?",
    breathing: "স্বাভাবিকভাবে শ্বাস নিচ্ছেন?",
    bleeding: "প্রচুর রক্তক্ষরণ হচ্ছে?",
    bleedingLocation: "রক্তক্ষরণ কোথায়?",
    injuries: "দৃশ্যমান আঘাত আছে?",
    category: "এটি কী ধরনের আপৎকাল?",
    hospitals: "নিকটবর্তী অংশগ্রহণকারী হাসপাতাল",
    request: "গ্রহণের অনুরোধ পাঠান",
    waiting: "হাসপাতালের উত্তরের অপেক্ষা",
    locationTitle: "অবস্থান ভাগ করা",
    shareLocation: "আনুমানিক অবস্থান ভাগ করুন",
    manualLocation: "অবস্থান টাইপ করুন",
    caseForm: "লাইভ কেস ফর্ম",
    incidentType: "ঘটনার ধরন",
    emergencySummary: "জরুরি সারাংশ",
  },
};

export interface CategoryDef {
  id: CategoryId;
  code: string;
  label: string;
  labels?: Partial<Record<LangCode, string>>;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "road", code: "RTI", label: "Road Traffic Incident" },
  { id: "bike", code: "BIKE", label: "Bike Accident" },
  { id: "cardiac", code: "CARD", label: "Cardiac or Chest Pain" },
  { id: "breathing", code: "RESP", label: "Breathing Difficulty" },
  { id: "burn", code: "BURN", label: "Burn Injury" },
  { id: "fall", code: "FALL", label: "Fall or Head Injury" },
  { id: "stroke", code: "NEURO", label: "Stroke Symptoms" },
  { id: "other", code: "OTHER", label: "Other Emergency" },
];

export function getCategoryLabel(id: string | null, language: LangCode = "en") {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) return UI[language].notProvided;
  return category.labels?.[language] ?? category.label;
}

export const HOSPITALS: Hospital[] = [
  {
    id: "alpha",
    name: "Demo Hospital Alpha",
    distanceKm: 3.2,
    etaMin: 8,
    capabilities: ["Emergency Department", "Trauma", "ICU", "CT / Imaging", "Blood Bank"],
    teamStatus: ["Trauma team available", "CT ready", "Ambulance receiving open"],
    status: "accepting",
    lastUpdated: "2 min ago",
    demo: true,
  },
  {
    id: "trauma",
    name: "Demo Trauma Center",
    distanceKm: 6.8,
    etaMin: 14,
    capabilities: ["Emergency Department", "Trauma", "Neurosurgery", "ICU"],
    teamStatus: ["Neurosurgery on-call", "Trauma bay limited"],
    status: "limited",
    lastUpdated: "4 min ago",
    demo: true,
  },
  {
    id: "city",
    name: "City Hospital",
    distanceKm: 9.4,
    etaMin: 21,
    capabilities: ["Emergency Department", "Cardiac Emergency", "ICU", "Dialysis"],
    teamStatus: ["Cardiac team status reported", "Emergency receiving paused"],
    status: "unable",
    lastUpdated: "1 min ago",
    demo: true,
  },
];

export const STATUS_META: Record<ReceivingStatus, { label: string; short: string }> = {
  accepting: { label: "ACCEPTING", short: "Open" },
  limited: { label: "LIMITED", short: "Limited" },
  unable: { label: "UNABLE TO RECEIVE", short: "Unable" },
};

export const PHASE_META: Record<CasePhase, { step: number; label: string }> = {
  created: { step: 1, label: "CREATED" },
  information_collecting: { step: 2, label: "INFORMATION COLLECTING" },
  ready: { step: 2, label: "READY" },
  request_sent: { step: 3, label: "REQUEST SENT" },
  hospital_reviewing: { step: 3, label: "HOSPITAL REVIEWING" },
  hospital_accepted: { step: 4, label: "HOSPITAL ACCEPTED" },
  hospital_review: { step: 3, label: "NEEDS REVIEW" },
  hospital_unable: { step: 3, label: "HOSPITAL UNABLE" },
  travelling: { step: 5, label: "TRAVELLING" },
  preparing: { step: 6, label: "PREPARING" },
  arrived: { step: 7, label: "ARRIVED" },
};

export const TIMELINE_STEPS = [
  "Emergency Started",
  "Information Collected",
  "Request Sent",
  "Hospital Acknowledged",
  "Travelling",
  "Preparing",
  "Arrived",
] as const;

export const DEMO_STATEMENTS: Record<LangCode, string> = {
  en: "My brother was hit by a car near the highway junction. He is unconscious, breathing, and bleeding from his head.",
  te: "హైవే జంక్షన్ దగ్గర నా అన్నను కారు ఢీకొట్టింది. అతను స్పందించడం లేదు, శ్వాస ఉంది, తల నుంచి రక్తం కారుతోంది.",
  hi: "हाईवे जंक्शन के पास मेरे भाई को कार ने टक्कर मारी. वह होश में नहीं है, सांस चल रही है और सिर से खून बह रहा है.",
  ta: "நெடுஞ்சாலை சந்திப்பில் என் அண்ணனை கார் மோதி விட்டது. அவர் பதில் சொல்லவில்லை, மூச்சு உள்ளது, தலையில் இரத்தப்போக்கு உள்ளது.",
  kn: "ಹೆದ್ದಾರಿ ಜಂಕ್ಷನ್ ಬಳಿ ನನ್ನ ಅಣ್ಣನಿಗೆ ಕಾರು ಡಿಕ್ಕಿಯಾಗಿದೆ. ಅವರು ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಿಲ್ಲ, ಉಸಿರಾಟ ಇದೆ, ತಲೆಯಿಂದ ರಕ್ತಸ್ರಾವವಾಗುತ್ತಿದೆ.",
  ml: "ഹൈവേ ജംഗ്ഷനടുത്ത് എന്റെ സഹോദരനെ കാർ ഇടിച്ചു. പ്രതികരിക്കുന്നില്ല, ശ്വാസം ഉണ്ട്, തലയിൽ നിന്ന് രക്തസ്രാവം ഉണ്ട്.",
  mr: "महामार्ग जंक्शनजवळ माझ्या भावाला कारने धडक दिली. तो प्रतिसाद देत नाही, श्वास चालू आहे आणि डोक्यातून रक्त येत आहे.",
  bn: "হাইওয়ে জংশনের কাছে আমার ভাইকে গাড়ি ধাক্কা দিয়েছে. তিনি সাড়া দিচ্ছেন না, শ্বাস নিচ্ছেন, মাথা থেকে রক্ত পড়ছে.",
};

/** Simulated speech transcript lines per language, used only for the judge demo. */
export const TRANSCRIPTS: Record<LangCode, string[]> = Object.fromEntries(
  Object.entries(DEMO_STATEMENTS).map(([code, text]) => [code, text.split(/(?<=[.।])\s+/).filter(Boolean)]),
) as Record<LangCode, string[]>;

export function makeTempId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)] ?? "X";
  }
  return `LL-${suffix}`;
}
