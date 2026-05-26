import { C } from "../constants/colors";
import { SYMPTOMS } from "../data/symptomsData";

export function symptomIdsFromText(text) {
  const raw = text || "";
  const lower = raw.toLowerCase();

  return SYMPTOMS.filter((s) => {
    const englishMatch = lower.includes(s.en.toLowerCase());
    const romanMatch = s.roman?.some((r) => lower.includes(r));
    const nepaliMatch = s.ne && raw.includes(s.ne.split(" ")[0]);
    return englishMatch || romanMatch || nepaliMatch;
  }).map((s) => s.id);
}

export function uniqueIds(ids) {
  return Array.from(new Set(ids.filter(Boolean)));
}

export function getRedFlagLabel(id, lang) {
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

export function buildSmartAssessment({
  symptoms,
  duration,
  temperature,
  intensity,
  ageGroup,
  redFlags,
  lang
}) {
  const ids = symptoms.map((s) => s.id);
  const has = (id) => ids.includes(id);
  const all = (...items) => items.every((id) => ids.includes(id));

  const temp = parseFloat(temperature);
  const tempKnown = !Number.isNaN(temp);
  const longDuration = duration === "3plus" || duration === "week";
  const vulnerable =
    ageGroup === "child" ||
    ageGroup === "elderly" ||
    ageGroup === "pregnant";

  const redSet = new Set(redFlags);

  const t =
    lang === "en"
      ? {
          highTitle: "Urgent care may be needed",
          mediumTitle: "Needs attention",
          lowTitle: "Mild for now",

          highSummary:
            "Your symptom pattern includes warning signs. This is not a diagnosis, but it should not be ignored.",
          mediumSummary:
            "Your symptoms may be due to a common illness, infection, dehydration, or another condition. More observation is needed.",
          lowSummary:
            "Your symptoms look mild based on the information given, but keep monitoring them.",

          combinedReason:
            "The symptoms together matter more than each symptom alone.",
          feverHeadache:
            "Fever with headache can happen with viral fever, dehydration, dengue-like illness, typhoid-like illness, or other infections.",
          feverCough:
            "Fever with cough can be related to flu, respiratory infection, COVID-like illness, or chest infection.",
          feverStomach:
            "Fever with stomach pain or vomiting can be related to food poisoning, stomach infection, dehydration, or other infection.",
          chestBreathing:
            "Chest pain with breathing difficulty is a red-flag combination and needs urgent medical attention.",
          stomachVomiting:
            "Stomach pain with vomiting can quickly cause dehydration, especially in children and elderly people.",
          headacheDizzy:
            "Headache with dizziness may be linked with dehydration, low blood pressure, weakness, stress, or other causes.",

          doNow: "What to do now",
          possible: "What this pattern may suggest",
          doctorWhen: "When to see a doctor",
          labConsider: "Possible lab discussion with doctor",
          nextStep: "Recommended next step",

          emergency: "Call 102 or go to the nearest emergency service now.",
          restFluid:
            "Rest, drink enough water, and avoid heavy work for now.",
          feverCare:
            "Check temperature every 4–6 hours and drink ORS/water frequently.",
          avoidSelfMed:
            "Do not take antibiotics or strong medicine without a doctor.",
          monitor: "Monitor symptoms for the next 24 hours.",

          doctorHigh: "Go to a doctor or emergency service immediately.",
          doctorMedium:
            "See a doctor if symptoms continue, worsen, or last more than 24–48 hours.",
          doctorFever:
            "See a doctor if fever lasts 3 days, goes above 39°C, or comes with rash, severe headache, vomiting, or weakness.",
          doctorLow: "See a doctor if symptoms worsen or new symptoms appear.",

          labFever:
            "If fever continues for 3+ days, ask a doctor about CBC, dengue, malaria, typhoid, or urine tests depending on symptoms.",
          labStomach:
            "If vomiting/diarrhea continues, a doctor may suggest stool/urine tests and dehydration assessment.",

          notDiagnosis: "This is basic guidance, not a final diagnosis."
        }
      : {
          highTitle: "तत्काल उपचार आवश्यक हुन सक्छ",
          mediumTitle: "ध्यान दिनुपर्ने अवस्था",
          lowTitle: "हाल सामान्य देखिन्छ",

          highSummary:
            "तपाईंको लक्षणमा चेतावनी संकेत देखिएको छ। यो पक्का निदान होइन, तर बेवास्ता गर्नु हुँदैन।",
          mediumSummary:
            "यी लक्षण सामान्य संक्रमण, डिहाइड्रेसन, वा अन्य कारणले हुन सक्छन्। अझै निगरानी आवश्यक छ।",
          lowSummary:
            "दिएको जानकारी अनुसार हाल लक्षण सामान्य देखिन्छ, तर निगरानी गरिरहनुहोस्।",

          combinedReason:
            "लक्षणहरूलाई छुट्टाछुट्टै होइन, सँगै हेर्नु महत्त्वपूर्ण हुन्छ।",
          feverHeadache:
            "ज्वरो र टाउको दुखाई सँगै हुँदा भाइरल ज्वरो, डिहाइड्रेसन, डेंगी-जस्तो समस्या, टाइफाइड-जस्तो समस्या वा अन्य संक्रमण हुन सक्छ।",
          feverCough:
            "ज्वरो र खोकी सँगै हुँदा फ्लु, श्वासप्रश्वास संक्रमण, COVID-जस्तो समस्या वा छातीको संक्रमणसँग सम्बन्धित हुन सक्छ।",
          feverStomach:
            "ज्वरोसँग पेट दुख्ने वा उल्टी भए फूड पोइजनिङ, पेटको संक्रमण, डिहाइड्रेसन वा अन्य संक्रमण हुन सक्छ।",
          chestBreathing:
            "छाती दुखाई र सास फेर्न गाह्रो हुनु आपतकालीन संकेत हो। तुरुन्त उपचार आवश्यक हुन्छ।",
          stomachVomiting:
            "पेट दुखाई र उल्टीले छिट्टै डिहाइड्रेसन गराउन सक्छ, विशेषगरी बच्चा र वृद्धमा।",
          headacheDizzy:
            "टाउको दुखाई र चक्कर डिहाइड्रेसन, कम रक्तचाप, कमजोरी, तनाव वा अन्य कारणसँग सम्बन्धित हुन सक्छ।",

          doNow: "अहिले के गर्ने",
          possible: "यो लक्षण ढाँचाले के संकेत गर्न सक्छ",
          doctorWhen: "डाक्टर कहिले देखाउने",
          labConsider: "डाक्टरसँग छलफल गर्न सकिने परीक्षण",
          nextStep: "सुझाव गरिएको अर्को कदम",

          emergency:
            "तुरुन्त 102 मा फोन गर्नुहोस् वा नजिकको emergency मा जानुहोस्।",
          restFluid:
            "आराम गर्नुहोस्, पर्याप्त पानी पिउनुहोस्, र अहिले भारी काम नगर्नुहोस्।",
          feverCare:
            "हरेक ४–६ घण्टामा तापक्रम जाँच्नुहोस् र ORS/पानी बारम्बार पिउनुहोस्।",
          avoidSelfMed:
            "डाक्टरको सल्लाह बिना antibiotics वा कडा औषधि नखानुहोस्।",
          monitor: "अर्को २४ घण्टा लक्षण निगरानी गर्नुहोस्।",

          doctorHigh: "तुरुन्त डाक्टर वा emergency सेवा लिनुहोस्।",
          doctorMedium:
            "लक्षण जारी रहे, बढे, वा २४–४८ घण्टा भन्दा बढी रहे डाक्टर देखाउनुहोस्।",
          doctorFever:
            "ज्वरो ३ दिनभन्दा बढी रहे, ३९°C भन्दा माथि गए, वा दाग/तीव्र टाउको दुखाई/उल्टी/कमजोरी आए डाक्टर देखाउनुहोस्।",
          doctorLow: "लक्षण बढे वा नयाँ लक्षण देखिए डाक्टर देखाउनुहोस्।",

          labFever:
            "ज्वरो ३+ दिन रहे डाक्टरसँग CBC, dengue, malaria, typhoid वा urine test बारे सोध्न सकिन्छ।",
          labStomach:
            "उल्टी/झाडापखाला जारी रहे stool/urine test र dehydration जाँच आवश्यक हुन सक्छ।",

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
  if (has("fever") && (has("stomach") || has("vomiting"))) {
    reasons.push(t.feverStomach);
  }
  if (all("stomach", "vomiting")) reasons.push(t.stomachVomiting);
  if (all("headache", "dizzy")) reasons.push(t.headacheDizzy);

  if (reasons.length === 0) {
    const possible = Array.from(
      new Set(symptoms.flatMap((s) => (lang === "en" ? s.causesEn : s.causesNe)))
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
    actions.push(
      lang === "en"
        ? "Do not wait for symptoms to become worse."
        : "लक्षण अझै खराब होस् भनेर प्रतीक्षा नगर्नुहोस्।"
    );
    actions.push(
      lang === "en"
        ? "Keep the person sitting or lying safely while arranging help."
        : "मद्दतको व्यवस्था गर्दा व्यक्तिलाई सुरक्षित रूपमा बसाउनु वा सुताउनुहोस्।"
    );
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