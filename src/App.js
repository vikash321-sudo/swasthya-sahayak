import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { C } from "./constants/colors";
import { SYMPTOMS } from "./data/symptomsData";
import { DOCTORS } from "./data/doctorsData";
import {
  Home,
  Stethoscope,
  ShieldPlus,
  MessageCircle,
  UserRound,
  Menu,
  Info,
  Siren,
  PhoneCall,
  Search,
  Bell,
  LogOut,
  Languages,
  HeartPulse,
  CalendarDays,
  Mic,
  Send,
  ArrowLeft,
  ChevronRight,
  Star,
  Clock,
  ClipboardList,
} from "lucide-react";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

// ─── Nepal Geographic Data ─────────────────────────────────────
const PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const DISTRICTS_BY_PROVINCE = {
  Koshi: [
    "Taplejung",
    "Panchthar",
    "Ilam",
    "Jhapa",
    "Morang",
    "Sunsari",
    "Dhankuta",
    "Terhathum",
    "Sankhuwasabha",
    "Bhojpur",
    "Solukhumbu",
    "Okhaldhunga",
    "Khotang",
    "Udayapur",
  ],
  Madhesh: [
    "Saptari",
    "Siraha",
    "Dhanusha",
    "Mahottari",
    "Sarlahi",
    "Rautahat",
    "Bara",
    "Parsa",
  ],
  Bagmati: [
    "Kathmandu",
    "Bhaktapur",
    "Lalitpur",
    "Kavrepalanchok",
    "Sindhupalchok",
    "Dolakha",
    "Rasuwa",
    "Dhading",
    "Nuwakot",
    "Makwanpur",
    "Chitwan",
    "Sindhuli",
    "Ramechhap",
  ],
  Gandaki: [
    "Kaski",
    "Syangja",
    "Parbat",
    "Baglung",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Gorkha",
    "Lamjung",
    "Tanahu",
    "Manang",
  ],
  Lumbini: [
    "Rupandehi",
    "Kapilvastu",
    "Arghakhanchi",
    "Gulmi",
    "Palpa",
    "Nawalparasi West",
    "Dang",
    "Pyuthan",
    "Rolpa",
    "Rukum East",
    "Banke",
    "Bardiya",
  ],
  Karnali: [
    "Surkhet",
    "Dailekh",
    "Jajarkot",
    "Dolpa",
    "Mugu",
    "Humla",
    "Jumla",
    "Kalikot",
    "Rukum West",
    "Salyan",
  ],
  Sudurpashchim: [
    "Kanchanpur",
    "Kailali",
    "Dadeldhura",
    "Doti",
    "Baitadi",
    "Darchula",
    "Bajhang",
    "Bajura",
    "Achham",
  ],
};

const LOCAL_LEVELS = {
  Kathmandu: [
    "Kathmandu Metro",
    "Kirtipur",
    "Gokarneshwar",
    "Budhanilkantha",
    "Tokha",
    "Tarakeshwar",
    "Nagarjun",
    "Kageshwori Manohara",
    "Dakshinkali",
    "Chandragiri",
    "Shankharapur",
  ],
  Lalitpur: ["Lalitpur Metro", "Godawari", "Mahalaxmi", "Konjyosom RM", "Bagmati RM", "Mahankal RM"],
  Bhaktapur: ["Bhaktapur", "Madhyapur Thimi", "Changunarayan", "Suryabinayak"],
  Chitwan: ["Bharatpur Metro", "Ratnanagar", "Khairhani", "Madi", "Ichchhyakamana RM", "Rapti", "Kalika"],
  Kaski: ["Pokhara Metro", "Annapurna RM", "Madi RM", "Machhapuchhre RM", "Rupa RM"],
  Rupandehi: ["Butwal Sub-Metro", "Tilottama", "Devdaha", "Lumbini Sanskritik", "Sainamaina", "Maya Devi RM", "Rohini RM"],
  Morang: ["Biratnagar Metro", "Rangeli", "Sundarharaicha", "Urlabari", "Letang", "Belbari", "Pathari Shanischare"],
  Sunsari: ["Inaruwa", "Dharan Sub-Metro", "Itahari Sub-Metro", "Duhabi", "Barahakshetra", "Ramdhuni"],
  Jhapa: ["Birtamod", "Mechinagar", "Bhadrapur", "Damak", "Kankai", "Arjundhara", "Buddhashanti RM"],
  Parsa: ["Birgunj Metro", "Bahudarmai", "Pokhariya", "Parsagadhi", "Thori RM", "Bindabasini RM"],
  Dhanusha: ["Janakpurdham Sub-Metro", "Chhireshwornath", "Dhanushadham", "Mithila", "Nagarain", "Sabaila"],
  Banke: ["Nepalgunj Sub-Metro", "Kohalpur", "Narainapur RM", "Baijanath RM", "Khajura RM", "Raptisonari RM"],
  Kailali: ["Dhangadhi Sub-Metro", "Godawari", "Tikapur", "Gauriganga", "Ghodaghodi", "Lamkichuha", "Kailari RM"],
  Surkhet: ["Birendranagar", "Bheriganga", "Lekbesi", "Gurbhakot", "Panchpuri", "Chaukune RM"],
};

function getLocalLevels(district) {
  return LOCAL_LEVELS[district] || [
    `${district} Municipality`,
    `${district} Rural Municipality`,
    "Other Local Level",
  ];
}

// ─── Transliteration ───────────────────────────────────────────
const WM = {
  tauko: "टाउको",
  dukhxa: "दुख्छ",
  dukhcha: "दुख्छ",
  dukcha: "दुख्छ",
  jworo: "ज्वरो",
  jwaro: "ज्वरो",
  fever: "ज्वरो",
  pet: "पेट",
  khansi: "खाँसी",
  cough: "खाँसी",
  ulti: "उल्टी",
  chhati: "छाती",
  chest: "छाती",
  chakkar: "चक्कर",
  sas: "सास",
  saas: "सास",
  garho: "गाह्रो",
  paani: "पानी",
  dherai: "धेरै",
};

function r2n(t) {
  if (!t || /[\u0900-\u097F]/.test(t)) return null;
  const w = t
    .toLowerCase()
    .split(/\s+/)
    .map((x) => WM[x] || x)
    .join(" ");
  return w !== t.toLowerCase() ? w : null;
}

function isRom(t) {
  if (!t || /[\u0900-\u097F]/.test(t)) return false;
  return Object.keys(WM).some((k) => t.toLowerCase().includes(k));
}

// ─── First Aid ──────────────────────────────────────────────────
const FIRST_AID = [
  {
    id: "fever",
    icon: "🌡️",
    color: C.orange,
    bg: C.orangeLight,
    en: "Fever",
    ne: "ज्वरो",
    stepsEn: [
      "Check temperature with a thermometer.",
      "Give paracetamol only if appropriate and available.",
      "Give plenty of fluids such as water or ORS.",
      "Apply a cool damp cloth on the forehead.",
      "Keep the patient in a cool, ventilated room.",
    ],
    stepsNe: [
      "थर्मोमिटरले तापक्रम जाँच्नुहोस्।",
      "उपयुक्त र उपलब्ध भए मात्र पारासिटामोल दिनुहोस्।",
      "पानी वा ORS जस्ता तरल पदार्थ धेरै दिनुहोस्।",
      "निधारमा चिसो भिजेको कपडा राख्नुहोस्।",
      "चिसो र हावादार कोठामा राख्नुहोस्।",
    ],
    whenEn: "Fever above 40°C, seizure, rash, breathing difficulty, or fever lasting 3+ days.",
    whenNe: "ज्वरो ४०°C भन्दा बढी, थर्थराइ, छाला दाग, सास गाह्रो, वा ३ दिनभन्दा बढी ज्वरो।",
    noteEn: "This is basic first aid. Persistent fever needs medical evaluation.",
    noteNe: "यो सामान्य प्राथमिक उपचार हो। ज्वरो नरोकिए डाक्टर देखाउनुहोस्।",
  },
  {
    id: "wound",
    icon: "🩹",
    color: C.orange,
    bg: C.orangeLight,
    en: "Wound / Cut",
    ne: "घाउ / काटा",
    stepsEn: [
      "Apply firm pressure with a clean cloth to stop bleeding.",
      "Rinse under clean running water for 5–10 minutes.",
      "Apply antiseptic if available.",
      "Cover with a clean bandage.",
      "Change dressing daily and keep it dry.",
    ],
    stepsNe: [
      "सफा कपडाले थिचेर रगत रोक्नुहोस्।",
      "सफा बग्ने पानीले ५–१० मिनेट धुनुहोस्।",
      "उपलब्ध भए एन्टिसेप्टिक लगाउनुहोस्।",
      "सफा पट्टीले छोप्नुहोस्।",
      "दैनिक पट्टी बदल्नुहोस् र सुख्खा राख्नुहोस्।",
    ],
    whenEn: "Deep wound, uncontrolled bleeding, infection signs, animal bite, or rusty object injury.",
    whenNe: "गहिरो घाउ, रगत नरोकिएको, संक्रमण, जनावरको टोकाइ, वा खिया लागेको वस्तुले काटेको।",
    noteEn: "Check tetanus vaccination for deep or dirty wounds.",
    noteNe: "गहिरो वा फोहोर घाउमा टिटानस खोपको अवस्था जाँच गर्नुहोस्।",
  },
  {
    id: "burn",
    icon: "🔥",
    color: C.red,
    bg: C.redLight,
    en: "Burn",
    ne: "जलन",
    stepsEn: [
      "Cool with running water, not ice, for 10–20 minutes.",
      "Remove jewellery near the burn if possible.",
      "Do not apply butter, oil, toothpaste, or ice.",
      "Cover loosely with a clean cloth.",
      "Seek help for large, deep, or face/hand burns.",
    ],
    stepsNe: [
      "चिसो बग्ने पानीले १०–२० मिनेट राख्नुहोस्, बरफ होइन।",
      "सम्भव भए जलन नजिकका गहना हटाउनुहोस्।",
      "मक्खन, तेल, टुथपेस्ट वा बरफ नलगाउनुहोस्।",
      "सफा कपडाले ढिलो छोप्नुहोस्।",
      "ठूलो, गहिरो वा अनुहार/हातमा जलन भए सहायता लिनुहोस्।",
    ],
    whenEn: "Burn larger than palm, face/hands/feet/joints, white or black skin, chemical/electric burn.",
    whenNe: "हत्केलाभन्दा ठूलो जलन, अनुहार/हात/खुट्टा/जोर्नीमा, कालो/सेतो छाला, रासायनिक/विद्युतीय जलन।",
    noteEn: "Never burst blisters. Serious burns need urgent care.",
    noteNe: "फोका नफोड्नुहोस्। गम्भीर जलनमा तुरुन्त उपचार चाहिन्छ।",
  },
  {
    id: "fainting",
    icon: "😵",
    color: C.purple,
    bg: C.purpleLight,
    en: "Fainting",
    ne: "बेहोस हुनु",
    stepsEn: [
      "Lay the person flat on their back.",
      "Raise legs slightly above heart level.",
      "Loosen tight clothing.",
      "Check breathing.",
      "Do not give food or drink until fully awake.",
    ],
    stepsNe: [
      "व्यक्तिलाई पिठ्यूँमा सुताउनुहोस्।",
      "खुट्टा मुटुभन्दा अलि माथि उठाउनुहोस्।",
      "कसिलो कपडा फुकाउनुहोस्।",
      "सास जाँच्नुहोस्।",
      "पूरै होश नआएसम्म खाना/पानी नदिनुहोस्।",
    ],
    whenEn: "No recovery within 1 minute, head injury, pregnancy, chest pain, or breathing problem.",
    whenNe: "१ मिनेटमा होश नआए, टाउको चोट, गर्भावस्था, छाती दुखाई वा सास समस्या।",
    noteEn: "Call 102 if consciousness does not return quickly.",
    noteNe: "छिटो होश नआए 102 मा फोन गर्नुहोस्।",
  },
  {
    id: "chestpain",
    icon: "💔",
    color: C.red,
    bg: C.redLight,
    en: "Chest Pain",
    ne: "छाती दुखाई",
    stepsEn: [
      "Call 102 immediately.",
      "Help the person sit or lie comfortably.",
      "Loosen tight clothing.",
      "Keep the person calm.",
      "Do not leave them alone.",
    ],
    stepsNe: [
      "तुरुन्त 102 मा फोन गर्नुहोस्।",
      "व्यक्तिलाई आरामदायक अवस्थामा बसाउनुहोस् वा सुताउनुहोस्।",
      "कसिलो कपडा फुकाउनुहोस्।",
      "व्यक्तिलाई शान्त राख्नुहोस्।",
      "एक्लो नछोड्नुहोस्।",
    ],
    whenEn: "All chest pain should be treated seriously, especially with sweating, breathlessness, or arm/jaw pain.",
    whenNe: "छाती दुखाईलाई गम्भीर लिनुहोस्, विशेष गरी पसिना, सास गाह्रो, वा हात/बङ्गारा दुखाई भए।",
    noteEn: "Chest pain can be life-threatening. Do not wait.",
    noteNe: "छाती दुखाई जीवन जोखिमपूर्ण हुन सक्छ। ढिला नगर्नुहोस्।",
  },
  {
    id: "snakebite",
    icon: "🐍",
    color: C.green,
    bg: C.greenLight,
    en: "Snake Bite",
    ne: "सर्पदंश",
    stepsEn: [
      "Call 102 and go to hospital immediately.",
      "Keep the person still and calm.",
      "Remove tight items near the bite.",
      "Mark the bite site and note the time.",
      "Do not cut, suck, or apply a tourniquet.",
    ],
    stepsNe: [
      "तुरुन्त 102 मा फोन गरेर अस्पताल जानुहोस्।",
      "व्यक्तिलाई शान्त र स्थिर राख्नुहोस्।",
      "टोकाइ नजिकका कसिलो वस्तु हटाउनुहोस्।",
      "टोकाइ चिन्ह लगाएर समय नोट गर्नुहोस्।",
      "काट्नु, चुस्नु वा टोर्निकेट लगाउनु हुँदैन।",
    ],
    whenEn: "All snake bites need urgent hospital care.",
    whenNe: "सबै सर्पदंशमा तुरुन्त अस्पताल जानुपर्छ।",
    noteEn: "Traditional cutting/sucking methods can worsen harm.",
    noteNe: "काट्ने/चुस्ने परम्परागत उपायले हानि बढाउन सक्छ।",
  },
  {
    id: "foodpoisoning",
    icon: "🤢",
    color: C.orange,
    bg: C.orangeLight,
    en: "Food Poisoning",
    ne: "खाना विषाक्तता",
    stepsEn: [
      "Give ORS frequently in small sips.",
      "Avoid oily, spicy, or heavy food.",
      "Eat bland food when able.",
      "Watch for dehydration signs.",
      "Seek help if severe symptoms continue.",
    ],
    stepsNe: [
      "ORS थोरथोर गरी बारम्बार दिनुहोस्।",
      "तेलिलो, मसालेदार वा भारी खाना नदिनुहोस्।",
      "खान सकेपछि हल्का खाना दिनुहोस्।",
      "निर्जलीकरणको लक्षण हेर्नुहोस्।",
      "गम्भीर लक्षण जारी रहे सहायता लिनुहोस्।",
    ],
    whenEn: "Blood in stool/vomit, severe dehydration, high fever, or symptoms lasting 2+ days.",
    whenNe: "दिसा/उल्टीमा रगत, गम्भीर निर्जलीकरण, उच्च ज्वरो, वा २ दिनभन्दा बढी लक्षण।",
    noteEn: "Small frequent fluids are better than large amounts at once.",
    noteNe: "एकैपटक धेरैभन्दा थोरथोर गरी बारम्बार तरल दिनु राम्रो।",
  },
  {
    id: "electricshock",
    icon: "⚡",
    color: C.purple,
    bg: C.purpleLight,
    en: "Electric Shock",
    ne: "विद्युत झटका",
    stepsEn: [
      "Do not touch the person until electricity is off.",
      "Switch off the power source.",
      "Call 102 immediately.",
      "Check breathing and consciousness.",
      "Treat visible burns with cool water after safety is ensured.",
    ],
    stepsNe: [
      "बिजुली बन्द नगरी व्यक्तिलाई नछुनुहोस्।",
      "बिजुलीको स्रोत बन्द गर्नुहोस्।",
      "तुरुन्त 102 मा फोन गर्नुहोस्।",
      "सास र होश जाँच्नुहोस्।",
      "सुरक्षा भएपछि देखिने जलनमा चिसो पानी प्रयोग गर्नुहोस्।",
    ],
    whenEn: "All electric shock cases should be checked by a doctor.",
    whenNe: "सबै विद्युत झटका भएका व्यक्तिलाई डाक्टरले जाँच्नुपर्छ।",
    noteEn: "Internal injury may not be visible.",
    noteNe: "भित्री चोट बाहिरबाट नदेखिन सक्छ।",
  },
];

