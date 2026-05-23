import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ──────────────────────────────────────────────────
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

const C = {
  bg:"#F0F4F8", white:"#FFFFFF",
  primary:"#1A6DB5", primaryLight:"#E8F2FF", primaryDark:"#0F4C8A",
  secondary:"#00A896", secondaryLight:"#E0F5F3",
  accent:"#F4845F", accentLight:"#FEF0EB",
  purple:"#6C63FF", purpleLight:"#EEECFF",
  success:"#1DB954", successLight:"#E6F9ED",
  warning:"#F5A623", warningLight:"#FFF8ED",
  danger:"#E53E3E", dangerLight:"#FFF5F5",
  text:"#1A202C", textMid:"#4A5568", textLight:"#A0AEC0",
  border:"#E2E8F0",
};

const WORD_MAP = {
  "tauko":"टाउको","dukhxa":"दुख्छ","dukhcha":"दुख्छ","dukcha":"दुख्छ",
  "jworo":"ज्वरो","jwaro":"ज्वरो","joro":"ज्वरो","fever":"ज्वरो",
  "pet":"पेट","stomach":"पेट","khansi":"खाँसी","khaasi":"खाँसी","cough":"खाँसी",
  "ulti":"उल्टी","vomiting":"उल्टी","chhati":"छाती","chest":"छाती",
  "chakkar":"चक्कर","dizzy":"चक्कर","sas":"सास","breathing":"सास",
  "ferna":"फेर्न","garho":"गाह्रो","garo":"गाह्रो",
  "aankha":"आँखा","eye":"आँखा","headache":"टाउको दुख्छ",
  "khana":"खाना","paani":"पानी","doctor":"डाक्टर","hospital":"अस्पताल",
  "cha":"छ","chha":"छ","chaina":"छैन","huncha":"हुन्छ",
  "bhayo":"भयो","mero":"मेरो","dherai":"धेरै","ramro":"राम्रो",
};

function romanToNepali(text) {
  if (!text || /[\u0900-\u097F]/.test(text)) return null;
  const words = text.toLowerCase().split(/\s+/);
  const converted = words.map(w => WORD_MAP[w] || w);
  const result = converted.join(" ");
  return result !== text.toLowerCase() ? result : null;
}

function isRoman(text) {
  if (!text || /[\u0900-\u097F]/.test(text)) return false;
  return Object.keys(WORD_MAP).some(k => text.toLowerCase().includes(k));
}

const SYMPTOMS = [
  { id:"headache", icon:"🤕", nepali:"टाउको दुख्छ", en:"Headache",
    roman:["tauko dukhxa","tauko dukhcha","headache","tauko"],
    causes:["माइग्रेन","तनाव","डिहाइड्रेसन","ज्वरो"],
    advice:"पानी पिउनुहोस् र अँध्यारो कोठामा आराम गर्नुहोस्। पारासिटामोल लिन सक्नुहुन्छ।",
    warning:"अचानक धेरै तीव्र दुखाई भयो भने तुरुन्त अस्पताल जानुहोस्।", severity:"low" },
  { id:"fever", icon:"🌡️", nepali:"ज्वरो आउँछ", en:"Fever",
    roman:["jworo","jwaro","joro","fever"],
    causes:["फ्लु","म्यालेरिया","टाइफाइड","डेंगी"],
    advice:"धेरै पानी र ORS पिउनुहोस्। हल्का कपडा लगाउनुहोस्।",
    warning:"३ दिनभन्दा बढी ज्वरो रहे डाक्टर देखाउनुहोस्।", severity:"medium" },
  { id:"stomach", icon:"🫃", nepali:"पेट दुख्छ", en:"Stomach Pain",
    roman:["pet dukhxa","pet dukhcha","stomach pain"],
    causes:["ग्यास्ट्रिक","अपच","फूड पोइजनिङ"],
    advice:"हल्का तातो पानी पिउनुहोस्। भारी खाना नखानुहोस्।",
    warning:"दायाँ तल्लो पेट कडा भयो भने तुरुन्त अस्पताल जानुहोस्।", severity:"medium" },
  { id:"breathing", icon:"🫁", nepali:"सास फेर्न गाह्रो", en:"Breathing Difficulty",
    roman:["sas ferna garho","breathing problem"],
    causes:["अस्थमा","निमोनिया","COVID-19"],
    advice:"सिधा बसेर ताजा हावा लिनुहोस्।",
    warning:"तुरुन्त 102 मा फोन गर्नुहोस्।", severity:"high" },
  { id:"cough", icon:"😮‍💨", nepali:"खाँसी लाग्छ", en:"Cough",
    roman:["khansi","khaasi","cough","khoki"],
    causes:["रुघाखोकी","ब्रोन्काइटिस","TB"],
    advice:"तातो पानीमा मह र अदुवा मिसाएर पिउनुहोस्।",
    warning:"२ हप्ताभन्दा बढी खोकी भए TB परीक्षण गराउनुहोस्।", severity:"low" },
  { id:"vomiting", icon:"🤢", nepali:"उल्टी हुन्छ", en:"Vomiting",
    roman:["ulti","banti","vomiting"],
    causes:["फूड पोइजनिङ","ग्यास्ट्रिक","माइग्रेन"],
    advice:"ORS वा नुन-चिनीको पानी बिस्तारै पिउनुहोस्।",
    warning:"रगत आयो भने तुरुन्त अस्पताल जानुहोस्।", severity:"medium" },
  { id:"chest", icon:"💔", nepali:"छाती दुख्छ", en:"Chest Pain",
    roman:["chhati dukhxa","chest pain","chati"],
    causes:["मुटुरोग","ग्यास्ट्रिक","निमोनिया"],
    advice:"बिरामीलाई सुताउनुहोस् र शान्त राख्नुहोस्।",
    warning:"तुरुन्त 102 मा फोन गर्नुहोस्।", severity:"high" },
  { id:"dizzy", icon:"😵", nepali:"चक्कर लाग्छ", en:"Dizziness",
    roman:["chakkar","dizzy","chakkar lagxa"],
    causes:["रक्तचाप","एनिमिया","डिहाइड्रेसन"],
    advice:"बसी आराम गर्नुहोस्। पानी पिउनुहोस्।",
    warning:"बेहोस भयो भने डाक्टर देखाउनुहोस्।", severity:"low" },
];

