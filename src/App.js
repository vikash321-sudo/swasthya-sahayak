import { useState, useEffect, useRef } from "react";

// ─── Design Direction ───────────────────────────────────────────
// Light, warm white background. Soft teal + purple accents.
// Rounded cards, large touch targets, friendly icons.
// Feels like a trusted government/health service app.
// Noto Sans Devanagari for perfect Nepali rendering.
// Simple enough for someone who has never used an app before.

const C = {
  bg:         "#F7F9FC",
  white:      "#FFFFFF",
  teal:       "#0891B2",
  tealLight:  "#E0F2FE",
  tealDark:   "#0369A1",
  purple:     "#7C3AED",
  purpleLight:"#EDE9FE",
  purpleDark: "#5B21B6",
  green:      "#059669",
  greenLight: "#D1FAE5",
  red:        "#DC2626",
  redLight:   "#FEE2E2",
  orange:     "#D97706",
  orangeLight:"#FEF3C7",
  text:       "#1E293B",
  textMid:    "#475569",
  textLight:  "#94A3B8",
  border:     "#E2E8F0",
  shadow:     "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:   "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
  shadowLg:   "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)",
};

// ─── Transliteration Engine ────────────────────────────────────
const WORD_MAP = {
  "tauko":"टाउको","dukhxa":"दुख्छ","dukhcha":"दुख्छ","dukcha":"दुख्छ",
  "jworo":"ज्वरो","jwaro":"ज्वरो","joro":"ज्वरो","fever":"ज्वरो",
  "pet":"पेट","peta":"पेटमा","stomach":"पेट",
  "khansi":"खाँसी","khaasi":"खाँसी","cough":"खाँसी",
  "ulti":"उल्टी","vomiting":"उल्टी","banti":"बान्ता",
  "chhati":"छाती","chati":"छाती","chest":"छाती",
  "chakkar":"चक्कर","dizzy":"चक्कर","dizziness":"चक्कर",
  "sas":"सास","breathing":"सास","shwas":"श्वास",
  "ferna":"फेर्न","garho":"गाह्रो","garo":"गाह्रो",
  "aankha":"आँखा","aankhaa":"आँखा","eye":"आँखा",
  "headache":"टाउको दुख्छ","pain":"दुखाई",
  "thikai":"ठिकै","ramro":"राम्रो","naramro":"नराम्रो",
  "khana":"खाना","paani":"पानी","pani":"पानी",
  "doctor":"डाक्टर","hospital":"अस्पताल",
  "ma":"मलाई","mero":"मेरो","dherai":"धेरै",
  "cha":"छ","chha":"छ","chaina":"छैन",
  "huncha":"हुन्छ","bhayo":"भयो","garnu":"गर्नु",
};

function romanToNepali(text) {
  if (!text) return text;
  if (/[\u0900-\u097F]/.test(text)) return text;
  const words = text.toLowerCase().split(/\s+/);
  const converted = words.map(w => WORD_MAP[w] || w);
  const result = converted.join(" ");
  return result !== text.toLowerCase() ? result : null;
}

function isRoman(text) {
  if (!text || /[\u0900-\u097F]/.test(text)) return false;
  return Object.keys(WORD_MAP).some(k => text.toLowerCase().includes(k));
}