// ─── AI ────────────────────────────────────────────────────────
async function askAI(text, history, lang) {
  const conv = isRom(text) ? r2n(text) : null;
  const msg = conv ? `${text} (meaning: ${conv})` : text;
  const sys =
    lang === "en"
      ? "You are Swasthya Sahayak, a warm AI health assistant for Nepal. Be conversational and brief — 2-4 sentences max. For new symptoms, ask 1-2 clarifying questions first: how long, severity, age, fever, medicine, other symptoms. Once enough context is available, give practical guidance in paragraph form. Never diagnose. For emergencies say 'Call 102 now' first. Suggest a real doctor for serious or persistent symptoms."
      : "तपाईं स्वास्थ्य सहायक हुनुहुन्छ — नेपालका मानिसहरूको लागि मित्रवत् AI स्वास्थ्य सहायक। कुराकानी शैलीमा संक्षिप्त जवाफ दिनुहोस् — अधिकतम २-४ वाक्य। नयाँ लक्षणमा पहिले १-२ प्रश्न सोध्नुहोस्: कति दिनदेखि, कत्तिको तीव्र, ज्वरो छ कि छैन, औषधि लिएको छ कि छैन, अरू लक्षण छन् कि छैनन्। पर्याप्त जानकारीपछि व्यवहारिक सल्लाह दिनुहोस्। पक्का निदान नगर्नुहोस्। आपतकालमा पहिले 'अहिले 102 मा फोन गर्नुहोस्' भन्नुहोस्।";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 350,
      messages: [{ role: "system", content: sys }, ...history, { role: "user", content: msg }],
    }),
  });

  const d = await res.json();
  return d.choices?.[0]?.message?.content || (lang === "en" ? "Sorry, try again." : "माफ गर्नुहोस्, पुनः प्रयास गर्नुहोस्।");
}

// ─── Small Components ──────────────────────────────────────────
function Av({ init, color, size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {init}
    </div>
  );
}

function Sh({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{title}</span>
      {action && (
        <button
          onClick={onAction}
          style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          {action} ›
        </button>
      )}
    </div>
  );
}

function MedicalDisclaimer({ lang, compact = false }) {
  return (
    <div
      style={{
        background: C.primaryLight,
        border: "1px solid #BFDBFE",
        borderRadius: compact ? 10 : 14,
        padding: compact ? "9px 12px" : "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        marginBottom: compact ? 12 : 16,
      }}
    >
      <Info size={16} color={C.primary} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ fontSize: compact ? 11 : 12, color: C.primaryDark, lineHeight: 1.55, fontWeight: 500 }}>
        {lang === "en"
          ? "Swasthya Sahayak gives basic health guidance only. It does not replace a doctor. In emergencies, call 102 or visit the nearest hospital."
          : "स्वास्थ्य सहायकले सामान्य स्वास्थ्य मार्गदर्शन मात्र दिन्छ। यसले डाक्टरलाई प्रतिस्थापन गर्दैन। आपतकालमा 102 मा फोन गर्नुहोस् वा नजिकको अस्पताल जानुहोस्।"}
      </div>
    </div>
  );
}

function IconTile({ Icon, label, onClick, bg, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        borderRadius: 12,
        padding: "12px 8px",
        cursor: "pointer",
        border: `1px solid ${color}22`,
        textAlign: "center",
        fontFamily: "inherit",
      }}
    >
      <Icon size={24} color={color} style={{ marginBottom: 5 }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{label}</div>
    </button>
  );
}

