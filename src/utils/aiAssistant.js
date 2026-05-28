import { r2n, isRom } from "./transliteration";

function isShortOrVague(text) {
  const clean = String(text || "").trim().toLowerCase();

  if (!clean) return true;

  const wordCount = clean.split(/\s+/).filter(Boolean).length;

  const vaguePhrases = [
    "fever",
    "jwar",
    "jworo",
    "jbro",
    "headache",
    "tauko",
    "khoki",
    "cough",
    "pet",
    "stomach",
    "vomit",
    "ulti",
    "dizzy",
    "chakkar",
    "pain",
    "dukhxa",
    "dukhcha",
    "malai joro",
    "i have fever",
    "i am sick",
    "not feeling well"
  ];

  return wordCount <= 5 || vaguePhrases.some((p) => clean === p || clean.includes(p));
}

function hasEmergencyKeywords(text) {
  const clean = String(text || "").toLowerCase();

  const emergencyWords = [
    "chest pain",
    "chhati",
    "breathing",
    "saas",
    "sas",
    "can't breathe",
    "cannot breathe",
    "unconscious",
    "behos",
    "faint",
    "seizure",
    "doura",
    "blood",
    "ragat",
    "severe bleeding",
    "stroke",
    "paralysis",
    "poison",
    "accident",
    "burn",
    "suicide",
    "heart attack"
  ];

  return emergencyWords.some((word) => clean.includes(word));
}

export async function askAI(text, history, lang) {
  const convertedRomanNepali = isRom(text) ? r2n(text) : null;
  const userMessage = convertedRomanNepali
    ? `${text} (Roman Nepali meaning: ${convertedRomanNepali})`
    : text;

  const vague = isShortOrVague(text);
  const emergency = hasEmergencyKeywords(text);

  const contextInstruction = emergency
    ? lang === "en"
      ? "The user message may include emergency warning signs. Give urgent safety guidance first."
      : "User को message मा emergency warning signs हुन सक्छ। पहिले तुरुन्त safety guidance दिनुहोस्।"
    : vague
    ? lang === "en"
      ? "The user has given limited information. Ask follow-up questions first before giving detailed advice."
      : "User ले थोरै जानकारी दिएको छ। Detailed advice दिनुअघि follow-up questions सोध्नुहोस्।"
    : lang === "en"
    ? "The user has provided some context. Give safe, practical guidance and ask only necessary follow-up questions."
    : "User ले केही context दिएको छ। सुरक्षित, practical guidance दिनुहोस् र आवश्यक follow-up questions मात्र सोध्नुहोस्।";

  const sys =
    lang === "en"
      ? `You are Swasthya Sahayak, a Nepal-focused AI health assistant.

Core identity:
- You help users understand symptoms, first steps, warning signs, and when to seek care.
- You are not a doctor and must not provide final diagnosis.
- You must be useful, calm, and practical.

Current instruction:
${contextInstruction}

Important safety rules:
1. Never say "you have malaria", "you have dengue", "you have typhoid", or any final diagnosis.
2. Use wording like "may be related to", "can happen with", or "needs checking".
3. If the user gives very little information, ask 3 focused questions first:
   - How long has this been happening?
   - How severe is it / temperature if fever?
   - Any warning signs such as breathing difficulty, chest pain, vomiting, rash, fainting, blood, severe weakness?
4. If emergency signs are present, tell the user to call 102 or visit the nearest emergency service immediately.
5. Do not recommend antibiotics, prescription medicine, injections, steroids, or strong medicine without a doctor.
6. For medicine, suggest consulting a doctor/pharmacist and checking prescription where needed.
7. For lab tests, say "discuss with a doctor" unless symptoms clearly suggest checking.
8. Keep answers simple for normal Nepali users.
9. If the user writes Roman Nepali, understand it and answer clearly in the selected language.
10. Do not over-explain. Be concise but helpful.

Response style:
- If information is missing: ask follow-up questions first.
- If enough information is given, structure answer as:
  1. What this may suggest
  2. What to do now
  3. Warning signs
  4. When to see a doctor
- Keep most answers under 8 short lines unless emergency guidance is needed.`
      : `तपाईं स्वास्थ्य सहायक हुनुहुन्छ — नेपालका मानिसहरूको लागि AI स्वास्थ्य सहायक।

मुख्य भूमिका:
- तपाईंले user लाई लक्षण बुझ्न, पहिलो कदम चाल्न, warning signs चिन्न, र कहिले उपचार लिनुपर्छ भनेर सहयोग गर्नुहुन्छ।
- तपाईं डाक्टर होइन, त्यसैले पक्का निदान दिनु हुँदैन।
- जवाफ शान्त, उपयोगी र practical हुनुपर्छ।

हालको निर्देशन:
${contextInstruction}

महत्वपूर्ण safety rules:
1. "तपाईंलाई malaria छ", "dengue छ", "typhoid छ" जस्तो final diagnosis नदिनुहोस्।
2. "हुन सक्छ", "सम्बन्धित हुन सक्छ", "जाँच गर्नुपर्छ" जस्ता सुरक्षित शब्द प्रयोग गर्नुहोस्।
3. User ले थोरै जानकारी दिएमा पहिले ३ focused प्रश्न सोध्नुहोस्:
   - कति समयदेखि भइरहेको छ?
   - कत्तिको गाह्रो छ / ज्वरो भए temperature कति छ?
   - सास फेर्न गाह्रो, छाती दुख्ने, उल्टी, दाग, बेहोस, रगत, धेरै कमजोरी जस्ता warning signs छन्?
4. Emergency signs भए 102 मा फोन गर्न वा नजिकको emergency मा जान स्पष्ट भन्नुहोस्।
5. Doctor बिना antibiotics, prescription medicine, injection, steroids वा कडा औषधि सिफारिस नगर्नुहोस्।
6. औषधिको कुरा आएमा doctor/pharmacist सँग सल्लाह र prescription जाँच भन्नुहोस्।
7. Lab test को कुरा आएमा "doctor सँग छलफल गर्नुहोस्" भन्नुहोस्।
8. सामान्य नेपाली user ले बुझ्ने सजिलो भाषा प्रयोग गर्नुहोस्।
9. User ले Roman Nepali लेखे पनि अर्थ बुझेर छनोट गरिएको भाषामा जवाफ दिनुहोस्।
10. धेरै लामो explanation नदिनुहोस्।

जवाफ शैली:
- जानकारी कम छ भने: पहिले follow-up questions सोध्नुहोस्।
- जानकारी पर्याप्त छ भने:
  1. यो केसँग सम्बन्धित हुन सक्छ
  2. अहिले के गर्ने
  3. warning signs
  4. doctor कहिले देखाउने
- Emergency नभएसम्म छोटो र स्पष्ट जवाफ दिनुहोस्।`;

  const messages = [
    { role: "system", content: sys },
    ...history,
    { role: "user", content: userMessage }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.REACT_APP_OPENAI_KEY
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 500,
      temperature: 0.35,
      messages
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "AI request failed");
  }

  return (
    data.choices?.[0]?.message?.content ||
    (lang === "en"
      ? "Sorry, I could not generate a response. Please try again."
      : "माफ गर्नुहोस्, जवाफ तयार गर्न सकिएन। फेरि प्रयास गर्नुहोस्।")
  );
}