// ─── Medical Knowledge Base ────────────────────────────────────
const SYMPTOMS = [
  {
    id:"headache", icon:"🤕",
    nepali:"टाउको दुख्छ", en:"Headache",
    roman:["tauko dukhxa","tauko dukhcha","headache","head pain","tauko"],
    causes:["माइग्रेन","तनाव","डिहाइड्रेसन","ज्वरो"],
    advice:"पानी पिउनुहोस् र अँध्यारो कोठामा आराम गर्नुहोस्। पारासिटामोल लिन सक्नुहुन्छ।",
    warning:"अचानक धेरै तीव्र दुखाई वा आँखा नदेख्ने भयो भने तुरुन्त अस्पताल जानुहोस्।",
    severity:"low", color: C.orange, lightColor: C.orangeLight,
  },
  {
    id:"fever", icon:"🌡️",
    nepali:"ज्वरो आउँछ", en:"Fever",
    roman:["jworo","jwaro","joro","fever","taato"],
    causes:["फ्लु","म्यालेरिया","टाइफाइड","डेंगी"],
    advice:"धेरै पानी र ORS पिउनुहोस्। हल्का कपडा लगाउनुहोस्। माथामा चिसो पट्टी राख्नुहोस्।",
    warning:"३ दिनभन्दा बढी ज्वरो रहे वा धेरै तीव्र भए डाक्टर देखाउनुहोस्।",
    severity:"medium", color: C.orange, lightColor: C.orangeLight,
  },
  {
    id:"stomach", icon:"🫃",
    nepali:"पेट दुख्छ", en:"Stomach Pain",
    roman:["pet dukhxa","pet dukhcha","stomach pain","peta dukhxa"],
    causes:["ग्यास्ट्रिक","अपच","फूड पोइजनिङ"],
    advice:"हल्का तातो पानी पिउनुहोस्। भारी खाना नखानुहोस्। आराम गर्नुहोस्।",
    warning:"दायाँ तल्लो पेट कडा भयो वा उल्टीमा रगत आए तुरुन्त अस्पताल जानुहोस्।",
    severity:"medium", color: C.teal, lightColor: C.tealLight,
  },
  {
    id:"breathing", icon:"🫁",
    nepali:"सास फेर्न गाह्रो", en:"Breathing Difficulty",
    roman:["sas ferna garho","breathing problem","sas pherna garo"],
    causes:["अस्थमा","निमोनिया","COVID-19"],
    advice:"सिधा बसेर ताजा हावा लिनुहोस्। कसिलो कपडा फुकाउनुहोस्।",
    warning:"⚠️ यो गम्भीर लक्षण हो। तुरुन्त 102 मा फोन गर्नुहोस्।",
    severity:"high", color: C.red, lightColor: C.redLight,
  },
  {
    id:"cough", icon:"😮‍💨",
    nepali:"खाँसी लाग्छ", en:"Cough",
    roman:["khansi","khaasi","cough","khoki"],
    causes:["रुघाखोकी","ब्रोन्काइटिस","TB","एलर्जी"],
    advice:"तातो पानीमा मह र अदुवा मिसाएर पिउनुहोस्। भाप लिनुहोस्।",
    warning:"२ हप्ताभन्दा बढी खोकी भए TB परीक्षण गराउनुहोस्।",
    severity:"low", color: C.teal, lightColor: C.tealLight,
  },
  {
    id:"vomiting", icon:"🤢",
    nepali:"उल्टी हुन्छ", en:"Vomiting",
    roman:["ulti","banti","vomiting"],
    causes:["फूड पोइजनिङ","ग्यास्ट्रिक","माइग्रेन"],
    advice:"ORS वा नुन-चिनीको पानी बिस्तारै पिउनुहोस्। आराम गर्नुहोस्।",
    warning:"रगत आयो वा ६ घण्टाभन्दा बढी उल्टी भयो भने अस्पताल जानुहोस्।",
    severity:"medium", color: C.purple, lightColor: C.purpleLight,
  },
  {
    id:"chest", icon:"💔",
    nepali:"छाती दुख्छ", en:"Chest Pain",
    roman:["chhati dukhxa","chest pain","chati dukhcha"],
    causes:["मुटुरोग","ग्यास्ट्रिक","निमोनिया"],
    advice:"बिरामीलाई सुताउनुहोस् र शान्त राख्नुहोस्।",
    warning:"⚠️ तुरुन्त 102 मा फोन गर्नुहोस्। एक मिनेट पनि ढिलाइ नगर्नुहोस्।",
    severity:"high", color: C.red, lightColor: C.redLight,
  },
  {
    id:"dizzy", icon:"😵",
    nepali:"चक्कर लाग्छ", en:"Dizziness",
    roman:["chakkar","dizzy","dizziness","chakkar lagxa"],
    causes:["रक्तचाप","एनिमिया","डिहाइड्रेसन"],
    advice:"बसी आराम गर्नुहोस्। पानी पिउनुहोस्। बिस्तारै उठ्नुहोस्।",
    warning:"बेहोस भयो वा बारम्बार चक्कर आउँछ भने डाक्टर देखाउनुहोस्।",
    severity:"low", color: C.purple, lightColor: C.purpleLight,
  },
];

const DOCTORS = [
  { name:"डा. सुनिता श्रेष्ठ", spec:"सामान्य चिकित्सक", avail:true, rating:"४.९", fee:"NPR ५००", wait:"अहिले उपलब्ध", avatar:"👩‍⚕️" },
  { name:"डा. रमेश थापा", spec:"बाल रोग विशेषज्ञ", avail:true, rating:"४.८", fee:"NPR ७००", wait:"२० मिनेटमा", avatar:"👨‍⚕️" },
  { name:"डा. प्रिया गुरुङ", spec:"स्त्री रोग विशेषज्ञ", avail:false, rating:"४.९", fee:"NPR ८००", wait:"भोलि बिहान", avatar:"👩‍⚕️" },
  { name:"डा. अमित पाण्डे", spec:"हड्डी विशेषज्ञ", avail:true, rating:"४.७", fee:"NPR ६००", wait:"१ घण्टामा", avatar:"👨‍⚕️" },
];