// ─── Voice Input ───────────────────────────────────────────────
function VoiceInput({ input, setInput, onSend, loading, lang }) {
  const [on, setOn] = useState(false);
  const ref = useRef(null);

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(lang === "en" ? "Voice input is not supported. Please use Chrome." : "Voice input support छैन। Chrome प्रयोग गर्नुहोस्।");
      return;
    }
    const r = new SR();
    r.lang = lang === "ne" ? "ne-NP" : "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    ref.current = r;
    r.onstart = () => setOn(true);
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.start();
  }

  function stop() {
    ref.current?.stop();
    setOn(false);
  }

  return (
    <div>
      {on && (
        <div style={{ marginBottom: 8, padding: "8px 14px", background: C.primaryLight, borderRadius: 10, fontSize: 12, color: C.primary, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <Mic size={14} /> {lang === "ne" ? "सुनिरहेको छु..." : "Listening..."}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={lang === "ne" ? "लक्षण बताउनुहोस्..." : "Describe your symptoms..."}
          style={{
            flex: 1,
            border: `1.5px solid ${on ? C.primary : C.border}`,
            borderRadius: 24,
            padding: "11px 18px",
            fontSize: 14,
            fontFamily: "inherit",
            color: C.text,
            outline: "none",
            background: C.bg,
          }}
        />
        <button
          onClick={on ? stop : start}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            flexShrink: 0,
            background: on ? "#FEE2E2" : C.primaryLight,
            border: `2px solid ${on ? C.red : C.primary}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mic size={20} color={on ? C.red : C.primary} />
        </button>
        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            flexShrink: 0,
            background: input.trim() && !loading ? C.primary : C.border,
            border: "none",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────
function Drawer({ open, onClose, setTab, user, onLogout, lang, onLangChange }) {
  if (!open) return null;
  const items = [
    { icon: UserRound, label: lang === "en" ? "Profile" : "प्रोफाइल", tab: "profile" },
    { icon: Bell, label: lang === "en" ? "Follow-up" : "फलो-अप", tab: "followup" },
    { icon: ClipboardList, label: lang === "en" ? "Health History" : "स्वास्थ्य इतिहास", tab: "history" },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: C.white, zIndex: 201, boxShadow: "4px 0 20px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)", padding: "32px 20px 20px", color: "#fff" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <UserRound size={25} color="#fff" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{user?.name || "User"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{[user?.local_level, user?.district].filter(Boolean).join(", ") || "Nepal"}</div>
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "4px 9px", fontSize: 10, fontWeight: 700 }}>
            Beta User
          </div>
        </div>

        <div style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {items.map((it) => (
            <button
              key={it.tab}
              onClick={() => {
                setTab(it.tab);
                onClose();
              }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: C.text, textAlign: "left" }}
            >
              <it.icon size={20} color={C.primary} /> {it.label}
            </button>
          ))}

          <div style={{ margin: "12px 16px", height: 1, background: C.border }} />
          <div style={{ padding: "8px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
              <Languages size={14} /> {lang === "en" ? "Language" : "भाषा"}
            </div>
            <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 3, gap: 3 }}>
              {[
                ["en", "English"],
                ["ne", "नेपाली"],
              ].map(([l, label]) => (
                <button key={l} onClick={() => onLangChange(l)} style={{ flex: 1, background: lang === l ? C.white : "transparent", color: lang === l ? C.primary : C.textLight, border: "none", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ width: "100%", background: C.redLight, color: C.red, border: "1px solid #FECACA", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <LogOut size={16} /> {lang === "en" ? "Sign Out" : "साइन आउट"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────
function NavBar({ tab, setTab, lang }) {
  const L = { en: ["Home", "Symptoms", "First Aid", "Chat", "Doctors"], ne: ["घर", "लक्षण", "प्राथमिक", "सहायक", "डाक्टर"] };
  const items = [
    { id: "home", Icon: Home },
    { id: "check", Icon: Stethoscope },
    { id: "firstaid", Icon: ShieldPlus },
    { id: "chat", Icon: MessageCircle },
    { id: "doctors", Icon: UserRound },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 100, boxShadow: "0 -1px 8px rgba(0,0,0,0.06)" }}>
      {items.map((it, i) => {
        const a = tab === it.id;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{ flex: 1, padding: "8px 2px 10px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderTop: `2px solid ${a ? C.primary : "transparent"}` }}>
            <it.Icon size={20} color={a ? C.primary : C.textLight} strokeWidth={a ? 2.8 : 2.1} />
            <span style={{ fontSize: 9, fontWeight: a ? 800 : 500, color: a ? C.primary : C.textLight, fontFamily: "inherit" }}>{L[lang][i]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Auth Screen ───────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [localLevel, setLocalLevel] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const districts = province ? DISTRICTS_BY_PROVINCE[province] || [] : [];
  const localLevels = district ? getLocalLevels(district) : [];

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(lang === "en" ? "Fill all required fields." : "सबै अनिवार्य फिल्ड भर्नुहोस्।");
      return;
    }
    if (password.length < 6) {
      setError(lang === "en" ? "Password must be at least 6 characters." : "पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ।");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) throw err;
      if (!data.user) throw new Error(lang === "en" ? "Please confirm your email, then login." : "कृपया इमेल पुष्टि गरेर लग इन गर्नुहोस्।");
      const uid = data.user.id;
      const profile = { user_id: uid, name: name.trim(), age, province, district, local_level: localLevel, lang, phone };
      await supabase.from("health_profiles").insert([profile]);
      localStorage.setItem("ss_user", JSON.stringify(profile));
      onLogin(profile);
    } catch (e) {
      setError(e.message || "Error. Try again.");
    }
    setLoading(false);
  }

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError(lang === "en" ? "Fill all required fields." : "सबै अनिवार्य फिल्ड भर्नुहोस्।");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      const uid = data.user.id;
      const { data: profile } = await supabase.from("health_profiles").select("*").eq("user_id", uid).single();
      const u = profile || { user_id: uid, name: email.split("@")[0], lang: "en" };
      localStorage.setItem("ss_user", JSON.stringify(u));
      onLogin(u);
    } catch (e) {
      setError(e.message || "Invalid credentials.");
    }
    setLoading(false);
  }

  const inputStyle = { width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", color: C.text, outline: "none", boxSizing: "border-box", background: C.white };
  const inp = (v, s, t = "text", ph = "") => <input value={v} onChange={(e) => s(e.target.value)} type={t} placeholder={ph} style={inputStyle} />;
  const sel = (v, s, opts, ph) => (
    <select value={v} onChange={(e) => s(e.target.value)} style={{ ...inputStyle, color: v ? C.text : C.textLight }}>
      <option value="">{ph}</option>
      {opts.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#1D4ED8 0%,#2563EB 45%,#0D9488 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Noto Sans Devanagari',system-ui,sans-serif" }}>
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 3, gap: 2 }}>
        {["en", "ne"].map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? "#fff" : "transparent", color: lang === l ? C.primary : "#fff", border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            {l === "en" ? "English" : "नेपाली"}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 68, height: 68, borderRadius: 18, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <HeartPulse size={34} color="#fff" />
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{lang === "en" ? "Swasthya Sahayak" : "स्वास्थ्य सहायक"}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>Nepal AI Health Assistant · Beta</div>
      </div>

      <div style={{ background: C.white, borderRadius: 20, padding: 24, width: "100%", maxWidth: 390, boxShadow: "0 24px 48px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 4, marginBottom: 20, gap: 4 }}>
          {[
            ["login", lang === "en" ? "Login" : "लग इन"],
            ["signup", lang === "en" ? "Create Account" : "नयाँ खाता"],
          ].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setStep(1); setError(""); }} style={{ flex: 1, background: mode === m ? C.white : "transparent", color: mode === m ? C.primary : C.textLight, border: "none", borderRadius: 9, padding: "9px 8px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {label}
            </button>
          ))}
        </div>

        {error && <div style={{ background: C.redLight, border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: C.red }}>{error}</div>}

        {mode === "login" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Email" : "इमेल"} *</div>{inp(email, setEmail, "email", "name@example.com")}</div>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Password" : "पासवर्ड"} *</div><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={inputStyle} /></div>
            <button onClick={handleLogin} disabled={loading} style={{ width: "100%", marginTop: 8, background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.75 : 1 }}>{loading ? (lang === "en" ? "Loading..." : "लोड हुँदैछ...") : (lang === "en" ? "Login" : "लग इन")}</button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20, gap: 4 }}>
              {[1, 2].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? C.primary : C.bg, color: step >= s ? "#fff" : C.textLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, border: `2px solid ${step >= s ? C.primary : C.border}` }}>{s}</div>
                  {s < 2 && <div style={{ flex: 1, height: 2, background: step > s ? C.primary : C.border }} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Full Name" : "पूरा नाम"} *</div>{inp(name, setName, "text", lang === "en" ? "Your name" : "तपाईंको नाम")}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Email" : "इमेल"} *</div>{inp(email, setEmail, "email", "name@example.com")}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Phone (optional)" : "फोन (ऐच्छिक)"}</div>{inp(phone, setPhone, "tel", "98XXXXXXXX")}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Password" : "पासवर्ड"} *</div><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} /></div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Age" : "उमेर"}</div>{inp(age, setAge, "text", "25")}</div>
                <button onClick={() => { if (!name.trim() || !email.trim() || !password.trim()) { setError(lang === "en" ? "Fill required fields." : "अनिवार्य फिल्ड भर्नुहोस्।"); return; } if (password.length < 6) { setError(lang === "en" ? "Password must be at least 6 characters." : "पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ।"); return; } setError(""); setStep(2); }} style={{ width: "100%", marginTop: 8, background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{lang === "en" ? "Next: Location" : "अर्को: ठेगाना"} →</button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 13, color: C.textMid, marginBottom: 4 }}>{lang === "en" ? "Select your location. This helps us show nearby hospitals later." : "ठेगाना छान्नुहोस्। यसले पछि नजिकका अस्पताल देखाउन मद्दत गर्छ।"}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Province" : "प्रदेश"}</div>{sel(province, (p) => { setProvince(p); setDistrict(""); setLocalLevel(""); }, PROVINCES, lang === "en" ? "Select Province" : "प्रदेश छान्नुहोस्")}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "District" : "जिल्ला"}</div>{sel(district, (d) => { setDistrict(d); setLocalLevel(""); }, districts, lang === "en" ? "Select District" : "जिल्ला छान्नुहोस्")}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{lang === "en" ? "Local Level" : "स्थानीय तह"}</div>{sel(localLevel, setLocalLevel, localLevels, lang === "en" ? "Select Local Level" : "स्थानीय तह छान्नुहोस्")}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => { setStep(1); setError(""); }} style={{ flex: 1, background: C.bg, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← {lang === "en" ? "Back" : "पछाडि"}</button>
                  <button onClick={handleSignUp} disabled={loading} style={{ flex: 2, background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.75 : 1 }}>{loading ? (lang === "en" ? "Creating..." : "बनाउँदैछ...") : (lang === "en" ? "Create Account" : "खाता बनाउनुहोस्")}</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: C.textLight }}>
          {mode === "login" ? (lang === "en" ? "No account?" : "खाता छैन?") : (lang === "en" ? "Have an account?" : "खाता छ?")} {" "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setStep(1); setError(""); }} style={{ background: "none", border: "none", color: C.primary, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>{mode === "login" ? (lang === "en" ? "Create Account" : "नयाँ खाता") : (lang === "en" ? "Login" : "लग इन")}</button>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: C.textLight, textAlign: "center" }}>{lang === "en" ? "Your information is private and secure." : "तपाईंको जानकारी सुरक्षित छ।"}</div>
      </div>
    </div>
  );
}

// ─── Home ──────────────────────────────────────────────────────
function HomeScreen({ setTab, pickSym, user, lang }) {
  const h = new Date().getHours();
  const gr = h < 12 ? (lang === "en" ? "Good morning" : "शुभ प्रभात") : h < 17 ? (lang === "en" ? "Hello" : "नमस्ते") : (lang === "en" ? "Good evening" : "शुभ सन्ध्या");
  const first = user?.name?.split(" ")[0] || "";
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: "linear-gradient(135deg,#1D4ED8 0%,#2563EB 55%,#0D9488 100%)", padding: "22px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", marginBottom: 3, fontWeight: 600 }}>{gr}{first ? `, ${first}` : ""} 👋</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: 16 }}>{lang === "en" ? "How are you feeling today?" : "तपाईंलाई आज कस्तो छ?"}</div>
          <button onClick={() => setTab("check")} style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 12, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10, width: "100%", cursor: "pointer", textAlign: "left" }}>
            <Search size={16} color="rgba(255,255,255,0.72)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "inherit" }}>{lang === "en" ? "Search symptoms... headache, fever" : "लक्षण खोज्नुहोस्... टाउको, ज्वरो"}</span>
          </button>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ background: C.redLight, border: "1px solid #FECACA", borderRadius: 14, padding: "12px 16px", margin: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Siren size={20} color="#fff" /></div>
            <div><div style={{ fontSize: 13, fontWeight: 800, color: C.red }}>{lang === "en" ? "Emergency" : "आपतकालीन"}</div><div style={{ fontSize: 11, color: "#B91C1C" }}>{lang === "en" ? "Ambulance · Police" : "एम्बुलेन्स · प्रहरी"}</div></div>
          </div>
          <a href="tel:102" style={{ background: C.red, color: "#fff", borderRadius: 10, padding: "8px 18px", fontSize: 16, fontWeight: 900, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><PhoneCall size={16} />102</a>
        </div>

        <MedicalDisclaimer lang={lang} compact />

        <Sh title={lang === "en" ? "Quick Actions" : "के गर्नु छ?"} />
        <button onClick={() => setTab("chat")} style={{ width: "100%", background: `linear-gradient(135deg,${C.teal} 0%,#0F766E 100%)`, borderRadius: 16, padding: "18px 20px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 6px 16px ${C.teal}33`, border: "none", textAlign: "left", fontFamily: "inherit" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 800, letterSpacing: 1.2, marginBottom: 5 }}>AI HEALTH ASSISTANT</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{lang === "en" ? "Chat with AI Assistant" : "AI सँग कुरा गर्नुहोस्"}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{lang === "en" ? "Ask in any language · Voice" : "जुनसुकै भाषामा · Voice"}</div>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}><MessageCircle size={27} color="#fff" /></div>
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          <IconTile Icon={Stethoscope} label={lang === "en" ? "Symptoms" : "लक्षण"} onClick={() => setTab("check")} bg={C.primaryLight} color={C.primary} />
          <IconTile Icon={UserRound} label={lang === "en" ? "Doctors" : "डाक्टर"} onClick={() => setTab("doctors")} bg={C.purpleLight} color={C.purple} />
          <IconTile Icon={ShieldPlus} label={lang === "en" ? "First Aid" : "प्राथमिक"} onClick={() => setTab("firstaid")} bg={C.redLight} color={C.red} />
          <IconTile Icon={Bell} label={lang === "en" ? "Follow-up" : "फलो-अप"} onClick={() => setTab("followup")} bg={C.tealLight} color={C.teal} />
        </div>

        <Sh title={lang === "en" ? "Common Symptoms" : "सामान्य लक्षणहरू"} action={lang === "en" ? "See all" : "सबै"} onAction={() => setTab("check")} />
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 20 }}>
          {SYMPTOMS.map((s) => (
            <button key={s.id} onClick={() => { pickSym(s); setTab("check"); }} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 10px", flexShrink: 0, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 72, boxShadow: C.shadow }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 10, color: C.textMid, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{lang === "en" ? s.en : s.ne}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── First Aid ─────────────────────────────────────────────────
function FirstAidScreen({ lang }) {
  const [sel, setSel] = useState(null);
  if (sel) {
    const fa = sel;
    const steps = lang === "en" ? fa.stepsEn : fa.stepsNe;
    return (
      <div style={{ paddingBottom: 100 }}>
        <div style={{ background: fa.bg, padding: "16px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => setSel(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.textMid, fontFamily: "inherit", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}><ArrowLeft size={15} /> {lang === "en" ? "Back" : "पछाडि"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: fa.bg, border: `2px solid ${fa.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{fa.icon}</div>
            <div><div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>{lang === "en" ? fa.en : fa.ne}</div><div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{lang === "en" ? "First Aid Guide" : "प्राथमिक उपचार"}</div></div>
          </div>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <MedicalDisclaimer lang={lang} compact />
          <div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><ShieldPlus size={18} color={C.primary} />{lang === "en" ? "Steps to follow" : "गर्नुपर्ने चरणहरू"}</div>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < steps.length - 1 ? 12 : 0, paddingBottom: i < steps.length - 1 ? 12 : 0, borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, paddingTop: 4 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.redLight, border: "1px solid #FECACA", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.red, marginBottom: 8 }}>⚠️ {lang === "en" ? "When to see a doctor" : "डाक्टर कहिले देखाउने"}</div>
            <div style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.7 }}>{lang === "en" ? fa.whenEn : fa.whenNe}</div>
          </div>
          <div style={{ background: C.greenLight, border: "1px solid #A7F3D0", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.green, marginBottom: 6 }}>✅ {lang === "en" ? "Important Note" : "महत्वपूर्ण सल्लाह"}</div>
            <div style={{ fontSize: 13, color: "#065F46", lineHeight: 1.7 }}>{lang === "en" ? fa.noteEn : fa.noteNe}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 4 }}>{lang === "en" ? "First Aid Guide" : "प्राथमिक उपचार मार्गदर्शिका"}</div>
      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 8 }}>{lang === "en" ? "Step-by-step emergency guidance" : "चरणबद्ध आपतकालीन मार्गदर्शन"}</div>
      <div style={{ background: C.redLight, border: "1px solid #FECACA", borderRadius: 12, padding: "10px 14px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Siren size={23} color={C.red} />
          <div><div style={{ fontSize: 12, fontWeight: 800, color: C.red }}>{lang === "en" ? "Life-threatening?" : "जीवन खतरामा?"}</div><div style={{ fontSize: 11, color: "#B91C1C" }}>{lang === "en" ? "Call 102 immediately" : "तुरुन्त 102 मा फोन गर्नुहोस्"}</div></div>
        </div>
        <a href="tel:102" style={{ background: C.red, color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>102</a>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FIRST_AID.map((fa) => (
          <button key={fa.id} onClick={() => setSel(fa)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14, textAlign: "left", boxShadow: C.shadow }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: fa.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{fa.icon}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{lang === "en" ? fa.en : fa.ne}</div><div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{(lang === "en" ? fa.stepsEn[0] : fa.stepsNe[0]).slice(0, 54)}...</div></div>
            <ChevronRight size={18} color={C.textLight} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SMART SYMPTOM TRIAGE ─────────────────────────────────────
function symptomIdsFromText(text) {
  const raw = text || "";
  const lower = raw.toLowerCase();

  return SYMPTOMS.filter(s => {
    const englishMatch = lower.includes(s.en.toLowerCase());
    const romanMatch = s.roman?.some(r => lower.includes(r));
    const nepaliMatch = s.ne && raw.includes(s.ne.split(" ")[0]);
    return englishMatch || romanMatch || nepaliMatch;
  }).map(s => s.id);
}

function uniqueIds(ids) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function getRedFlagLabel(id, lang) {
  const map = {
    breathing: { en: "Breathing difficulty", ne: "सास फेर्न गाह्रो" },
    chest: { en: "Chest pain", ne: "छाती दुखाई" },
    unconscious: { en: "Fainting / unconscious", ne: "बेहोस हुनु" },
    seizure: { en: "Seizure", ne: "थर्थराउने / दौरा" },
    stiffneck: { en: "Stiff neck", ne: "घाँटी कडा हुनु" },
    rash: { en: "Skin rash", ne: "छालामा दाग" },
    blood: { en: "Blood in vomit/stool", ne: "उल्टी/दिसामा रगत" },
    dehydration: { en: "Severe dehydration", ne: "गम्भीर निर्जलीकरण" }
  };
  return map[id]?.[lang] || id;
}

function buildSmartAssessment({ symptoms, duration, temperature, intensity, ageGroup, redFlags, lang }) {
  const ids = symptoms.map(s => s.id);
  const has = id => ids.includes(id);
  const all = (...items) => items.every(id => ids.includes(id));

  const temp = parseFloat(temperature);
  const tempKnown = !Number.isNaN(temp);
  const longDuration = duration === "3plus" || duration === "week";
  const vulnerable = ageGroup === "child" || ageGroup === "elderly" || ageGroup === "pregnant";
  const redSet = new Set(redFlags);

  const t = lang === "en" ? {
    highTitle: "Urgent care may be needed",
    mediumTitle: "Needs attention",
    lowTitle: "Mild for now",

    highSummary: "Your symptom pattern includes warning signs. This is not a diagnosis, but it should not be ignored.",
    mediumSummary: "Your symptoms may be due to a common illness, infection, dehydration, or another condition. More observation is needed.",
    lowSummary: "Your symptoms look mild based on the information given, but keep monitoring them.",

    combinedReason: "The symptoms together matter more than each symptom alone.",
    feverHeadache: "Fever with headache can happen with viral fever, dehydration, dengue-like illness, typhoid-like illness, or other infections.",
    feverCough: "Fever with cough can be related to flu, respiratory infection, COVID-like illness, or chest infection.",
    feverStomach: "Fever with stomach pain or vomiting can be related to food poisoning, stomach infection, dehydration, or other infection.",
    chestBreathing: "Chest pain with breathing difficulty is a red-flag combination and needs urgent medical attention.",
    stomachVomiting: "Stomach pain with vomiting can quickly cause dehydration, especially in children and elderly people.",
    headacheDizzy: "Headache with dizziness may be linked with dehydration, low blood pressure, weakness, stress, or other causes.",

    doNow: "What to do now",
    possible: "What this pattern may suggest",
    doctorWhen: "When to see a doctor",
    labConsider: "Possible lab discussion with doctor",
    nextStep: "Recommended next step",

    emergency: "Call 102 or go to the nearest emergency service now.",
    restFluid: "Rest, drink enough water, and avoid heavy work for now.",
    feverCare: "Check temperature every 4–6 hours and drink ORS/water frequently.",
    avoidSelfMed: "Do not take antibiotics or strong medicine without a doctor.",
    monitor: "Monitor symptoms for the next 24 hours.",

    doctorHigh: "Go to a doctor or emergency service immediately.",
    doctorMedium: "See a doctor if symptoms continue, worsen, or last more than 24–48 hours.",
    doctorFever: "See a doctor if fever lasts 3 days, goes above 39°C, or comes with rash, severe headache, vomiting, or weakness.",
    doctorLow: "See a doctor if symptoms worsen or new symptoms appear.",

    labFever: "If fever continues for 3+ days, ask a doctor about CBC, dengue, malaria, typhoid, or urine tests depending on symptoms.",
    labStomach: "If vomiting/diarrhea continues, a doctor may suggest stool/urine tests and dehydration assessment.",

    notDiagnosis: "This is basic guidance, not a final diagnosis."
  } : {
    highTitle: "तत्काल उपचार आवश्यक हुन सक्छ",
    mediumTitle: "ध्यान दिनुपर्ने अवस्था",
    lowTitle: "हाल सामान्य देखिन्छ",

    highSummary: "तपाईंको लक्षणमा चेतावनी संकेत देखिएको छ। यो पक्का निदान होइन, तर बेवास्ता गर्नु हुँदैन।",
    mediumSummary: "यी लक्षण सामान्य संक्रमण, डिहाइड्रेसन, वा अन्य कारणले हुन सक्छन्। अझै निगरानी आवश्यक छ।",
    lowSummary: "दिएको जानकारी अनुसार हाल लक्षण सामान्य देखिन्छ, तर निगरानी गरिरहनुहोस्।",

    combinedReason: "लक्षणहरूलाई छुट्टाछुट्टै होइन, सँगै हेर्नु महत्त्वपूर्ण हुन्छ।",
    feverHeadache: "ज्वरो र टाउको दुखाई सँगै हुँदा भाइरल ज्वरो, डिहाइड्रेसन, डेंगी-जस्तो समस्या, टाइफाइड-जस्तो समस्या वा अन्य संक्रमण हुन सक्छ।",
    feverCough: "ज्वरो र खोकी सँगै हुँदा फ्लु, श्वासप्रश्वास संक्रमण, COVID-जस्तो समस्या वा छातीको संक्रमणसँग सम्बन्धित हुन सक्छ।",
    feverStomach: "ज्वरोसँग पेट दुख्ने वा उल्टी भए फूड पोइजनिङ, पेटको संक्रमण, डिहाइड्रेसन वा अन्य संक्रमण हुन सक्छ।",
    chestBreathing: "छाती दुखाई र सास फेर्न गाह्रो हुनु आपतकालीन संकेत हो। तुरुन्त उपचार आवश्यक हुन्छ।",
    stomachVomiting: "पेट दुखाई र उल्टीले छिट्टै डिहाइड्रेसन गराउन सक्छ, विशेषगरी बच्चा र वृद्धमा।",
    headacheDizzy: "टाउको दुखाई र चक्कर डिहाइड्रेसन, कम रक्तचाप, कमजोरी, तनाव वा अन्य कारणसँग सम्बन्धित हुन सक्छ।",

    doNow: "अहिले के गर्ने",
    possible: "यो लक्षण ढाँचाले के संकेत गर्न सक्छ",
    doctorWhen: "डाक्टर कहिले देखाउने",
    labConsider: "डाक्टरसँग छलफल गर्न सकिने परीक्षण",
    nextStep: "सुझाव गरिएको अर्को कदम",

    emergency: "तुरुन्त 102 मा फोन गर्नुहोस् वा नजिकको emergency मा जानुहोस्।",
    restFluid: "आराम गर्नुहोस्, पर्याप्त पानी पिउनुहोस्, र अहिले भारी काम नगर्नुहोस्।",
    feverCare: "हरेक ४–६ घण्टामा तापक्रम जाँच्नुहोस् र ORS/पानी बारम्बार पिउनुहोस्।",
    avoidSelfMed: "डाक्टरको सल्लाह बिना antibiotics वा कडा औषधि नखानुहोस्।",
    monitor: "अर्को २४ घण्टा लक्षण निगरानी गर्नुहोस्।",

    doctorHigh: "तुरुन्त डाक्टर वा emergency सेवा लिनुहोस्।",
    doctorMedium: "लक्षण जारी रहे, बढे, वा २४–४८ घण्टा भन्दा बढी रहे डाक्टर देखाउनुहोस्।",
    doctorFever: "ज्वरो ३ दिनभन्दा बढी रहे, ३९°C भन्दा माथि गए, वा दाग/तीव्र टाउको दुखाई/उल्टी/कमजोरी आए डाक्टर देखाउनुहोस्।",
    doctorLow: "लक्षण बढे वा नयाँ लक्षण देखिए डाक्टर देखाउनुहोस्।",

    labFever: "ज्वरो ३+ दिन रहे डाक्टरसँग CBC, dengue, malaria, typhoid वा urine test बारे सोध्न सकिन्छ।",
    labStomach: "उल्टी/झाडापखाला जारी रहे stool/urine test र dehydration जाँच आवश्यक हुन सक्छ।",

    notDiagnosis: "यो सामान्य मार्गदर्शन हो, पक्का निदान होइन।"
  };

  let level = "low";

  if (
    has("chest") ||
    has("breathing") ||
    redSet.has("breathing") ||
    redSet.has("chest") ||
    redSet.has("unconscious") ||
    redSet.has("seizure") ||
    redSet.has("blood") ||
    (tempKnown && temp >= 40) ||
    intensity === "severe"
  ) {
    level = "high";
  } else if (
    longDuration ||
    vulnerable ||
    (tempKnown && temp >= 38.5) ||
    symptoms.length >= 3 ||
    intensity === "moderate" ||
    redFlags.length > 0
  ) {
    level = "medium";
  }

  const reasons = [];

  if (all("chest", "breathing")) reasons.push(t.chestBreathing);
  if (all("fever", "headache")) reasons.push(t.feverHeadache);
  if (all("fever", "cough")) reasons.push(t.feverCough);
  if (has("fever") && (has("stomach") || has("vomiting"))) reasons.push(t.feverStomach);
  if (all("stomach", "vomiting")) reasons.push(t.stomachVomiting);
  if (all("headache", "dizzy")) reasons.push(t.headacheDizzy);

  if (reasons.length === 0) {
    const possible = Array.from(
      new Set(symptoms.flatMap(s => lang === "en" ? s.causesEn : s.causesNe))
    ).slice(0, 4);

    if (possible.length) {
      reasons.push(
        lang === "en"
          ? `This may be related to ${possible.join(", ")} or another common condition.`
          : `यो ${possible.join(", ")} वा अन्य सामान्य अवस्थासँग सम्बन्धित हुन सक्छ।`
      );
    } else {
      reasons.push(t.combinedReason);
    }
  }

  const actions = [];

  if (level === "high") {
    actions.push(t.emergency);
    actions.push(lang === "en" ? "Do not wait for symptoms to become worse." : "लक्षण अझै खराब होस् भनेर प्रतीक्षा नगर्नुहोस्।");
    actions.push(lang === "en" ? "Keep the person sitting or lying safely while arranging help." : "मद्दतको व्यवस्था गर्दा व्यक्तिलाई सुरक्षित रूपमा बसाउनु वा सुताउनुहोस्।");
  } else {
    actions.push(t.restFluid);
    if (has("fever") || tempKnown) actions.push(t.feverCare);
    actions.push(t.avoidSelfMed);
    actions.push(t.monitor);
  }

  const doctor = [];

  if (level === "high") {
    doctor.push(t.doctorHigh);
  } else if (level === "medium") {
    doctor.push(t.doctorMedium);
    if (has("fever")) doctor.push(t.doctorFever);
  } else {
    doctor.push(t.doctorLow);
  }

  const lab = [];

  if (has("fever") && (longDuration || (tempKnown && temp >= 38.5))) {
    lab.push(t.labFever);
  }

  if (has("stomach") || has("vomiting")) {
    lab.push(t.labStomach);
  }

  const meta = {
    high: {
      title: t.highTitle,
      summary: t.highSummary,
      bg: C.redLight,
      color: C.red,
      icon: "🚨"
    },
    medium: {
      title: t.mediumTitle,
      summary: t.mediumSummary,
      bg: C.orangeLight,
      color: C.orange,
      icon: "⚠️"
    },
    low: {
      title: t.lowTitle,
      summary: t.lowSummary,
      bg: C.greenLight,
      color: C.green,
      icon: "✅"
    }
  }[level];

  return {
    level,
    meta,
    symptoms,
    duration,
    temperature,
    intensity,
    ageGroup,
    redFlags,
    reasons,
    actions,
    doctor,
    lab,
    notDiagnosis: t.notDiagnosis,
    labels: {
      possible: t.possible,
      doNow: t.doNow,
      doctorWhen: t.doctorWhen,
      labConsider: t.labConsider,
      nextStep: t.nextStep
    }
  };
}

// ─── CHECK ─────────────────────────────────────────────────────
function CheckScreen({initSym,setTab,setChatSeed,lang}){
  const [q,setQ]=useState("");
  const [selectedIds,setSelectedIds]=useState(initSym?.id ? [initSym.id] : []);
  const [duration,setDuration]=useState("");
  const [temperature,setTemperature]=useState("");
  const [intensity,setIntensity]=useState("");
  const [ageGroup,setAgeGroup]=useState("");
  const [redFlags,setRedFlags]=useState([]);
  const [assessment,setAssessment]=useState(null);
  const [error,setError]=useState("");
  const [prev,setPrev]=useState("");

  useEffect(()=>{
    if(initSym?.id){
      setSelectedIds([initSym.id]);
      setAssessment(null);
      setError("");
    }
  },[initSym]);

  const durationOptions = [
    {id:"today", en:"Today", ne:"आज मात्रै"},
    {id:"1to2", en:"1–2 days", ne:"१–२ दिन"},
    {id:"3plus", en:"3+ days", ne:"३+ दिन"},
    {id:"week", en:"1 week+", ne:"१ हप्ता+"}
  ];

  const intensityOptions = [
    {id:"mild", en:"Mild", ne:"हल्का"},
    {id:"moderate", en:"Moderate", ne:"मध्यम"},
    {id:"severe", en:"Severe", ne:"धेरै गाह्रो"}
  ];

  const ageOptions = [
    {id:"child", en:"Child", ne:"बच्चा"},
    {id:"adult", en:"Adult", ne:"वयस्क"},
    {id:"elderly", en:"Elderly", ne:"वृद्ध"},
    {id:"pregnant", en:"Pregnant", ne:"गर्भवती"}
  ];

  const redFlagOptions = [
    {id:"breathing", en:"Breathing difficulty", ne:"सास फेर्न गाह्रो"},
    {id:"chest", en:"Chest pain", ne:"छाती दुखाई"},
    {id:"unconscious", en:"Fainting / unconscious", ne:"बेहोस हुनु"},
    {id:"seizure", en:"Seizure", ne:"दौरा / थर्थराउनु"},
    {id:"stiffneck", en:"Stiff neck", ne:"घाँटी कडा हुनु"},
    {id:"rash", en:"Skin rash", ne:"छालामा दाग"},
    {id:"blood", en:"Blood in vomit/stool", ne:"उल्टी/दिसामा रगत"},
    {id:"dehydration", en:"Severe dehydration", ne:"गम्भीर डिहाइड्रेसन"}
  ];

  function handleText(value){
    setQ(value);
    setAssessment(null);
    setError("");
    setPrev(r2n(value)||"");
  }

  function toggleSymptom(id){
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev,id]);
    setAssessment(null);
    setError("");
  }

  function toggleRedFlag(id){
    setRedFlags(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev,id]);
    setAssessment(null);
  }

  function runAssessment(){
    const idsFromText = symptomIdsFromText(q);
    const ids = uniqueIds([...selectedIds, ...idsFromText]);

    if(ids.length === 0){
      setError(lang==="en"
        ? "Please type or select at least one symptom."
        : "कृपया कम्तीमा एउटा लक्षण टाइप वा छनोट गर्नुहोस्।"
      );
      return;
    }

    const symptoms = ids
      .map(id => SYMPTOMS.find(s => s.id === id))
      .filter(Boolean);

    setSelectedIds(ids);

    const result = buildSmartAssessment({
      symptoms,
      duration,
      temperature,
      intensity,
      ageGroup,
      redFlags,
      lang
    });

    setAssessment(result);
    setError("");
  }

  function sendToAI(){
    if(!assessment) return;

    const symptomNames = assessment.symptoms.map(s => lang==="en" ? s.en : s.ne).join(", ");
    const flagText = assessment.redFlags.length
      ? assessment.redFlags.map(id => getRedFlagLabel(id,lang)).join(", ")
      : (lang==="en" ? "none reported" : "छैन");

    const seed = lang==="en"
      ? `I have these symptoms: ${symptomNames}. Duration: ${duration || "not sure"}. Temperature: ${temperature || "not measured"}. Severity: ${intensity || "not selected"}. Age group: ${ageGroup || "not selected"}. Warning signs: ${flagText}. Please ask me follow-up questions if needed and guide me safely.`
      : `मलाई यी लक्षण छन्: ${symptomNames}। अवधि: ${duration || "थाहा छैन"}। तापक्रम: ${temperature || "नापिएको छैन"}। गम्भीरता: ${intensity || "छानिएको छैन"}। उमेर समूह: ${ageGroup || "छानिएको छैन"}। चेतावनी संकेत: ${flagText}। आवश्यक भए थप प्रश्न सोधेर सुरक्षित सल्लाह दिनुहोस्।`;

    setChatSeed(seed);
    setTab("chat");
  }

  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>
        {lang==="en"?"Smart Symptom Check":"स्मार्ट लक्षण जाँच"}
      </div>

      <div style={{fontSize:13,color:C.textLight,marginBottom:14,lineHeight:1.5}}>
        {lang==="en"
          ? "Select multiple symptoms and add basic details. The app will assess them together, not separately."
          : "धेरै लक्षण छानेर विवरण थप्नुहोस्। App ले लक्षणहरू छुट्टाछुट्टै होइन, सँगै विश्लेषण गर्छ।"}
      </div>

      <div style={{
        background:C.primaryLight,
        border:"1px solid #BFDBFE",
        borderRadius:12,
        padding:"10px 12px",
        fontSize:12,
        color:C.primaryDark,
        lineHeight:1.55,
        marginBottom:14
      }}>
        ℹ️ {lang==="en"
          ? "This is basic triage guidance, not a diagnosis. For emergencies, call 102 immediately."
          : "यो सामान्य triage मार्गदर्शन हो, पक्का निदान होइन। आपतकालमा तुरुन्त 102 मा फोन गर्नुहोस्।"}
      </div>

      <div style={{
        background:C.white,
        borderRadius:16,
        padding:16,
        border:"1px solid "+C.border,
        marginBottom:16,
        boxShadow:C.shadow
      }}>
        <div style={{
          display:"flex",
          alignItems:"flex-start",
          gap:10,
          border:"1.5px solid "+C.border,
          borderRadius:12,
          padding:"10px 14px",
          background:C.bg,
          marginBottom:10
        }}>
          <span style={{color:C.textLight,marginTop:3}}>🔍</span>
          <textarea
            value={q}
            onChange={e=>handleText(e.target.value)}
            placeholder={lang==="en"
              ? "Example: fever, headache and body pain for 2 days..."
              : "उदाहरण: jworo, tauko dukhxa, body pain 2 din dekhi..."
            }
            rows={2}
            style={{
              flex:1,
              border:"none",
              background:"none",
              outline:"none",
              fontSize:14,
              fontFamily:"inherit",
              color:C.text,
              resize:"none",
              lineHeight:1.6
            }}
          />
        </div>

        {prev && (
          <div style={{
            padding:"7px 12px",
            background:C.primaryLight,
            borderRadius:8,
            fontSize:13,
            color:C.primary,
            fontWeight:600,
            marginBottom:10
          }}>
            ✓ {lang==="en"?"Understood":"बुझियो"}: {prev}
          </div>
        )}

        {error && (
          <div style={{
            background:C.redLight,
            border:"1px solid #FECACA",
            borderRadius:10,
            padding:"9px 12px",
            marginBottom:10,
            color:C.red,
            fontSize:13,
            fontWeight:600
          }}>
            {error}
          </div>
        )}
      </div>

      <div style={{marginBottom:18}}>
        <div style={{
          fontSize:12,
          fontWeight:700,
          color:C.textLight,
          textTransform:"uppercase",
          letterSpacing:0.5,
          marginBottom:10
        }}>
          {lang==="en"?"Select symptoms":"लक्षण छान्नुहोस्"}
        </div>

        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {SYMPTOMS.map(s=>{
            const on = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={()=>toggleSymptom(s.id)}
                style={{
                  background:on?C.primary:C.white,
                  color:on?"#fff":C.textMid,
                  border:"1.5px solid "+(on?C.primary:C.border),
                  borderRadius:20,
                  padding:"8px 14px",
                  fontSize:13,
                  fontWeight:600,
                  cursor:"pointer",
                  fontFamily:"inherit",
                  display:"flex",
                  alignItems:"center",
                  gap:6,
                  boxShadow:on?"0 3px 8px rgba(37,99,235,0.18)":"none"
                }}
              >
                <span>{s.icon}</span>
                {lang==="en"?s.en:s.ne}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        background:C.white,
        border:"1px solid "+C.border,
        borderRadius:16,
        padding:16,
        marginBottom:16,
        boxShadow:C.shadow
      }}>
        <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:12}}>
          {lang==="en"?"Add details for better result":"राम्रो नतिजाको लागि विवरण थप्नुहोस्"}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:6}}>
              {lang==="en"?"How long?":"कति समयदेखि?"}
            </div>
            <select
              value={duration}
              onChange={e=>{setDuration(e.target.value);setAssessment(null);}}
              style={{
                width:"100%",
                border:"1.5px solid "+C.border,
                borderRadius:10,
                padding:"10px",
                fontSize:13,
                fontFamily:"inherit",
                background:C.bg,
                color:duration?C.text:C.textLight,
                outline:"none"
              }}
            >
              <option value="">{lang==="en"?"Select":"छान्नुहोस्"}</option>
              {durationOptions.map(o=><option key={o.id} value={o.id}>{lang==="en"?o.en:o.ne}</option>)}
            </select>
          </div>

          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:6}}>
              {lang==="en"?"Temperature":"तापक्रम"}
            </div>
            <input
              value={temperature}
              onChange={e=>{setTemperature(e.target.value);setAssessment(null);}}
              placeholder="37.5°C"
              style={{
                width:"100%",
                border:"1.5px solid "+C.border,
                borderRadius:10,
                padding:"10px",
                fontSize:13,
                fontFamily:"inherit",
                background:C.bg,
                color:C.text,
                outline:"none",
                boxSizing:"border-box"
              }}
            />
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:6}}>
              {lang==="en"?"How severe?":"कत्तिको गाह्रो?"}
            </div>
            <select
              value={intensity}
              onChange={e=>{setIntensity(e.target.value);setAssessment(null);}}
              style={{
                width:"100%",
                border:"1.5px solid "+C.border,
                borderRadius:10,
                padding:"10px",
                fontSize:13,
                fontFamily:"inherit",
                background:C.bg,
                color:intensity?C.text:C.textLight,
                outline:"none"
              }}
            >
              <option value="">{lang==="en"?"Select":"छान्नुहोस्"}</option>
              {intensityOptions.map(o=><option key={o.id} value={o.id}>{lang==="en"?o.en:o.ne}</option>)}
            </select>
          </div>

          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:6}}>
              {lang==="en"?"Patient group":"बिरामी समूह"}
            </div>
            <select
              value={ageGroup}
              onChange={e=>{setAgeGroup(e.target.value);setAssessment(null);}}
              style={{
                width:"100%",
                border:"1.5px solid "+C.border,
                borderRadius:10,
                padding:"10px",
                fontSize:13,
                fontFamily:"inherit",
                background:C.bg,
                color:ageGroup?C.text:C.textLight,
                outline:"none"
              }}
            >
              <option value="">{lang==="en"?"Select":"छान्नुहोस्"}</option>
              {ageOptions.map(o=><option key={o.id} value={o.id}>{lang==="en"?o.en:o.ne}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:8}}>
            {lang==="en"?"Any warning signs?":"चेतावनी संकेत छन्?"}
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {redFlagOptions.map(r=>{
              const on = redFlags.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={()=>toggleRedFlag(r.id)}
                  style={{
                    background:on?C.redLight:C.bg,
                    color:on?C.red:C.textMid,
                    border:"1.5px solid "+(on?"#FCA5A5":C.border),
                    borderRadius:18,
                    padding:"7px 11px",
                    fontSize:12,
                    fontWeight:600,
                    cursor:"pointer",
                    fontFamily:"inherit"
                  }}
                >
                  {on ? "✓ " : ""}{lang==="en"?r.en:r.ne}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={runAssessment}
        style={{
          width:"100%",
          background:C.primary,
          color:"#fff",
          border:"none",
          borderRadius:14,
          padding:"14px",
          fontSize:15,
          fontWeight:800,
          cursor:"pointer",
          fontFamily:"inherit",
          marginBottom:18,
          boxShadow:"0 8px 18px rgba(37,99,235,0.22)"
        }}
      >
        {assessment
          ? (lang==="en" ? "Update Analysis" : "विश्लेषण अपडेट गर्नुहोस्")
          : (lang==="en" ? "Analyze Symptoms Together" : "लक्षणहरू सँगै विश्लेषण गर्नुहोस्")}
      </button>

      {assessment && (
        <div>
          <div style={{
            background:assessment.meta.bg,
            border:"1px solid "+assessment.meta.color+"33",
            borderRadius:16,
            padding:16,
            marginBottom:14,
            boxShadow:C.shadow
          }}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{
                width:44,
                height:44,
                borderRadius:12,
                background:"#fff",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:22,
                flexShrink:0
              }}>
                {assessment.meta.icon}
              </div>

              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:17,fontWeight:800,color:assessment.meta.color}}>
                    {assessment.meta.title}
                  </span>
                  <span style={{
                    background:"#fff",
                    border:"1px solid "+assessment.meta.color+"33",
                    color:assessment.meta.color,
                    borderRadius:20,
                    padding:"3px 9px",
                    fontSize:11,
                    fontWeight:700
                  }}>
                    {assessment.level.toUpperCase()}
                  </span>
                </div>

                <div style={{fontSize:13,color:C.text,lineHeight:1.65}}>
                  {assessment.meta.summary}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background:C.white,
            border:"1px solid "+C.border,
            borderRadius:16,
            padding:16,
            marginBottom:12,
            boxShadow:C.shadow
          }}>
            <div style={{fontSize:12,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>
              {lang==="en"?"Selected case":"छानिएको अवस्था"}
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {assessment.symptoms.map(s=>(
                <span key={s.id} style={{
                  background:C.primaryLight,
                  color:C.primary,
                  borderRadius:18,
                  padding:"6px 10px",
                  fontSize:12,
                  fontWeight:700
                }}>
                  {s.icon} {lang==="en"?s.en:s.ne}
                </span>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                [lang==="en"?"Duration":"अवधि", duration || "—"],
                [lang==="en"?"Temperature":"तापक्रम", temperature ? temperature+"°C" : "—"],
                [lang==="en"?"Severity":"गम्भीरता", intensity || "—"],
                [lang==="en"?"Group":"समूह", ageGroup || "—"]
              ].map(([label,value])=>(
                <div key={label} style={{background:C.bg,borderRadius:10,padding:"8px 10px"}}>
                  <div style={{fontSize:10,color:C.textLight,marginBottom:2}}>{label}</div>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background:C.white,
            border:"1px solid "+C.border,
            borderRadius:16,
            padding:16,
            marginBottom:12,
            boxShadow:C.shadow
          }}>
            <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:10}}>
              {assessment.labels.possible}
            </div>

            {assessment.reasons.map((r,i)=>(
              <div key={i} style={{
                display:"flex",
                gap:10,
                alignItems:"flex-start",
                paddingBottom:i<assessment.reasons.length-1?10:0,
                marginBottom:i<assessment.reasons.length-1?10:0,
                borderBottom:i<assessment.reasons.length-1?"1px solid "+C.border:"none"
              }}>
                <span style={{color:C.primary,fontWeight:800,marginTop:1}}>•</span>
                <span style={{fontSize:13,color:C.text,lineHeight:1.65}}>{r}</span>
              </div>
            ))}

            <div style={{
              marginTop:12,
              background:C.bg,
              borderRadius:10,
              padding:"9px 12px",
              fontSize:12,
              color:C.textMid,
              lineHeight:1.55
            }}>
              {assessment.notDiagnosis}
            </div>
          </div>

          <div style={{
            background:C.white,
            border:"1px solid "+C.border,
            borderRadius:16,
            padding:16,
            marginBottom:12,
            boxShadow:C.shadow
          }}>
            <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:10}}>
              {assessment.labels.doNow}
            </div>

            {assessment.actions.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<assessment.actions.length-1?10:0}}>
                <div style={{
                  width:24,
                  height:24,
                  borderRadius:"50%",
                  background:C.primary,
                  color:"#fff",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  fontSize:11,
                  fontWeight:800,
                  flexShrink:0
                }}>
                  {i+1}
                </div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.65,paddingTop:2}}>{a}</div>
              </div>
            ))}
          </div>

          <div style={{
            background:assessment.level==="high"?C.redLight:C.orangeLight,
            border:"1px solid "+(assessment.level==="high"?"#FCA5A5":"#FCD34D"),
            borderRadius:16,
            padding:16,
            marginBottom:12
          }}>
            <div style={{
              fontSize:15,
              fontWeight:800,
              color:assessment.level==="high"?C.red:C.orange,
              marginBottom:9
            }}>
              ⚠️ {assessment.labels.doctorWhen}
            </div>

            {assessment.doctor.map((d,i)=>(
              <div key={i} style={{
                fontSize:13,
                color:assessment.level==="high"?C.red:C.orange,
                lineHeight:1.65,
                marginBottom:i<assessment.doctor.length-1?6:0,
                fontWeight:500
              }}>
                • {d}
              </div>
            ))}
          </div>

          {assessment.lab.length > 0 && (
            <div style={{
              background:C.primaryLight,
              border:"1px solid #BFDBFE",
              borderRadius:16,
              padding:16,
              marginBottom:12
            }}>
              <div style={{fontSize:15,fontWeight:800,color:C.primaryDark,marginBottom:9}}>
                🧪 {assessment.labels.labConsider}
              </div>

              {assessment.lab.map((l,i)=>(
                <div key={i} style={{fontSize:13,color:C.primaryDark,lineHeight:1.65,marginBottom:i<assessment.lab.length-1?6:0}}>
                  • {l}
                </div>
              ))}
            </div>
          )}

          <div style={{
            background:C.white,
            border:"1px solid "+C.border,
            borderRadius:16,
            padding:16,
            marginBottom:20,
            boxShadow:C.shadow
          }}>
            <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:12}}>
              {assessment.labels.nextStep}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button
                onClick={sendToAI}
                style={{
                  background:C.primary,
                  color:"#fff",
                  border:"none",
                  borderRadius:12,
                  padding:"12px 10px",
                  fontSize:13,
                  fontWeight:700,
                  cursor:"pointer",
                  fontFamily:"inherit"
                }}
              >
                💬 {lang==="en"?"Ask AI":"AI सँग सोध्नुहोस्"}
              </button>

              <button
                onClick={()=>setTab("doctors")}
                style={{
                  background:C.primaryLight,
                  color:C.primary,
                  border:"1px solid #BFDBFE",
                  borderRadius:12,
                  padding:"12px 10px",
                  fontSize:13,
                  fontWeight:700,
                  cursor:"pointer",
                  fontFamily:"inherit"
                }}
              >
                👨‍⚕️ {lang==="en"?"Find Doctor":"डाक्टर खोज्नुहोस्"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Chat ──────────────────────────────────────────────────────
function ChatScreen({ seed, setSeed, online, user, lang }) {
  const welcome = lang === "en" ? "Hello! I'm your health assistant. 🙏\n\nWhat's bothering you today? Tell me your symptoms and I'll ask a few questions to give you better guidance." : "नमस्ते! म तपाईंको स्वास्थ्य सहायक हुँ। 🙏\n\nआज तपाईंलाई के समस्या छ? लक्षण बताउनुहोस् — म केही प्रश्न सोधेर राम्रो सहायता गर्नेछु।";
  const [msgs, setMsgs] = useState([{ role: "assistant", text: welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [prev, setPrev] = useState("");
  const bottom = useRef(null);

  useEffect(() => { if (seed) { setInput(seed); setSeed(null); } }, [seed, setSeed]);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function hi(v) {
    setInput(v);
    setPrev(isRom(v) ? r2n(v) || "" : "");
  }

  async function saveChat(m, r) {
    if (user?.user_id) await supabase.from("health_chats").insert([{ user_id: user.user_id, message: m, role: r }]);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setPrev("");
    setMsgs((p) => [...p, { role: "user", text }]);
    await saveChat(text, "user");
    setLoading(true);

    if (!online) {
      setTimeout(() => {
        const m = SYMPTOMS.find((s) => s.roman.some((r) => text.toLowerCase().includes(r)));
        const rep = m ? `${lang === "en" ? m.advEn : m.advNe} ${lang === "en" ? m.warnEn : m.warnNe}` : lang === "en" ? "Offline mode: I can give only limited guidance. Please call 102 in emergencies." : "अफलाइन मोड: सीमित सल्लाह मात्र उपलब्ध छ। आपतकालमा 102 मा फोन गर्नुहोस्।";
        setMsgs((p) => [...p, { role: "assistant", text: rep }]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const rep = await askAI(text, history, lang);
      setHistory((h) => [...h, { role: "user", content: text }, { role: "assistant", content: rep }].slice(-12));
      setMsgs((p) => [...p, { role: "assistant", text: rep }]);
      await saveChat(rep, "assistant");
    } catch {
      setMsgs((p) => [...p, { role: "assistant", text: lang === "en" ? "Sorry, connection failed. Try again." : "माफ गर्नुहोस्, जडान भएन। पुनः प्रयास गर्नुहोस्।" }]);
    }
    setLoading(false);
  }

  const qs = lang === "en" ? ["I have fever", "Should I see a doctor?", "Home remedies?", "Emergency signs"] : ["मलाई ज्वरो छ", "डाक्टर जानुपर्छ?", "घरमा उपाय?", "आपतकालीन चिन्ह"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 108px)" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        <MedicalDisclaimer lang={lang} compact />
        {msgs.map((m, i) => (
          <div key={`${m.role}-${i}`} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14, gap: 8 }}>
            {m.role === "assistant" && <Av init="AI" color={C.primary} size={32} />}
            <div style={{ maxWidth: "78%", background: m.role === "user" ? C.primary : C.white, border: m.role === "user" ? "none" : `1px solid ${C.border}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", boxShadow: C.shadow }}>
              <div style={{ fontSize: 13, color: m.role === "user" ? "#fff" : C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Av init="AI" color={C.primary} size={32} />
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "14px 16px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map((j) => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: C.primary, opacity: 0.7 }} />)}
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      <div style={{ padding: "6px 12px 8px", display: "flex", gap: 6, overflowX: "auto" }}>
        {qs.map((q) => <button key={q} onClick={() => setInput(q)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", whiteSpace: "nowrap", color: C.textMid, fontSize: 11, fontFamily: "inherit", cursor: "pointer", flexShrink: 0, boxShadow: C.shadow }}>{q}</button>)}
      </div>
      <div style={{ padding: "8px 12px 16px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        {prev && <div style={{ marginBottom: 6, padding: "5px 12px", background: C.primaryLight, borderRadius: 8, fontSize: 12, color: C.primary, fontWeight: 700 }}>✓ {prev}</div>}
        <VoiceInput input={input} setInput={hi} onSend={send} loading={loading} lang={lang} />
      </div>
    </div>
  );
}

// ─── Doctors ───────────────────────────────────────────────────
function DoctorsScreen({ lang }) {
  const [requested, setRequested] = useState(null);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "available" ? DOCTORS.filter((d) => d.avail) : DOCTORS;

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 4 }}>{lang === "en" ? "Doctors" : "डाक्टरहरू"}</div>
      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 12 }}>{lang === "en" ? "Request video consultation from home" : "घरैबाट भिडियो परामर्श अनुरोध"}</div>
      <div style={{ background: C.primaryLight, border: "1px solid #BFDBFE", borderRadius: 12, padding: "10px 12px", fontSize: 12, color: C.primaryDark, lineHeight: 1.55, marginBottom: 14 }}>
        {lang === "en" ? "Pilot mode: doctor requests are not confirmed until our team contacts you. Real provider onboarding is in progress." : "पाइलट मोड: हाम्रो टोलीले सम्पर्क नगरेसम्म डाक्टर अनुरोध पुष्टि हुँदैन। वास्तविक डाक्टर/सेवा प्रदायक onboarding चलिरहेको छ।"}
      </div>

      {requested && (
        <div style={{ background: C.greenLight, border: "1px solid #A7F3D0", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.green, marginBottom: 2 }}>✅ {lang === "en" ? "Request Sent!" : "अनुरोध पठाइयो!"}</div>
          <div style={{ fontSize: 12, color: "#065F46" }}>{lang === "en" ? requested.en : requested.ne} · {lang === "en" ? requested.waitEn : requested.waitNe}</div>
          <button onClick={() => setRequested(null)} style={{ marginTop: 8, background: "none", border: `1px solid ${C.green}44`, color: C.green, borderRadius: 8, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{lang === "en" ? "Close" : "बन्द"}</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          ["all", lang === "en" ? "All" : "सबै"],
          ["available", lang === "en" ? "Available" : "उपलब्ध"],
        ].map(([v, l]) => <button key={v} onClick={() => setFilter(v)} style={{ background: filter === v ? C.primary : C.white, color: filter === v ? "#fff" : C.textMid, border: `1px solid ${filter === v ? C.primary : C.border}`, borderRadius: 20, padding: "7px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}
      </div>

      {filtered.map((d) => (
        <div key={d.en} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${C.border}`, opacity: d.avail ? 1 : 0.65, boxShadow: C.shadow }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <Av init={d.init} color={d.color} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.text, marginBottom: 2 }}>{lang === "en" ? d.en : d.ne}</div>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>{lang === "en" ? d.specEn : d.specNe} · {lang === "en" ? d.expEn : d.expNe}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Star size={13} color={C.orange} fill={C.orange} /><span style={{ fontSize: 12, color: C.textMid, fontWeight: 700 }}>{d.rating}</span><span style={{ fontSize: 11, color: C.textLight }}>({d.reviews})</span></div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ background: d.avail ? C.greenLight : C.bg, color: d.avail ? C.green : C.textLight, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 800, marginBottom: 6 }}>{d.avail ? (lang === "en" ? "Available" : "उपलब्ध") : (lang === "en" ? "Busy" : "व्यस्त")}</div>
              <div style={{ fontSize: 11, color: C.textLight, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}><Clock size={12} />{lang === "en" ? d.waitEn : d.waitNe}</div>
            </div>
          </div>
          <div style={{ background: C.bg, borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: C.textMid }}>{lang === "en" ? "Consultation fee" : "परामर्श शुल्क"}</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{d.fee}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => d.avail && setRequested(d)} disabled={!d.avail} style={{ flex: 2, background: d.avail ? C.primary : C.border, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 800, cursor: d.avail ? "pointer" : "not-allowed", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><CalendarDays size={14} />{lang === "en" ? "Request Appointment" : "अनुरोध पठाउनुहोस्"}</button>
            <button style={{ flex: 1, background: C.primaryLight, color: C.primary, border: "none", borderRadius: 10, padding: "11px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{lang === "en" ? "Profile" : "प्रोफाइल"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Follow-up ─────────────────────────────────────────────────
function FollowUpScreen({ lang }) {
  const [followups] = useState([
    { id: 1, symptom: lang === "en" ? "Fever Follow-up" : "ज्वरो फलो-अप", date: "2026-05-24", time: "10:00 AM", status: "upcoming", color: C.orange, icon: "🌡️" },
    { id: 2, symptom: lang === "en" ? "Headache Follow-up" : "टाउको दुखाई फलो-अप", date: "2026-05-22", time: "09:00 AM", status: "done", color: C.primary, icon: "🤕" },
  ]);
  const [active, setActive] = useState(null);
  const [step, setStep] = useState(1);
  const [temp, setTemp] = useState("37.0");
  const [feeling, setFeeling] = useState("");
  const [medicine, setMedicine] = useState("");
  const [note, setNote] = useState("");

  if (active) {
    return (
      <div style={{ padding: "20px 16px 100px" }}>
        <button onClick={() => { setActive(null); setStep(1); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.textMid, fontFamily: "inherit", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}><ArrowLeft size={15} />{lang === "en" ? "Back" : "पछाडि"}</button>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 4 }}>{lang === "en" ? "Update Follow-up" : "फलो-अप अपडेट"}</div>
        <div style={{ fontSize: 13, color: C.textLight, marginBottom: 20 }}>{active.symptom}</div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 4 }}>
          {[1, 2, 3].map((s) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? C.primary : C.bg, color: step >= s ? "#fff" : C.textLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, border: `2px solid ${step >= s ? C.primary : C.border}`, flexShrink: 0 }}>{step > s ? "✓" : s}</div>{s < 3 && <div style={{ flex: 1, height: 2, background: step > s ? C.primary : C.border }} />}</div>)}
        </div>

        {step === 1 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 16 }}>{lang === "en" ? "How is your temperature?" : "तापक्रम कति छ?"}</div>
            <div style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16, textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
                <button onClick={() => setTemp((p) => (parseFloat(p) - 0.1).toFixed(1))} style={{ width: 40, height: 40, borderRadius: "50%", background: C.bg, border: `1px solid ${C.border}`, fontSize: 20, cursor: "pointer" }}>−</button>
                <div><div style={{ fontSize: 36, fontWeight: 900, color: C.primary }}>{temp} °C</div><div style={{ fontSize: 12, color: C.textLight }}>{lang === "en" ? "Normal: 36.1°C – 37.2°C" : "सामान्य: ३६.१°C – ३७.२°C"}</div></div>
                <button onClick={() => setTemp((p) => (parseFloat(p) + 0.1).toFixed(1))} style={{ width: 40, height: 40, borderRadius: "50%", background: C.bg, border: `1px solid ${C.border}`, fontSize: 20, cursor: "pointer" }}>+</button>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{lang === "en" ? "Next" : "अर्को"} →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 16 }}>{lang === "en" ? "How are you feeling?" : "अवस्था कस्तो छ?"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 20 }}>
              {[{ e: "😄", l: lang === "en" ? "Great" : "धेरै राम्रो" }, { e: "🙂", l: lang === "en" ? "Good" : "राम्रो" }, { e: "😐", l: lang === "en" ? "OK" : "उस्तै छ" }, { e: "😟", l: lang === "en" ? "Bad" : "खराब" }, { e: "😣", l: lang === "en" ? "Very bad" : "धेरै खराब" }].map((f) => <button key={f.l} onClick={() => setFeeling(f.l)} style={{ background: feeling === f.l ? C.primaryLight : C.white, border: `2px solid ${feeling === f.l ? C.primary : C.border}`, borderRadius: 12, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span style={{ fontSize: 22 }}>{f.e}</span><span style={{ fontSize: 9, color: feeling === f.l ? C.primary : C.textLight, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{f.l}</span></button>)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 10 }}>{lang === "en" ? "Taking medicine?" : "औषधि लिइरहनुभएको छ?"}</div>
            {[lang === "en" ? "Yes, taking it" : "लिइरहेको छु", lang === "en" ? "Started taking" : "लिन सुरु गरेको छु", lang === "en" ? "Not taking" : "लिएको छैन"].map((m) => <button key={m} onClick={() => setMedicine(m)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: C.white, border: `1.5px solid ${medicine === m ? C.primary : C.border}`, borderRadius: 10, marginBottom: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}><div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${medicine === m ? C.primary : C.border}`, background: medicine === m ? C.primary : "transparent" }} /> <span style={{ fontSize: 13, color: C.text }}>{m}</span></button>)}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}><button onClick={() => setStep(1)} style={{ flex: 1, background: C.bg, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← {lang === "en" ? "Back" : "पछाडि"}</button><button onClick={() => setStep(3)} style={{ flex: 2, background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{lang === "en" ? "Next" : "अर्को"} →</button></div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4 }}>{lang === "en" ? "Summary" : "सारांश"}</div>
            <div style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>{lang === "en" ? "Add any additional notes." : "थप टिप्पणी लेख्नुहोस्।"}</div>
            <div style={{ background: C.white, borderRadius: 14, padding: 14, border: `1px solid ${C.border}`, marginBottom: 12 }}>
              {[{ l: lang === "en" ? "Temperature" : "तापक्रम", v: `${temp}°C` }, { l: lang === "en" ? "Feeling" : "अवस्था", v: feeling || "—" }, { l: lang === "en" ? "Medicine" : "औषधि", v: medicine || "—" }].map(({ l, v }) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}><span style={{ fontSize: 13, color: C.textMid }}>{l}</span><span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{v}</span></div>)}
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={lang === "en" ? "E.g. Fever reduced slightly, still have headache..." : "जस्तै: ज्वरो अलि कम भयो, टाउको अझै दुखिरहेको छ..."} rows={3} style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, fontFamily: "inherit", color: C.text, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8 }}><button onClick={() => setStep(2)} style={{ flex: 1, background: C.bg, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← {lang === "en" ? "Back" : "पछाडि"}</button><button onClick={() => { setActive(null); setStep(1); }} style={{ flex: 2, background: C.green, color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>✅ {lang === "en" ? "Submit Update" : "अपडेट पठाउनुहोस्"}</button></div>
          </div>
        )}
      </div>
    );
  }

  const upcoming = followups.filter((f) => f.status === "upcoming");
  const done = followups.filter((f) => f.status === "done");

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 4 }}>{lang === "en" ? "Follow-up Reminders" : "फलो-अप रिमाइन्डर"}</div>
      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>{lang === "en" ? "Track your health progress" : "आफ्नो स्वास्थ्य अवस्थाको नियमित फलो-अप"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[{ v: upcoming.length, l: lang === "en" ? "Upcoming" : "आगामी", c: C.orange }, { v: done.length, l: lang === "en" ? "Completed" : "पूरा भयो", c: C.green }, { v: 0, l: lang === "en" ? "Missed" : "छुटेको", c: C.red }].map(({ v, l, c }) => <div key={l} style={{ background: C.white, borderRadius: 14, padding: "14px 10px", textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadow }}><div style={{ fontSize: 24, fontWeight: 900, color: c }}>{v}</div><div style={{ fontSize: 10, color: C.textMid, marginTop: 3 }}>{l}</div></div>)}
      </div>
      <Sh title={lang === "en" ? "Upcoming Follow-ups" : "आगामी फलो-अप"} />
      {upcoming.map((f) => <button key={f.id} onClick={() => setActive(f)} style={{ width: "100%", background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10, cursor: "pointer", boxShadow: C.shadow, display: "flex", alignItems: "center", gap: 12, fontFamily: "inherit", textAlign: "left" }}><div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{f.icon}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 2 }}>{f.symptom}</div><div style={{ fontSize: 12, color: C.textLight }}>📅 {f.date} · ⏱ {f.time}</div></div><span style={{ background: C.orangeLight, color: C.orange, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>{lang === "en" ? "Upcoming" : "आगामी"}</span></button>)}
      <Sh title={lang === "en" ? "Past Follow-ups" : "हालैका फलो-अप"} />
      {done.map((f) => <div key={f.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: C.shadow, display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{f.icon}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 2 }}>{f.symptom}</div><div style={{ fontSize: 12, color: C.textLight }}>📅 {f.date} · ⏱ {f.time}</div></div><span style={{ background: C.greenLight, color: C.green, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>✓ {lang === "en" ? "Done" : "पूरा"}</span></div>)}
    </div>
  );
}

// ─── Profile ───────────────────────────────────────────────────
function ProfileScreen({ user, onLogout, lang, onLangChange }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("health_chats").select("*").eq("user_id", user.user_id).eq("role", "user").order("created_at", { ascending: false }).limit(20);
      setHistory(data || []);
      setLoading(false);
    }
    load();
  }, [user.user_id]);

  async function handleLangChange(l) {
    onLangChange(l);
    await supabase.from("health_profiles").update({ lang: l }).eq("user_id", user.user_id);
    const s = JSON.parse(localStorage.getItem("ss_user") || "{}");
    localStorage.setItem("ss_user", JSON.stringify({ ...s, lang: l }));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("ss_user");
    onLogout();
  }

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)", borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><UserRound size={28} color="#fff" /></div>
          <div><div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{user.name}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{[user.local_level, user.district, user.province].filter(Boolean).join(", ") || "Nepal"}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: lang === "en" ? "Chats" : "कुराकानी", v: history.length }, { l: lang === "en" ? "District" : "जिल्ला", v: user.district || "—" }, { l: lang === "en" ? "Age" : "उमेर", v: user.age || "—" }].map(({ l, v }) => <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 900, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{l}</div></div>)}
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}><Languages size={16} color={C.primary} /> {lang === "en" ? "Language" : "भाषा"}</div>
        <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 4, gap: 4 }}>
          {[ ["en", "English"], ["ne", "नेपाली"] ].map(([l, label]) => <button key={l} onClick={() => handleLangChange(l)} style={{ flex: 1, background: lang === l ? C.white : "transparent", color: lang === l ? C.primary : C.textLight, border: "none", borderRadius: 9, padding: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{label}</button>)}
        </div>
      </div>

      <Sh title={lang === "en" ? "Health History" : "स्वास्थ्य इतिहास"} />
      {loading ? <div style={{ textAlign: "center", padding: 20, color: C.textLight }}>{lang === "en" ? "Loading..." : "लोड हुँदैछ..."}</div> : history.length === 0 ? <div style={{ background: C.white, borderRadius: 14, padding: 24, textAlign: "center", border: `1px solid ${C.border}` }}><MessageCircle size={34} color={C.textLight} /><div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 8 }}>{lang === "en" ? "No conversations yet" : "कुराकानी छैन"}</div></div> : history.map((h) => <div key={h.id || h.created_at} style={{ background: C.white, borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: `1px solid ${C.border}`, boxShadow: C.shadow }}><div style={{ fontSize: 13, color: C.text, marginBottom: 4, lineHeight: 1.5 }}>{h.message.length > 80 ? `${h.message.slice(0, 80)}...` : h.message}</div><div style={{ fontSize: 10, color: C.textLight }}>{new Date(h.created_at).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</div></div>)}
      <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
        <button onClick={handleLogout} style={{ width: "100%", background: C.redLight, color: C.red, border: "1px solid #FECACA", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LogOut size={16} /> {lang === "en" ? "Sign Out" : "साइन आउट"}</button>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const [online, setOnline] = useState(navigator.onLine);
  const [pickedSym, setPickedSym] = useState(null);
  const [chatSeed, setChatSeed] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("ss_user");
    if (s) {
      try {
        const p = JSON.parse(s);
        setUser(p);
        setLang(p.lang || "en");
      } catch (e) {
        localStorage.removeItem("ss_user");
      }
    }
    setAuthLoading(false);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  function handleLangChange(l) {
    setLang(l);
    const s = JSON.parse(localStorage.getItem("ss_user") || "{}");
    localStorage.setItem("ss_user", JSON.stringify({ ...s, lang: l }));
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1D4ED8,#2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <HeartPulse size={48} color="#fff" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, color: "#fff", fontWeight: 900 }}>Swasthya Sahayak</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen onLogin={(u) => { setUser(u); setLang(u.lang || "en"); }} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Inter','Noto Sans Devanagari','Segoe UI',system-ui,sans-serif", color: C.text }}>
      <div style={{ background: C.white, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}><HeartPulse size={19} color="#fff" /></div>
          <div><div style={{ fontSize: 15, fontWeight: 900, color: C.text, lineHeight: 1 }}>{lang === "en" ? "Swasthya Sahayak" : "स्वास्थ्य सहायक"}</div><div style={{ fontSize: 9, color: C.textLight, marginTop: 1 }}>Nepal AI Health Assistant · Beta</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: C.bg, borderRadius: 16, padding: 3, border: `1px solid ${C.border}`, gap: 2 }}>
            {[
              ["en", "EN"],
              ["ne", "ने"],
            ].map(([l, label]) => <button key={l} onClick={() => handleLangChange(l)} style={{ background: lang === l ? C.primary : "transparent", color: lang === l ? "#fff" : C.textLight, border: "none", borderRadius: 12, padding: "3px 9px", fontSize: 10, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: online ? C.greenLight : C.orangeLight, padding: "4px 8px", borderRadius: 20 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: online ? C.green : C.orange }} /><span style={{ fontSize: 9, fontWeight: 900, color: online ? C.green : C.orange }}>{online ? "Live" : "Offline"}</span></div>
          <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><Menu size={24} color={C.textMid} /></button>
        </div>
      </div>

      {!online && <div style={{ background: C.orangeLight, padding: "7px 16px", fontSize: 12, color: C.orange, fontWeight: 700, borderBottom: "1px solid #FDE68A" }}>⚠️ {lang === "en" ? "No internet — basic features available" : "इन्टरनेट छैन — मूल सुविधा उपलब्ध"}</div>}

      <div style={{ height: `calc(100vh - ${online ? 55 : 80}px - 54px)`, overflowY: "auto" }}>
        {tab === "home" && <HomeScreen setTab={setTab} pickSym={setPickedSym} user={user} lang={lang} />}
        {tab === "check" && <CheckScreen initSym={pickedSym} setTab={setTab} setChatSeed={setChatSeed} lang={lang} />}
        {tab === "firstaid" && <FirstAidScreen lang={lang} />}
        {tab === "chat" && <ChatScreen seed={chatSeed} setSeed={setChatSeed} online={online} user={user} lang={lang} />}
        {tab === "doctors" && <DoctorsScreen lang={lang} />}
        {tab === "followup" && <FollowUpScreen lang={lang} />}
        {tab === "profile" && <ProfileScreen user={user} onLogout={() => setUser(null)} lang={lang} onLangChange={handleLangChange} />}
        {tab === "history" && <ProfileScreen user={user} onLogout={() => setUser(null)} lang={lang} onLangChange={handleLangChange} />}
      </div>

      <NavBar tab={tab} setTab={setTab} lang={lang} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} setTab={setTab} user={user} onLogout={async () => { await supabase.auth.signOut(); localStorage.removeItem("ss_user"); setUser(null); }} lang={lang} onLangChange={handleLangChange} />
    </div>
  );
}