const DOCTORS = [
  { name:"डा. सुनिता श्रेष्ठ", initials:"स", spec:"सामान्य चिकित्सक", avail:true, rating:4.9, reviews:284, fee:"NPR ५००", wait:"अहिले", exp:"१२ वर्ष", color:C.primary },
  { name:"डा. रमेश थापा", initials:"र", spec:"बाल रोग विशेषज्ञ", avail:true, rating:4.8, reviews:196, fee:"NPR ७००", wait:"२० मि.", exp:"८ वर्ष", color:C.secondary },
  { name:"डा. प्रिया गुरुङ", initials:"प", spec:"स्त्री रोग विशेषज्ञ", avail:false, rating:4.9, reviews:341, fee:"NPR ८००", wait:"भोलि", exp:"१५ वर्ष", color:C.purple },
  { name:"डा. अमित पाण्डे", initials:"अ", spec:"हड्डी विशेषज्ञ", avail:true, rating:4.7, reviews:158, fee:"NPR ६००", wait:"१ घण्टा", exp:"१० वर्ष", color:C.accent },
];

async function askAI(text, history) {
  const converted = isRoman(text) ? romanToNepali(text) : null;
  const finalText = converted ? `${text} (नेपालीमा: ${converted})` : text;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${process.env.REACT_APP_OPENAI_KEY}` },
    body: JSON.stringify({
      model:"gpt-4o-mini", max_tokens:600,
      messages:[
        { role:"system", content:`तपाईं "स्वास्थ्य सहायक" हुनुहुन्छ। नेपालका ग्रामीण जनताको लागि सरल र मायालु स्वास्थ्य सहायक।
नियमहरू: सधैँ सरल नेपालीमा जवाफ दिनुहोस्। रोगको पक्का निदान नगर्नुहोस्। डाक्टर देखाउन सुझाव दिनुहोस्। आपतकालमा 102 भन्नुहोस्।
ढाँचा:
🩺 के भइरहेको छ: [एक वाक्य]
✅ के गर्ने: [२-३ कदम]
⚠️ कहिले डाक्टर: [स्पष्ट संकेत]` },
        ...history,
        { role:"user", content:finalText }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "माफ गर्नुहोस्, जवाफ दिन सकिएन।";
}

// ─── Shared UI Components ──────────────────────────────────────
function Avatar({ initials, color, size=44 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:size*0.35, fontWeight:700, flexShrink:0 }}>{initials}</div>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}>
      <span style={{ color:C.warning, fontSize:12 }}>★</span>
      <span style={{ fontSize:12, color:C.textMid, fontWeight:600 }}>{rating}</span>
    </span>
  );
}

function SeverityTag({ level }) {
  const map = { low:{ label:"सामान्य", bg:C.successLight, color:C.success }, medium:{ label:"ध्यान दिनुहोस्", bg:C.warningLight, color:C.warning }, high:{ label:"तत्काल!", bg:C.dangerLight, color:C.danger } };
  const { label, bg, color } = map[level];
  return <span style={{ background:bg, color, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, display:"inline-block" }}>{label}</span>;
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
      <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{title}</span>
      {action && <button onClick={onAction} style={{ background:"none", border:"none", color:C.primary, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{action} →</button>}
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id:"home", emoji:"🏠", label:"घर" },
    { id:"check", emoji:"🩺", label:"जाँच" },
    { id:"chat", emoji:"💬", label:"सहायक" },
    { id:"doctors", emoji:"👨‍⚕️", label:"डाक्टर" },
    { id:"profile", emoji:"👤", label:"प्रोफाइल" },
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, boxShadow:"0 -2px 10px rgba(0,0,0,0.06)" }}>
      {items.map(it => {
        const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{ flex:1, padding:"8px 4px 10px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderTop:`2px solid ${active?C.primary:"transparent"}`, transition:"border-color 0.2s" }}>
            <span style={{ fontSize:20 }}>{it.emoji}</span>
            <span style={{ fontSize:9, fontWeight:active?700:400, color:active?C.primary:C.textLight, fontFamily:"inherit" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Voice Input ───────────────────────────────────────────────
function VoiceInput({ input, setInput, onSend, loading }) {
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recRef = useRef(null);

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceError("Voice support छैन। Chrome प्रयोग गर्नुहोस्।"); setTimeout(()=>setVoiceError(""),3000); return; }
    setVoiceError("");
    const r = new SR();
    r.lang = "ne-NP"; r.interimResults = false; r.maxAlternatives = 1;
    recRef.current = r;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e) => {
      setListening(false);
      if (e.error === "language-not-supported") {
        const r2 = new SR(); r2.lang = "en-US"; r2.interimResults = false;
        r2.onstart=()=>setListening(true); r2.onend=()=>setListening(false); r2.onerror=()=>setListening(false);
        r2.onresult=(e2)=>setInput(e2.results[0][0].transcript);
        recRef.current=r2; r2.start();
      } else { setVoiceError("माइक्रोफोन अनुमति दिनुहोस्।"); setTimeout(()=>setVoiceError(""),3000); }
    };
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.start();
  }

  function stopVoice() { recRef.current?.stop(); setListening(false); }

  return (
    <div>
      {voiceError && <div style={{ marginBottom:6, padding:"5px 12px", background:C.dangerLight, borderRadius:8, fontSize:12, color:C.danger }}>{voiceError}</div>}
      {listening && <div style={{ marginBottom:6, padding:"8px 14px", background:C.primaryLight, borderRadius:10, fontSize:12, color:C.primary, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}><span style={{ animation:"voicePulse 0.8s infinite", display:"inline-block" }}>🎤</span>सुनिरहेको छु... बोल्नुहोस्</div>}
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSend()}
          placeholder={listening?"सुनिरहेको छु...":"tauko dukhxa... वा बोल्नुहोस् 🎤"}
          style={{ flex:1, border:`1.5px solid ${listening?C.primary:C.border}`, borderRadius:24, padding:"11px 16px", fontSize:13, fontFamily:"inherit", color:C.text, outline:"none", background:C.bg }}
          onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>{if(!listening)e.target.style.borderColor=C.border;}}
        />
        <button onClick={listening?stopVoice:startVoice} style={{ width:46, height:46, borderRadius:"50%", flexShrink:0, background:listening?C.dangerLight:C.primaryLight, border:`2px solid ${listening?C.danger:C.primary}`, cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", animation:listening?"voicePulse 1s infinite":"none" }}>
          {listening?"⏹":"🎤"}
        </button>
        <button onClick={onSend} disabled={loading||!input.trim()} style={{ width:46, height:46, borderRadius:"50%", flexShrink:0, background:input.trim()&&!loading?C.primary:C.border, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>➤</button>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const districts = ["काठमाडौं","ललितपुर","भक्तपुर","पोखरा","बुटवल","नेपालगञ्ज","धनगढी","विराटनगर","जनकपुर","हेटौंडा","दाङ","सुर्खेत","अन्य"];

  async function handleLogin() {
    if (!name.trim() || !phone.trim()) { setError("नाम र फोन नम्बर अनिवार्य छ।"); return; }
    if (phone.length < 10) { setError("सही फोन नम्बर हाल्नुहोस्।"); return; }
    setLoading(true); setError("");
    const userId = "user_" + phone.replace(/\D/g,"");
    try {
      const { data: existing } = await supabase.from("health_profiles").select("*").eq("user_id", userId).single();
      if (existing) {
        localStorage.setItem("ss_user", JSON.stringify(existing));
        onLogin(existing);
      } else {
        const profile = { user_id:userId, name:name.trim(), age, district };
        const { data, error:err } = await supabase.from("health_profiles").insert([profile]).select().single();
        if (err) throw err;
        localStorage.setItem("ss_user", JSON.stringify(data));
        onLogin(data);
      }
    } catch(e) {
      setError("सम्पर्क गर्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${C.primaryDark} 0%, ${C.primary} 50%, #2196A6 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ marginBottom:24, textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>🏥</div>
        <div style={{ fontSize:28, fontWeight:800, color:"#fff", marginBottom:6 }}>स्वास्थ्य सहायक</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)" }}>Nepal AI Health Assistant</div>
      </div>

      <div style={{ background:C.white, borderRadius:20, padding:24, width:"100%", maxWidth:400, boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:4 }}>सुरु गर्नुहोस्</div>
        <div style={{ fontSize:13, color:C.textLight, marginBottom:20 }}>तपाईंको जानकारी भर्नुहोस्</div>

        {error && <div style={{ background:C.dangerLight, border:`1px solid #FEB2B2`, borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:C.danger }}>{error}</div>}

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.textMid, marginBottom:5 }}>पूरा नाम *</div>
          <input value={name} onChange={e=>setName(e.target.value)}
            placeholder="तपाईंको नाम"
            style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:14, fontFamily:"inherit", color:C.text, outline:"none", boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.textMid, marginBottom:5 }}>मोबाइल नम्बर *</div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel"
            placeholder="98XXXXXXXX"
            style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:14, fontFamily:"inherit", color:C.text, outline:"none", boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:C.textMid, marginBottom:5 }}>उमेर</div>
            <input value={age} onChange={e=>setAge(e.target.value)} placeholder="वर्ष"
              style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:14, fontFamily:"inherit", color:C.text, outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}
            />
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:C.textMid, marginBottom:5 }}>जिल्ला</div>
            <select value={district} onChange={e=>setDistrict(e.target.value)}
              style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:13, fontFamily:"inherit", color:district?C.text:C.textLight, outline:"none", boxSizing:"border-box", background:C.white }}>
              <option value="">छान्नुहोस्</option>
              {districts.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", background:C.primary, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:`0 4px 15px ${C.primary}44`, opacity:loading?0.7:1 }}>
          {loading ? "लोड हुँदैछ..." : "सुरु गर्नुहोस् →"}
        </button>

        <div style={{ marginTop:12, fontSize:11, color:C.textLight, textAlign:"center", lineHeight:1.6 }}>
          तपाईंको जानकारी सुरक्षित छ। कहिल्यै सार्वजनिक गरिँदैन।
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ────────────────────────────────────────────
function ProfileScreen({ user, onLogout }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const { data } = await supabase
        .from("health_chats")
        .select("*")
        .eq("user_id", user.user_id)
        .eq("role", "user")
        .order("created_at", { ascending:false })
        .limit(20);
      setHistory(data || []);
      setLoading(false);
    }
    loadHistory();
  }, [user.user_id]);

  function handleLogout() {
    localStorage.removeItem("ss_user");
    onLogout();
  }

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      {/* Profile card */}
      <div style={{ background:`linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, borderRadius:20, padding:"20px", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>👤</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>{user.name}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{user.district || "नेपाल"} {user.age ? `· ${user.age} वर्ष` : ""}</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[
            { label:"कुराकानी", value:history.length },
            { label:"जिल्ला", value:user.district||"—" },
            { label:"उमेर", value:user.age||"—" },
          ].map(({label,value})=>(
            <div key={label} style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{value}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat history */}
      <SectionHeader title="पछिल्ला कुराकानीहरू" />
      {loading ? (
        <div style={{ textAlign:"center", padding:20, color:C.textLight, fontSize:13 }}>लोड हुँदैछ...</div>
      ) : history.length === 0 ? (
        <div style={{ background:C.white, borderRadius:14, padding:24, textAlign:"center", border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>अझै कुराकानी छैन</div>
          <div style={{ fontSize:12, color:C.textLight }}>AI सहायकसँग कुरा गर्नुहोस्</div>
        </div>
      ) : (
        history.map((h,i) => (
          <div key={i} style={{ background:C.white, borderRadius:12, padding:"12px 14px", marginBottom:8, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize:13, color:C.text, marginBottom:4, lineHeight:1.5 }}>
              {h.message.length > 80 ? h.message.slice(0,80)+"..." : h.message}
            </div>
            <div style={{ fontSize:10, color:C.textLight }}>
              {new Date(h.created_at).toLocaleDateString("ne-NP", { year:"numeric", month:"short", day:"numeric" })}
            </div>
          </div>
        ))
      )}

      {/* Logout */}
      <div style={{ marginTop:20, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
        <button onClick={handleLogout} style={{ width:"100%", background:C.dangerLight, color:C.danger, border:`1px solid ${C.danger}33`, borderRadius:12, padding:"12px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          साइन आउट गर्नुहोस्
        </button>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ───────────────────────────────────────────────
function HomeScreen({ setTab, pickSymptom, user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "शुभ प्रभात" : hour < 17 ? "नमस्ते" : "शुभ सन्ध्या";
  return (
    <div style={{ paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 60%, #2196A6 100%)`, padding:"24px 20px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:4, fontWeight:500 }}>{greeting}, {user?.name?.split(" ")[0] || "नमस्ते"} 🙏</div>
          <div style={{ fontSize:24, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:6 }}>तपाईंलाई आज<br/>कस्तो छ?</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:20 }}>Roman मा टाइप गर्नुहोस् — हामी बुझ्छौँ</div>
          <button onClick={() => setTab("check")} style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, width:"100%", cursor:"pointer", textAlign:"left" }}>
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:16 }}>🔍</span>
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:14, fontFamily:"inherit" }}>tauko dukhxa, jworo... खोज्नुहोस्</span>
          </button>
        </div>
      </div>

      <div style={{ padding:"0 16px" }}>
        <div style={{ background:C.dangerLight, border:`1px solid #FEB2B2`, borderRadius:12, padding:"10px 14px", margin:"14px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:C.danger, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🚨</div>
            <div><div style={{ fontSize:12, fontWeight:700, color:C.danger }}>आपतकालीन</div><div style={{ fontSize:11, color:"#C53030" }}>एम्बुलेन्स · प्रहरी</div></div>
          </div>
          <a href="tel:102" style={{ background:C.danger, color:"#fff", borderRadius:8, padding:"7px 16px", fontSize:15, fontWeight:800, textDecoration:"none" }}>📞 102</a>
        </div>

        <SectionHeader title="के गर्नु छ?" />
        <div onClick={() => setTab("chat")} style={{ background:`linear-gradient(135deg, ${C.secondary} 0%, #007A6E 100%)`, borderRadius:16, padding:"18px 20px", marginBottom:10, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:`0 4px 15px ${C.secondary}44` }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", fontWeight:600, letterSpacing:1, marginBottom:4 }}>AI HEALTH ASSISTANT</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:3 }}>AI सँग कुरा गर्नुहोस्</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>Nepali · Roman · Voice 🎤</div>
          </div>
          <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>💬</div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {[
            { icon:"🩺", label:"लक्षण जाँच", sub:"के समस्या छ?", tab:"check", bg:C.primaryLight, color:C.primary },
            { icon:"👨‍⚕️", label:"डाक्टर भेट्नुहोस्", sub:"भिडियो परामर्श", tab:"doctors", bg:C.purpleLight, color:C.purple },
          ].map(item => (
            <div key={item.tab} onClick={() => setTab(item.tab)} style={{ background:item.bg, borderRadius:14, padding:"16px 14px", cursor:"pointer", border:`1px solid ${item.color}22` }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:11, color:C.textLight }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <SectionHeader title="सामान्य समस्याहरू" action="सबै हेर्नुहोस्" onAction={() => setTab("check")} />
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:20 }}>
          {SYMPTOMS.map(s => (
            <button key={s.id} onClick={() => { pickSymptom(s); setTab("check"); }} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 12px", flexShrink:0, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth:76, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
              <span style={{ fontSize:10, color:C.textMid, fontWeight:500, textAlign:"center", lineHeight:1.3 }}>{s.en}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="उपलब्ध डाक्टरहरू" action="सबै हेर्नुहोस्" onAction={() => setTab("doctors")} />
        {DOCTORS.filter(d=>d.avail).slice(0,2).map((d,i) => (
          <div key={i} onClick={() => setTab("doctors")} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px", marginBottom:10, cursor:"pointer", display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <Avatar initials={d.initials} color={d.color} size={48} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:2 }}>{d.name}</div>
              <div style={{ fontSize:11, color:C.textLight, marginBottom:4 }}>{d.spec}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}><StarRating rating={d.rating} /><span style={{ fontSize:11, color:C.textLight }}>({d.reviews})</span></div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ background:C.successLight, color:C.success, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, marginBottom:4 }}>{d.wait}</div>
              <div style={{ fontSize:12, color:C.textMid, fontWeight:600 }}>{d.fee}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHECK SCREEN ──────────────────────────────────────────────
function CheckScreen({ initialSymptom, setTab, setChatSeed }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialSymptom ? [initialSymptom] : []);
  const [result, setResult] = useState(initialSymptom ? [initialSymptom] : null);
  const [preview, setPreview] = useState("");

  useEffect(() => { if (initialSymptom) { setSelected([initialSymptom]); setResult([initialSymptom]); } }, [initialSymptom]);

  function handleQuery(val) { setQuery(val); setResult(null); setPreview(romanToNepali(val)||""); }

  function search() {
    const lower = query.toLowerCase();
    const found = SYMPTOMS.filter(s => selected.includes(s) || s.roman.some(r=>lower.includes(r.split(" ")[0])) || lower.includes(s.nepali.slice(0,2)) || lower.includes(s.en.toLowerCase()));
    setResult(found.length ? found : []);
  }

  const worstSev = result?.reduce((w,s)=>{ const o={low:0,medium:1,high:2}; return o[s.severity]>o[w]?s.severity:w; },"low");

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>लक्षण जाँच</div>
      <div style={{ fontSize:13, color:C.textLight, marginBottom:20 }}>Roman वा नेपाली — दुवै बुझ्छ</div>
      <div style={{ background:C.white, borderRadius:14, padding:16, border:`1px solid ${C.border}`, marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 12px", background:C.bg, marginBottom:10 }}>
          <span style={{ color:C.textLight, marginTop:3, fontSize:16 }}>🔍</span>
          <textarea value={query} onChange={e=>handleQuery(e.target.value)} placeholder={"tauko dukhxa...\nटाउको दुख्छ..."} rows={2}
            style={{ flex:1, border:"none", background:"none", outline:"none", fontSize:14, fontFamily:"inherit", color:C.text, resize:"none", lineHeight:1.6 }} />
        </div>
        {preview && <div style={{ padding:"7px 12px", background:C.primaryLight, borderRadius:8, fontSize:13, color:C.primary, fontWeight:600, marginBottom:10 }}>✓ बुझियो: {preview}</div>}
        <button onClick={search} style={{ width:"100%", background:C.primary, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>जाँच गर्नुहोस्</button>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.textLight, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>वा छान्नुहोस्</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {SYMPTOMS.map(s => {
            const on = selected.includes(s);
            return <button key={s.id} onClick={() => { setSelected(p=>on?p.filter(x=>x!==s):[...p,s]); setResult(null); }} style={{ background:on?C.primary:C.white, color:on?"#fff":C.textMid, border:`1.5px solid ${on?C.primary:C.border}`, borderRadius:24, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>{s.icon} {s.nepali}</button>;
          })}
        </div>
      </div>
      {selected.length > 0 && !result && <button onClick={() => setResult(selected)} style={{ width:"100%", background:C.primary, color:"#fff", border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginBottom:16 }}>{selected.length} वटा लक्षण जाँच गर्नुहोस्</button>}
      {result !== null && (
        <div>
          {result.length === 0 ? (
            <div style={{ background:C.white, borderRadius:14, padding:24, textAlign:"center", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:40, marginBottom:8 }}>🤔</div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>लक्षण भेटिएन</div>
              <div style={{ fontSize:13, color:C.textLight }}>AI सहायकसँग कुरा गर्नुहोस्</div>
            </div>
          ) : (
            <>
              <div style={{ background:worstSev==="high"?C.dangerLight:worstSev==="medium"?C.warningLight:C.successLight, borderRadius:12, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:24 }}>{worstSev==="high"?"🚨":worstSev==="medium"?"⚠️":"✅"}</span>
                <div><SeverityTag level={worstSev} /><div style={{ fontSize:11, color:C.textMid, marginTop:3 }}>{result.length} वटा लक्षण विश्लेषण गरियो</div></div>
              </div>
              {result.map((s,i) => (
                <div key={i} style={{ background:C.white, borderRadius:14, padding:16, marginBottom:12, border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
                      <div><div style={{ fontSize:15, fontWeight:700, color:C.text }}>{s.nepali}</div><div style={{ fontSize:11, color:C.textLight }}>{s.en}</div></div>
                    </div>
                    <SeverityTag level={s.severity} />
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.textLight, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>सम्भावित कारण</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{s.causes.map((c,j)=><span key={j} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"3px 10px", fontSize:11, color:C.textMid }}>{c}</span>)}</div>
                  </div>
                  <div style={{ background:C.primaryLight, borderLeft:`3px solid ${C.primary}`, borderRadius:"0 10px 10px 0", padding:"10px 14px", fontSize:13, color:C.primaryDark, lineHeight:1.7, marginBottom:8 }}>{s.advice}</div>
                  {s.severity !== "low" && <div style={{ background:s.severity==="high"?C.dangerLight:C.warningLight, borderRadius:10, padding:"10px 14px", fontSize:13, color:s.severity==="high"?C.danger:C.warning, fontWeight:500 }}>⚠️ {s.warning}</div>}
                </div>
              ))}
              <button onClick={() => { setChatSeed(`मलाई यी लक्षणहरू छन्: ${result.map(s=>s.nepali).join(", ")}। के गर्नु पर्छ?`); setTab("chat"); }} style={{ width:"100%", background:C.white, color:C.primary, border:`1.5px solid ${C.primary}`, borderRadius:12, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                💬 AI सहायकसँग थप जानकारी लिनुहोस्
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CHAT SCREEN ───────────────────────────────────────────────
function ChatScreen({ seed, setSeed, online, user }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"नमस्ते! म तपाईंको स्वास्थ्य सहायक हुँ। 🙏\n\nRoman मा टाइप गर्नुहोस् वा 🎤 थिचेर बोल्नुहोस्।\n\n⚠️ म AI हुँ। वास्तविक डाक्टरको सट्टा होइन।" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState("");
  const bottom = useRef();

  useEffect(() => { if(seed){ setInput(seed); setSeed(null); } }, [seed, setSeed]);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  function handleInput(val) { setInput(val); setPreview(isRoman(val)?(romanToNepali(val)||""):""); }

  async function saveChat(message, role) {
    if (!user?.user_id) return;
    await supabase.from("health_chats").insert([{ user_id:user.user_id, message, role }]);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput(""); setPreview("");
    setMsgs(p => [...p, { role:"user", text }]);
    await saveChat(text, "user");
    setLoading(true);
    if (!online) {
      setTimeout(() => {
        const match = SYMPTOMS.find(s => s.roman.some(r => text.toLowerCase().includes(r.split(" ")[0])));
        const reply = match ? `🩺 के भइरहेको छ: ${match.nepali}\n✅ के गर्ने: ${match.advice}\n⚠️ कहिले डाक्टर: ${match.warning}` : "अफलाइन मोडमा सीमित जवाफ मात्र।";
        setMsgs(p => [...p, { role:"assistant", text:reply }]);
        setLoading(false);
      }, 600);
      return;
    }
    try {
      const reply = await askAI(text, history);
      setHistory(h => [...h, {role:"user",content:text}, {role:"assistant",content:reply}].slice(-12));
      setMsgs(p => [...p, { role:"assistant", text:reply }]);
      await saveChat(reply, "assistant");
    } catch { setMsgs(p => [...p, { role:"assistant", text:"माफ गर्नुहोस्, जडान भएन।" }]); }
    setLoading(false);
  }

  function renderMsg(text) {
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height:4 }}/>;
      const isHeader = /^[🩺✅⚠️]/.test(line);
      return <div key={i} style={{ fontSize:13, lineHeight:1.75, color:isHeader?C.primaryDark:C.text, fontWeight:isHeader?600:400, marginTop:isHeader?6:0 }}>{line}</div>;
    });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 108px)" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:14, gap:8 }}>
            {m.role==="assistant" && <Avatar initials="AI" color={C.primary} size={32} />}
            <div style={{ maxWidth:"78%", background:m.role==="user"?C.primary:C.white, border:m.role==="user"?"none":`1px solid ${C.border}`, borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
              {m.role==="user" ? <div style={{ fontSize:13, color:"#fff", lineHeight:1.6 }}>{m.text}</div> : renderMsg(m.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <Avatar initials="AI" color={C.primary} size={32} />
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"18px 18px 18px 4px", padding:"14px 16px", display:"flex", gap:5, alignItems:"center" }}>
              {[0,0.15,0.3].map((d,j)=><div key={j} style={{ width:7, height:7, borderRadius:"50%", background:C.primary, opacity:0.7, animation:`typingDot 1s ${d}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={bottom}/>
      </div>
      <div style={{ padding:"6px 12px 8px", display:"flex", gap:6, overflowX:"auto" }}>
        {["के गर्नु पर्छ?","कुन दवाई?","डाक्टर जानुपर्छ?","घरमा उपाय?"].map((q,i)=>(
          <button key={i} onClick={()=>setInput(q)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", whiteSpace:"nowrap", color:C.textMid, fontSize:11, fontFamily:"inherit", cursor:"pointer", flexShrink:0 }}>{q}</button>
        ))}
      </div>
      <div style={{ padding:"8px 12px 16px", borderTop:`1px solid ${C.border}`, background:C.white }}>
        {preview && <div style={{ marginBottom:6, padding:"5px 12px", background:C.primaryLight, borderRadius:8, fontSize:12, color:C.primary, fontWeight:600 }}>✓ {preview}</div>}
        <VoiceInput input={input} setInput={handleInput} onSend={send} loading={loading} />
      </div>
    </div>
  );
}

// ─── DOCTORS SCREEN ────────────────────────────────────────────
function DoctorsScreen() {
  const [booked, setBooked] = useState(null);
  const [filter, setFilter] = useState("all");
  const filtered = filter==="available" ? DOCTORS.filter(d=>d.avail) : DOCTORS;
  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>डाक्टरहरू</div>
      <div style={{ fontSize:13, color:C.textLight, marginBottom:16 }}>भिडियो परामर्श — घरैबाट</div>
      {booked && (
        <div style={{ background:C.successLight, border:`1px solid #9AE6B4`, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.success, marginBottom:2 }}>✅ अपोइन्टमेन्ट बुक भयो!</div>
          <div style={{ fontSize:12, color:"#276749" }}>{booked.name} · {booked.wait}</div>
          <button onClick={()=>setBooked(null)} style={{ marginTop:8, background:"none", border:`1px solid ${C.success}44`, color:C.success, borderRadius:8, padding:"4px 12px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>बन्द गर्नुहोस्</button>
        </div>
      )}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["all","सबै"],["available","उपलब्ध"]].map(([val,label])=>(
          <button key={val} onClick={()=>setFilter(val)} style={{ background:filter===val?C.primary:C.white, color:filter===val?"#fff":C.textMid, border:`1px solid ${filter===val?C.primary:C.border}`, borderRadius:20, padding:"7px 18px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{label}</button>
        ))}
      </div>
      {filtered.map((d,i) => (
        <div key={i} style={{ background:C.white, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${C.border}`, opacity:d.avail?1:0.65, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
            <Avatar initials={d.initials} color={d.color} size={52} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:2 }}>{d.name}</div>
              <div style={{ fontSize:12, color:C.textLight, marginBottom:6 }}>{d.spec} · {d.exp} अनुभव</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><StarRating rating={d.rating} /><span style={{ fontSize:11, color:C.textLight }}>({d.reviews})</span></div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ background:d.avail?C.successLight:C.bg, color:d.avail?C.success:C.textLight, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, marginBottom:6 }}>{d.avail?"उपलब्ध":"व्यस्त"}</div>
              <div style={{ fontSize:11, color:C.textLight }}>⏱ {d.wait}</div>
            </div>
          </div>
          <div style={{ background:C.bg, borderRadius:10, padding:"8px 12px", display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:12, color:C.textMid }}>परामर्श शुल्क</span>
            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{d.fee}</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>d.avail&&setBooked(d)} disabled={!d.avail} style={{ flex:2, background:d.avail?C.primary:C.border, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:700, cursor:d.avail?"pointer":"not-allowed", fontFamily:"inherit" }}>📅 अपोइन्टमेन्ट बुक गर्नुहोस्</button>
            <button style={{ flex:1, background:C.primaryLight, color:C.primary, border:"none", borderRadius:10, padding:"11px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>प्रोफाइल</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [online, setOnline] = useState(navigator.onLine);
  const [pickedSymptom, setPickedSymptom] = useState(null);
  const [chatSeed, setChatSeed] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("ss_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch(e) {} }
    setAuthLoading(false);
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
  }, []);

  if (authLoading) {
    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🏥</div>
          <div style={{ fontSize:16, color:"#fff", fontWeight:700 }}>स्वास्थ्य सहायक</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:6 }}>लोड हुँदैछ...</div>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"'Noto Sans Devanagari', 'Segoe UI', system-ui, sans-serif", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap');
        @keyframes typingDot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes voicePulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.8} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:0; height:0; }
        input::placeholder,textarea::placeholder { color:${C.textLight}; }
        button { outline:none; -webkit-tap-highlight-color:transparent; }
        a { -webkit-tap-highlight-color:transparent; }
        select { appearance:none; }
      `}</style>

      <div style={{ background:C.white, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏥</div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, lineHeight:1 }}>स्वास्थ्य सहायक</div>
            <div style={{ fontSize:9, color:C.textLight, letterSpacing:0.3, marginTop:1 }}>Nepal AI Health Assistant</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:online?C.successLight:C.warningLight, padding:"4px 10px", borderRadius:20 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:online?C.success:C.warning }}/>
            <span style={{ fontSize:10, fontWeight:700, color:online?C.success:C.warning }}>{online?"Online":"Offline"}</span>
          </div>
        </div>
      </div>

      {!online && <div style={{ background:C.warningLight, padding:"7px 16px", fontSize:12, color:C.warning, fontWeight:500, borderBottom:`1px solid #FBD38D` }}>⚠️ इन्टरनेट छैन — मूल सुविधाहरू उपलब्ध छन्</div>}

      <div style={{ height:`calc(100vh - ${online?55:80}px - 54px)`, overflowY:"auto" }}>
        {tab==="home"    && <HomeScreen setTab={setTab} pickSymptom={setPickedSymptom} user={user} />}
        {tab==="check"   && <CheckScreen initialSymptom={pickedSymptom} setTab={setTab} setChatSeed={setChatSeed} />}
        {tab==="chat"    && <ChatScreen seed={chatSeed} setSeed={setChatSeed} online={online} user={user} />}
        {tab==="doctors" && <DoctorsScreen />}
        {tab==="profile" && <ProfileScreen user={user} onLogout={() => setUser(null)} />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}