const TIPS = [
  { icon:"💧", title:"पानी पिउनुहोस्", body:"दिनमा कम्तीमा ८ गिलास सफा पानी पिउनुहोस्।" },
  { icon:"🥗", title:"सन्तुलित खाना", body:"दाल, भात, तरकारी र फलफूल नियमित खानुहोस्।" },
  { icon:"😴", title:"पर्याप्त निद्रा", body:"प्रतिदिन ७–८ घण्टा सुत्नुहोस्।" },
  { icon:"🚶", title:"हिँड्नुहोस्", body:"दिनमा कम्तीमा ३० मिनेट हिँड्नुहोस्।" },
  { icon:"🤲", title:"हात धुनुहोस्", body:"खाना अघि र शौचालय पछि साबुनले हात धुनुहोस्।" },
  { icon:"💉", title:"खोप लगाउनुहोस्", body:"नजिकको स्वास्थ्य चौकीमा नियमित खोप लगाउनुहोस्।" },
];

// ─── AI Chat ────────────────────────────────────────────────────
async function askAI(text, history) {
  const converted = isRoman(text) ? romanToNepali(text) : null;
  const finalText = converted ? `${text} (अर्थात्: ${converted})` : text;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `तपाईं "स्वास्थ्य सहायक" हुनुहुन्छ — नेपालको ग्रामीण जनताको लागि मित्रवत् AI स्वास्थ्य सहायक।
नियमहरू:
- सधैँ सरल नेपाली भाषामा जवाफ दिनुहोस्
- कहिल्यै रोगको पक्का निदान नगर्नुहोस्
- सधैँ वास्तविक डाक्टर देखाउन सुझाव दिनुहोस्
- आपतकालमा तुरुन्त 102 भन्नुहोस्
- Roman मा लेखे पनि नेपालीमा जवाफ दिनुहोस्
जवाफको ढाँचा:
🩺 के भइरहेको छ: [एक वाक्य]
✅ के गर्ने: [२-३ कदम]
⚠️ डाक्टर कहिले: [कहिले जाने]`
        },
        ...history,
        { role: "user", content: finalText }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "माफ गर्नुहोस्, जवाफ दिन सकिएन।";
}

// ─── Reusable Components ────────────────────────────────────────
function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.white, borderRadius: 16,
      border: `1px solid ${C.border}`,
      boxShadow: C.shadow, padding: 16,
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s, transform 0.15s",
      ...style
    }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = C.shadowMd)}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = C.shadow)}
    >{children}</div>
  );
}

function Badge({ children, color=C.teal, bg=C.tealLight }) {
  return (
    <span style={{
      background: bg, color, borderRadius: 20,
      padding:"3px 12px", fontSize:11, fontWeight:600,
      display:"inline-block", letterSpacing: 0.3
    }}>{children}</span>
  );
}

function PrimaryBtn({ children, onClick, disabled=false, color=C.teal, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.border : color,
      color: "#fff", border:"none", borderRadius:12,
      padding:"13px 20px", fontSize:15, fontWeight:700,
      cursor: disabled ? "not-allowed" : "pointer",
      width:"100%", fontFamily:"inherit",
      boxShadow: disabled ? "none" : `0 4px 12px ${color}44`,
      transition:"all 0.2s", opacity: disabled ? 0.6 : 1,
      ...style
    }}>{children}</button>
  );
}

function SeverityBar({ level }) {
  const cfg = {
    low:    { label:"सामान्य", color: C.green, bg: C.greenLight },
    medium: { label:"ध्यान दिनुहोस्", color: C.orange, bg: C.orangeLight },
    high:   { label:"तत्काल चाहिन्छ!", color: C.red, bg: C.redLight },
  };
  const { label, color, bg } = cfg[level] || cfg.low;
  return <Badge color={color} bg={bg}>{label}</Badge>;
}

