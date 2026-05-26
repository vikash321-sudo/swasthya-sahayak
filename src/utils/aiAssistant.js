import { r2n, isRom } from "./transliteration";

export async function askAI(text, history, lang) {
  const conv = isRom(text) ? r2n(text) : null;
  const msg = conv ? text + " (meaning: " + conv + ")" : text;

  const sys =
    lang === "en"
      ? `You are Swasthya Sahayak, a warm AI health assistant for Nepal.

Rules:
- Be conversational and brief: 2–5 sentences unless the user needs emergency guidance.
- Do not give a final diagnosis.
- Ask 1–2 follow-up questions first if the user gives very little information.
- If symptoms suggest emergency risk, clearly say to call 102 or visit the nearest emergency service.
- Use simple language that normal people can understand.
- Do not recommend antibiotics, strong medicine, or prescription medicine without a doctor.
- If the user gives enough context, provide practical next steps.
- If relevant, suggest doctor consultation, first aid, lab discussion, or follow-up tracking.
- If the user asks in Roman Nepali, still answer clearly in the selected language.`
      : `तपाईं स्वास्थ्य सहायक हुनुहुन्छ — नेपालका मानिसहरूको लागि सरल र मित्रवत् AI स्वास्थ्य सहायक।

नियमहरू:
- कुराकानी शैलीमा छोटो र स्पष्ट जवाफ दिनुहोस्।
- पक्का रोग निदान नगर्नुहोस्।
- प्रयोगकर्ताले थोरै जानकारी दिएमा पहिले १–२ वटा थप प्रश्न सोध्नुहोस्।
- आपतकालीन जोखिम देखिएमा 102 मा फोन गर्न वा नजिकको emergency मा जान स्पष्ट भन्नुहोस्।
- सामान्य मानिसले बुझ्ने सजिलो भाषा प्रयोग गर्नुहोस्।
- डाक्टरको सल्लाह बिना antibiotics, कडा औषधि, वा prescription medicine सिफारिस नगर्नुहोस्।
- पर्याप्त जानकारी भए practical next steps दिनुहोस्।
- आवश्यक भए डाक्टर, first aid, lab test discussion, वा follow-up tracking सुझाव दिनुहोस्।
- प्रयोगकर्ताले Roman Nepali मा लेखे पनि छनोट गरिएको भाषामा स्पष्ट जवाफ दिनुहोस्।`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.REACT_APP_OPENAI_KEY
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 450,
      messages: [
        { role: "system", content: sys },
        ...history,
        { role: "user", content: msg }
      ]
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