// ─── Bottom Nav ────────────────────────────────────────────────
function NavBar({ tab, setTab }) {
  const items = [
    { id:"home",    icon:"🏠", label:"घर" },
    { id:"check",   icon:"🩺", label:"जाँच" },
    { id:"chat",    icon:"💬", label:"सहायक" },
    { id:"doctors", icon:"👨‍⚕️", label:"डाक्टर" },
    { id:"tips",    icon:"💡", label:"सुझाव" },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:480,
      background: C.white, borderTop:`1px solid ${C.border}`,
      display:"flex", zIndex:100,
      boxShadow:"0 -4px 12px rgba(0,0,0,0.06)"
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)} style={{
          flex:1, padding:"10px 4px 12px",
          background:"none", border:"none", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          borderTop: tab===it.id ? `2px solid ${C.teal}` : "2px solid transparent",
          transition:"all 0.15s"
        }}>
          <span style={{ fontSize:20 }}>{it.icon}</span>
          <span style={{
            fontSize:10, fontFamily:"inherit", fontWeight: tab===it.id ? 700 : 400,
            color: tab===it.id ? C.teal : C.textLight
          }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Screen: HOME ──────────────────────────────────────────────
function HomeScreen({ setTab, pickSymptom }) {
  return (
    <div style={{ padding:"20px 16px 100px", animation:"rise 0.4s ease" }}>

      {/* Header greeting */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:13, color:C.textLight, fontWeight:500, marginBottom:4 }}>
          नमस्ते 🙏
        </div>
        <div style={{ fontSize:26, fontWeight:800, color:C.text, lineHeight:1.2, marginBottom:6 }}>
          स्वास्थ्य सहायक
        </div>
        <div style={{ fontSize:13, color:C.textMid, lineHeight:1.6 }}>
          तपाईंको स्वास्थ्य समस्याको लागि<br/>
          <strong style={{ color:C.teal }}>निःशुल्क AI मार्गदर्शन</strong>
        </div>
      </div>

      {/* Main action cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <Card onClick={() => setTab("check")} style={{ textAlign:"center", padding:"20px 12px" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🩺</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>लक्षण जाँच</div>
          <div style={{ fontSize:11, color:C.textLight }}>के समस्या छ?</div>
        </Card>
        <Card onClick={() => setTab("chat")} style={{ textAlign:"center", padding:"20px 12px" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>AI सँग कुरा</div>
          <div style={{ fontSize:11, color:C.textLight }}>Nepali मा सोध्नुहोस्</div>
        </Card>
        <Card onClick={() => setTab("doctors")} style={{ textAlign:"center", padding:"20px 12px" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>👨‍⚕️</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>डाक्टर भेट्नुहोस्</div>
          <div style={{ fontSize:11, color:C.textLight }}>भिडियो परामर्श</div>
        </Card>
        <Card onClick={() => setTab("tips")} style={{ textAlign:"center", padding:"20px 12px" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>💡</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>स्वास्थ्य सुझाव</div>
          <div style={{ fontSize:11, color:C.textLight }}>राम्रो बानी</div>
        </Card>
      </div>

      {/* Emergency */}
      <div style={{
        background:"#FFF1F2", border:`1.5px solid #FECACA`,
        borderRadius:14, padding:"14px 16px", marginBottom:16,
        display:"flex", alignItems:"center", gap:14
      }}>
        <div style={{
          width:44, height:44, borderRadius:"50%",
          background:C.redLight, display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0
        }}>🚨</div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.red, marginBottom:2 }}>
            आपतकालीन अवस्थामा
          </div>
          <div style={{ fontSize:13, color:"#991B1B" }}>
            एम्बुलेन्स: <strong style={{ fontSize:16 }}>102</strong>
            &nbsp;&nbsp;प्रहरी: <strong>100</strong>
          </div>
        </div>
      </div>

      {/* Quick symptom buttons */}
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.textLight, letterSpacing:0.5, marginBottom:10, textTransform:"uppercase" }}>
          सामान्य समस्याहरू
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {SYMPTOMS.slice(0,6).map(s => (
            <button key={s.id} onClick={() => { pickSymptom(s); setTab("check"); }} style={{
              background: s.lightColor, color: s.color,
              border:`1.5px solid ${s.color}33`,
              borderRadius:24, padding:"8px 14px",
              fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"inherit", display:"flex", alignItems:"center", gap:6,
              transition:"all 0.15s"
            }}>
              <span>{s.icon}</span> {s.nepali}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: SYMPTOM CHECKER ───────────────────────────────────
function CheckScreen({ initialSymptom, setTab, setChatSeed }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialSymptom ? [initialSymptom] : []);
  const [result, setResult] = useState(initialSymptom ? [initialSymptom] : null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialSymptom) { setSelected([initialSymptom]); setResult([initialSymptom]); }
  }, [initialSymptom]);

  function handleQuery(val) {
    setQuery(val);
    setResult(null);
    const p = romanToNepali(val);
    setPreview(p || "");
  }

  function search() {
    const lower = query.toLowerCase();
    const found = SYMPTOMS.filter(s =>
      selected.includes(s) ||
      s.roman.some(r => lower.includes(r.split(" ")[0])) ||
      lower.includes(s.nepali.slice(0,2)) ||
      lower.includes(s.en.toLowerCase())
    );
    setResult(found.length ? found : []);
  }

  function toggleSymptom(s) {
    setSelected(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
    setResult(null);
  }

  const worstSev = result?.reduce((w,s) => {
    const o={low:0,medium:1,high:2};
    return o[s.severity]>o[w] ? s.severity : w;
  },"low");

  return (
    <div style={{ padding:"20px 16px 100px", animation:"rise 0.3s ease" }}>
      <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>लक्षण जाँच</div>
      <div style={{ fontSize:13, color:C.textLight, marginBottom:16 }}>
        Roman वा नेपाली मा लेख्नुहोस् — दुवै बुझ्छ
      </div>

      {/* Search box */}
      <Card style={{ marginBottom:14, padding:14 }}>
        <textarea
          value={query}
          onChange={e => handleQuery(e.target.value)}
          placeholder={"tauko dukhxa...\nटाउको दुख्छ...\nI have headache and fever..."}
          rows={3}
          style={{
            width:"100%", border:`1.5px solid ${C.border}`,
            borderRadius:10, padding:"10px 12px",
            fontSize:14, fontFamily:"inherit", color:C.text,
            background:C.bg, outline:"none", resize:"none",
            lineHeight:1.6, boxSizing:"border-box"
          }}
          onFocus={e => e.target.style.borderColor = C.teal}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        {preview && (
          <div style={{
            marginTop:8, padding:"7px 12px",
            background:C.tealLight, borderRadius:8,
            fontSize:13, color:C.tealDark, fontWeight:500
          }}>
            ✓ बुझियो: <strong>{preview}</strong>
          </div>
        )}
        <PrimaryBtn onClick={search} style={{ marginTop:10 }}>
          🔍 जाँच गर्नुहोस्
        </PrimaryBtn>
      </Card>

      {/* OR pick */}
      <div style={{ fontSize:12, fontWeight:600, color:C.textLight, letterSpacing:0.5, marginBottom:10, textTransform:"uppercase" }}>
        वा छान्नुहोस्
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
        {SYMPTOMS.map(s => {
          const on = selected.includes(s);
          return (
            <button key={s.id} onClick={() => toggleSymptom(s)} style={{
              background: on ? s.color : C.white,
              color: on ? "#fff" : C.text,
              border:`1.5px solid ${on ? s.color : C.border}`,
              borderRadius:24, padding:"8px 14px",
              fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"inherit", display:"flex", alignItems:"center", gap:6,
              transition:"all 0.15s",
              boxShadow: on ? `0 2px 8px ${s.color}44` : "none"
            }}>
              {s.icon} {s.nepali}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && !result && (
        <PrimaryBtn onClick={() => setResult(selected)} style={{ marginBottom:16 }}>
          ⚡ {selected.length} लक्षण जाँच गर्नुहोस्
        </PrimaryBtn>
      )}

      {/* Results */}
      {result !== null && (
        <div style={{ animation:"rise 0.3s ease" }}>
          {result.length === 0 ? (
            <Card>
              <div style={{ textAlign:"center", padding:16 }}>
                <div style={{ fontSize:40, marginBottom:8 }}>🤔</div>
                <div style={{ fontSize:14, color:C.text, fontWeight:600, marginBottom:4 }}>
                  लक्षण भेटिएन
                </div>
                <div style={{ fontSize:13, color:C.textLight }}>
                  AI सहायकसँग कुरा गर्नुहोस्
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Severity summary */}
              <div style={{
                background: worstSev==="high" ? C.redLight : worstSev==="medium" ? C.orangeLight : C.greenLight,
                border:`1.5px solid ${worstSev==="high" ? C.red : worstSev==="medium" ? C.orange : C.green}33`,
                borderRadius:14, padding:"12px 16px", marginBottom:14,
                display:"flex", alignItems:"center", gap:12
              }}>
                <span style={{ fontSize:28 }}>
                  {worstSev==="high" ? "🚨" : worstSev==="medium" ? "⚠️" : "✅"}
                </span>
                <div>
                  <SeverityBar level={worstSev} />
                  <div style={{ fontSize:12, color:C.textMid, marginTop:3 }}>
                    {result.length} वटा लक्षण विश्लेषण गरियो
                  </div>
                </div>
              </div>

              {result.map((s,i) => (
                <Card key={i} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{
                        width:44, height:44, borderRadius:12,
                        background:s.lightColor,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:22, flexShrink:0
                      }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{s.nepali}</div>
                        <div style={{ fontSize:11, color:C.textLight }}>{s.en}</div>
                      </div>
                    </div>
                    <SeverityBar level={s.severity} />
                  </div>

                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.textLight, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>
                      सम्भावित कारण
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {s.causes.map((c,j) => (
                        <Badge key={j} color={s.color} bg={s.lightColor}>{c}</Badge>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    background:C.tealLight, borderLeft:`3px solid ${C.teal}`,
                    borderRadius:"0 10px 10px 0", padding:"10px 14px",
                    fontSize:13, color:C.tealDark, lineHeight:1.7, marginBottom:8
                  }}>
                    {s.advice}
                  </div>

                  {s.severity !== "low" && (
                    <div style={{
                      background:s.severity==="high" ? C.redLight : C.orangeLight,
                      borderRadius:10, padding:"10px 14px",
                      fontSize:13, color:s.severity==="high" ? C.red : C.orange,
                      lineHeight:1.6, fontWeight:500
                    }}>
                      {s.warning}
                    </div>
                  )}
                </Card>
              ))}

              <PrimaryBtn
                color={C.purple}
                onClick={() => {
                  setChatSeed(`मलाई यी लक्षणहरू छन्: ${result.map(s=>s.nepali).join(", ")}। के गर्नु पर्छ?`);
                  setTab("chat");
                }}
              >
                💬 AI सहायकसँग थप जानकारी लिनुहोस् →
              </PrimaryBtn>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Screen: CHAT ──────────────────────────────────────────────
function ChatScreen({ seed, setSeed, online }) {
  const [msgs, setMsgs] = useState([{
    role:"assistant",
    text:"नमस्ते! म तपाईंको स्वास्थ्य सहायक हुँ। 🙏\n\nतपाईं Roman मा पनि टाइप गर्न सक्नुहुन्छ — जस्तै \"tauko dukhxa\" — म बुझ्छु।\n\n⚠️ म AI हुँ। वास्तविक डाक्टरको सट्टा होइन।"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState("");
  const bottom = useRef();

  useEffect(() => { if(seed){ setInput(seed); setSeed(null); } }, [seed, setSeed]);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  function handleInput(val) {
    setInput(val);
    setPreview(isRoman(val) ? (romanToNepali(val) || "") : "");
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput(""); setPreview("");
    setMsgs(p => [...p, { role:"user", text }]);
    setLoading(true);

    if (!online) {
      setTimeout(() => {
        const match = SYMPTOMS.find(s => s.roman.some(r => text.toLowerCase().includes(r.split(" ")[0])));
        const reply = match
          ? `🩺 के भइरहेको छ: ${match.nepali} जस्तो देखिन्छ।\n✅ के गर्ने: ${match.advice}\n⚠️ डाक्टर कहिले: ${match.warning}\n\n📶 इन्टरनेट भएपछि थप विस्तृत जवाफ पाउनुहुन्छ।`
          : "अफलाइन मोडमा सीमित जवाफ मात्र छ। नजिकको स्वास्थ्य चौकीमा जानुहोस्।";
        setMsgs(p => [...p, { role:"assistant", text:reply }]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const reply = await askAI(text, history);
      setHistory(h => [...h, {role:"user",content:text}, {role:"assistant",content:reply}].slice(-12));
      setMsgs(p => [...p, { role:"assistant", text:reply }]);
    } catch {
      setMsgs(p => [...p, { role:"assistant", text:"माफ गर्नुहोस्, अहिले जडान गर्न सकिएन। पुनः प्रयास गर्नुहोस्।" }]);
    }
    setLoading(false);
  }

  function renderMsg(text) {
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height:4 }} />;
      const isHeader = line.startsWith("🩺") || line.startsWith("✅") || line.startsWith("⚠️");
      return (
        <div key={i} style={{
          fontSize:13, lineHeight:1.7,
          color: isHeader ? C.teal : C.text,
          fontWeight: isHeader ? 600 : 400,
          marginTop: isHeader ? 6 : 0
        }}>{line}</div>
      );
    });
  }

  const quickQ = ["के गर्नु पर्छ?","कुन दवाई?","डाक्टर जानुपर्छ?","घरमा उपाय?","कति गम्भीर छ?"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 108px)" }}>
      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>
        {msgs.map((m,i) => (
          <div key={i} style={{
            display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start",
            marginBottom:14, gap:8, animation:"rise 0.2s ease"
          }}>
            {m.role==="assistant" && (
              <div style={{
                width:34, height:34, borderRadius:"50%", flexShrink:0,
                background:C.tealLight, border:`1.5px solid ${C.teal}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, marginTop:2
              }}>🏥</div>
            )}
            <div style={{
              maxWidth:"78%",
              background: m.role==="user" ? C.teal : C.white,
              border:`1px solid ${m.role==="user" ? "transparent" : C.border}`,
              borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding:"10px 14px",
              boxShadow: C.shadow
            }}>
              {m.role==="user"
                ? <div style={{ fontSize:13, color:"#fff", lineHeight:1.6 }}>{m.text}</div>
                : renderMsg(m.text)
              }
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <div style={{
              width:34, height:34, borderRadius:"50%",
              background:C.tealLight, border:`1.5px solid ${C.teal}33`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18
            }}>🏥</div>
            <div style={{
              background:C.white, border:`1px solid ${C.border}`,
              borderRadius:"18px 18px 18px 4px", padding:"12px 16px",
              display:"flex", gap:5, alignItems:"center", boxShadow:C.shadow
            }}>
              {[0,0.2,0.4].map((d,j)=>(
                <div key={j} style={{
                  width:7, height:7, borderRadius:"50%", background:C.teal,
                  animation:`bounce 0.8s ${d}s infinite`
                }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottom}/>
      </div>

      {/* Quick questions */}
      <div style={{ padding:"6px 12px", display:"flex", gap:6, overflowX:"auto", paddingBottom:8 }}>
        {quickQ.map((q,i)=>(
          <button key={i} onClick={()=>setInput(q)} style={{
            background:C.white, border:`1px solid ${C.border}`,
            borderRadius:20, padding:"6px 12px", whiteSpace:"nowrap",
            color:C.textMid, fontSize:11, fontFamily:"inherit",
            cursor:"pointer", flexShrink:0, boxShadow:C.shadow
          }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding:"8px 12px 14px", borderTop:`1px solid ${C.border}`,
        background:C.white
      }}>
        {preview && (
          <div style={{
            marginBottom:6, padding:"5px 12px",
            background:C.tealLight, borderRadius:8,
            fontSize:12, color:C.tealDark, fontWeight:500
          }}>✓ {preview}</div>
        )}
        {!online && (
          <div style={{
            marginBottom:6, padding:"5px 12px",
            background:C.orangeLight, borderRadius:8,
            fontSize:11, color:C.orange
          }}>⚠️ अफलाइन — सीमित जवाफ मात्र</div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <input
            value={input}
            onChange={e=>handleInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="tauko dukhxa... वा नेपाली मा..."
            style={{
              flex:1, border:`1.5px solid ${C.border}`, borderRadius:24,
              padding:"11px 16px", fontSize:14, fontFamily:"inherit",
              color:C.text, outline:"none", background:C.bg
            }}
            onFocus={e=>e.target.style.borderColor=C.teal}
            onBlur={e=>e.target.style.borderColor=C.border}
          />
          <button onClick={send} disabled={loading||!input.trim()} style={{
            width:46, height:46, borderRadius:"50%", flexShrink:0,
            background: input.trim()&&!loading ? C.teal : C.border,
            border:"none", cursor:"pointer", fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background 0.2s",
            boxShadow: input.trim() ? `0 4px 12px ${C.teal}44` : "none"
          }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: DOCTORS ──────────────────────────────────────────
function DoctorsScreen() {
  const [booked, setBooked] = useState(null);
  return (
    <div style={{ padding:"20px 16px 100px", animation:"rise 0.3s ease" }}>
      <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>डाक्टरहरू</div>
      <div style={{ fontSize:13, color:C.textLight, marginBottom:16 }}>भिडियो परामर्श — घरैबाट</div>

      {booked && (
        <div style={{
          background:C.greenLight, border:`1.5px solid ${C.green}44`,
          borderRadius:14, padding:"14px 16px", marginBottom:16,
          animation:"rise 0.3s ease"
        }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.green, marginBottom:4 }}>
            ✅ अपोइन्टमेन्ट बुक भयो!
          </div>
          <div style={{ fontSize:12, color:"#065F46" }}>{booked.name} · {booked.wait}</div>
          <button onClick={()=>setBooked(null)} style={{
            marginTop:8, background:"none", border:`1px solid ${C.green}44`,
            color:C.green, borderRadius:8, padding:"4px 12px",
            fontSize:11, cursor:"pointer", fontFamily:"inherit"
          }}>बन्द गर्नुहोस्</button>
        </div>
      )}

      {DOCTORS.map((d,i)=>(
        <Card key={i} style={{ marginBottom:12, opacity: d.avail ? 1 : 0.65 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
            <div style={{
              width:52, height:52, borderRadius:14, background:C.tealLight,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:28, flexShrink:0
            }}>{d.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{d.name}</div>
              <div style={{ fontSize:12, color:C.textLight, marginTop:2 }}>{d.spec}</div>
              <div style={{ display:"flex", gap:12, marginTop:5 }}>
                <span style={{ fontSize:12, color:C.textMid }}>⭐ {d.rating}</span>
                <span style={{ fontSize:12, color:C.textMid }}>{d.fee}</span>
              </div>
            </div>
            <Badge
              color={d.avail ? C.green : C.textLight}
              bg={d.avail ? C.greenLight : C.border}
            >
              {d.avail ? "उपलब्ध" : "व्यस्त"}
            </Badge>
          </div>

          <div style={{
            background:C.bg, borderRadius:10, padding:"8px 12px",
            fontSize:12, color:C.textMid, marginBottom:12
          }}>
            ⏱ {d.wait}
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <PrimaryBtn
              onClick={()=>d.avail&&setBooked(d)}
              disabled={!d.avail}
              style={{ flex:1, padding:"10px" }}
            >
              📅 बुक गर्नुहोस्
            </PrimaryBtn>
            <button style={{
              flex:1, background:C.purpleLight, color:C.purple,
              border:"none", borderRadius:12, padding:"10px",
              fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit"
            }}>
              👤 प्रोफाइल
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Screen: TIPS ──────────────────────────────────────────────
function TipsScreen() {
  const [saved, setSaved] = useState([]);
  return (
    <div style={{ padding:"20px 16px 100px", animation:"rise 0.3s ease" }}>
      <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>स्वास्थ्य सुझाव</div>
      <div style={{ fontSize:13, color:C.textLight, marginBottom:16 }}>अफलाइनमा पनि उपलब्ध</div>

      {TIPS.map((t,i)=>(
        <Card key={i} style={{ marginBottom:10, display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{
            width:46, height:46, borderRadius:12, background:C.tealLight,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, flexShrink:0
          }}>{t.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{t.title}</div>
            <div style={{ fontSize:13, color:C.textMid, lineHeight:1.6 }}>{t.body}</div>
          </div>
          <button onClick={()=>setSaved(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} style={{
            background:"none", border:"none", cursor:"pointer",
            fontSize:20, color: saved.includes(i) ? C.orange : C.textLight,
            flexShrink:0, padding:"4px"
          }}>
            {saved.includes(i) ? "★" : "☆"}
          </button>
        </Card>
      ))}

      {/* Emergency contacts */}
      <div style={{
        background:C.redLight, border:`1.5px solid ${C.red}33`,
        borderRadius:16, padding:"16px", marginTop:8
      }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.red, marginBottom:12 }}>
          🚨 आपतकालीन नम्बरहरू
        </div>
        {[
          ["एम्बुलेन्स","102"],
          ["प्रहरी","100"],
          ["अग्नि नियन्त्रण","101"],
          ["स्वास्थ्य हेल्पलाइन","1800-01-1190"]
        ].map(([l,n])=>(
          <div key={l} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"8px 0", borderBottom:`1px solid ${C.red}22`
          }}>
            <span style={{ fontSize:13, color:"#991B1B" }}>{l}</span>
            <span style={{ fontSize:18, fontWeight:800, color:C.red }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [online, setOnline] = useState(navigator.onLine);
  const [pickedSymptom, setPickedSymptom] = useState(null);
  const [chatSeed, setChatSeed] = useState(null);

  useEffect(()=>{
    window.addEventListener("online", ()=>setOnline(true));
    window.addEventListener("offline", ()=>setOnline(false));
  },[]);

  return (
    <div style={{
      background:C.bg, minHeight:"100vh",
      maxWidth:480, margin:"0 auto",
      fontFamily:"'Noto Sans Devanagari', 'Segoe UI', system-ui, sans-serif",
      position:"relative", color:C.text
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap');
        @keyframes rise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
        input::placeholder,textarea::placeholder { color:${C.textLight}; }
        button { outline:none; }
        div::-webkit-scrollbar { height:3px; }
        div::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
      `}</style>

      {/* Top header */}
      <div style={{
        background:C.white, borderBottom:`1px solid ${C.border}`,
        padding:"14px 16px", position:"sticky", top:0, zIndex:50,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        boxShadow:"0 1px 8px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:C.tealLight,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20
          }}>🏥</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, lineHeight:1 }}>
              स्वास्थ्य सहायक
            </div>
            <div style={{ fontSize:10, color:C.textLight, marginTop:1, letterSpacing:0.3 }}>
              Nepal AI Health Assistant
            </div>
          </div>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:5,
          background: online ? C.greenLight : C.orangeLight,
          padding:"4px 10px", borderRadius:20
        }}>
          <div style={{
            width:6, height:6, borderRadius:"50%",
            background: online ? C.green : C.orange,
            animation:"bounce 2s infinite"
          }}/>
          <span style={{ fontSize:10, fontWeight:600, color: online ? C.green : C.orange }}>
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Offline bar */}
      {!online && (
        <div style={{
          background:C.orangeLight, padding:"8px 16px",
          fontSize:12, color:C.orange, fontWeight:500,
          borderBottom:`1px solid ${C.orange}33`
        }}>
          ⚠️ इन्टरनेट छैन — मूल सुविधाहरू उपलब्ध छन्
        </div>
      )}

      {/* Screens */}
      <div style={{ height:`calc(100vh - ${online?57:85}px - 54px)`, overflowY:"auto" }}>
        {tab==="home"    && <HomeScreen setTab={setTab} pickSymptom={setPickedSymptom} />}
        {tab==="check"   && <CheckScreen initialSymptom={pickedSymptom} setTab={setTab} setChatSeed={setChatSeed} />}
        {tab==="chat"    && <ChatScreen seed={chatSeed} setSeed={setChatSeed} online={online} />}
        {tab==="doctors" && <DoctorsScreen />}
        {tab==="tips"    && <TipsScreen />}
      </div>

      <NavBar tab={tab} setTab={setTab} />
    </div>
  );
}