import { useState, useEffect } from "react";
import { UserRound, Languages, LogOut } from "lucide-react";

import { supabase } from "../config/supabase";
import { C } from "../constants/colors";
import Sh from "../components/SectionHeader";
import EmptyRecord from "../components/EmptyRecord";
import RecordCard from "../components/RecordCard";

export default function ProfileScreen({ user, onLogout, lang, onLangChange }) {
  const [history, setHistory] = useState([]);
const [labRequests, setLabRequests] = useState([]);
const [medicineRequests, setMedicineRequests] = useState([]);
const [activeRecordTab, setActiveRecordTab] = useState("chats");
const [loading, setLoading] = useState(true);
const [recordsError, setRecordsError] = useState("");

 useEffect(() => {
  async function loadRecords() {
    setLoading(true);
    setRecordsError("");

    try {
      const {
        data: { user: authUser },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !authUser?.id) {
        throw new Error(
          lang === "en"
            ? "Login session expired. Please log in again."
            : "Login session सकियो। कृपया फेरि login गर्नुहोस्।"
        );
      }

      const [chatResult, labResult, medicineResult] = await Promise.all([
        supabase
          .from("health_chats")
          .select("*")
          .eq("user_id", user.user_id)
          .eq("role", "user")
          .order("created_at", { ascending: false })
          .limit(20),

        supabase
          .from("lab_requests")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(20),

        supabase
          .from("medicine_requests")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(20)
      ]);

      if (chatResult.error) throw chatResult.error;
      if (labResult.error) throw labResult.error;
      if (medicineResult.error) throw medicineResult.error;

      setHistory(chatResult.data || []);
      setLabRequests(labResult.data || []);
      setMedicineRequests(medicineResult.data || []);
    } catch (err) {
      setRecordsError(
        err?.message ||
          (lang === "en"
            ? "Could not load health records."
            : "स्वास्थ्य रेकर्ड लोड गर्न सकिएन।")
      );
    }

    setLoading(false);
  }

  loadRecords();
}, [user.user_id, lang]);

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
       <Sh title={lang === "en" ? "Health Records" : "स्वास्थ्य रेकर्ड"} />

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    marginBottom: 14
  }}
>
  {[
    ["chats", lang === "en" ? "Chats" : "च्याट", history.length],
    ["labs", lang === "en" ? "Labs" : "ल्याब", labRequests.length],
    ["medicine", lang === "en" ? "Medicine" : "औषधि", medicineRequests.length]
  ].map(([id, label, count]) => (
    <button
      key={id}
      onClick={() => setActiveRecordTab(id)}
      style={{
        background: activeRecordTab === id ? C.primary : C.white,
        color: activeRecordTab === id ? "#fff" : C.textMid,
        border: "1px solid " + (activeRecordTab === id ? C.primary : C.border),
        borderRadius: 12,
        padding: "10px 6px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12,
        fontWeight: 800
      }}
    >
      {label}
      <div
        style={{
          fontSize: 10,
          opacity: 0.8,
          marginTop: 2
        }}
      >
        {count}
      </div>
    </button>
  ))}
</div>

{recordsError && (
  <div
    style={{
      background: C.redLight,
      border: "1px solid #FECACA",
      borderRadius: 12,
      padding: "10px 12px",
      fontSize: 12,
      color: C.red,
      fontWeight: 700,
      lineHeight: 1.5,
      marginBottom: 12
    }}
  >
    {recordsError}
  </div>
)}

{loading ? (
  <div style={{ textAlign: "center", padding: 20, color: C.textLight }}>
    {lang === "en" ? "Loading..." : "लोड हुँदैछ..."}
  </div>
) : (
  <>
    {activeRecordTab === "chats" && (
      <div>
        {history.length === 0 ? (
          <EmptyRecord
            icon="💬"
            title={lang === "en" ? "No conversations yet" : "कुराकानी छैन"}
            desc={lang === "en" ? "Your AI chat history will appear here." : "AI chat history यहाँ देखिनेछ।"}
          />
        ) : (
          history.map((h) => (
            <div
              key={h.id || h.created_at}
              style={{
                background: C.white,
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 8,
                border: "1px solid " + C.border,
                boxShadow: C.shadow
              }}
            >
              <div style={{ fontSize: 13, color: C.text, marginBottom: 4, lineHeight: 1.5 }}>
                {h.message.length > 80 ? `${h.message.slice(0, 80)}...` : h.message}
              </div>
              <div style={{ fontSize: 10, color: C.textLight }}>
                {new Date(h.created_at).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </div>
            </div>
          ))
        )}
      </div>
    )}

    {activeRecordTab === "labs" && (
      <div>
        {labRequests.length === 0 ? (
          <EmptyRecord
            icon="🧪"
            title={lang === "en" ? "No lab requests yet" : "ल्याब अनुरोध छैन"}
            desc={lang === "en" ? "Lab bookings will appear here after submission." : "ल्याब booking submit गरेपछि यहाँ देखिनेछ।"}
          />
        ) : (
          labRequests.map((req) => (
            <RecordCard
              key={req.id}
              icon="🧪"
              title={lang === "en" ? req.test_name_en : req.test_name_ne || req.test_name_en}
              subtitle={
                req.collection_type === "home"
                  ? lang === "en"
                    ? "Home sample collection"
                    : "घरमै sample collection"
                  : lang === "en"
                  ? "Visit lab"
                  : "Lab मा जाने"
              }
              meta={`${req.requested_date} · ${req.time_slot}`}
              status={req.status}
              amount={req.estimated_price}
              lang={lang}
            />
          ))
        )}
      </div>
    )}

    {activeRecordTab === "medicine" && (
      <div>
        {medicineRequests.length === 0 ? (
          <EmptyRecord
            icon="💊"
            title={lang === "en" ? "No medicine requests yet" : "औषधि अनुरोध छैन"}
            desc={lang === "en" ? "Medicine requests will appear here after submission." : "औषधि request submit गरेपछि यहाँ देखिनेछ।"}
          />
        ) : (
          medicineRequests.map((req) => (
            <RecordCard
              key={req.id}
              icon="💊"
              title={req.medicine_name}
              subtitle={
                req.request_type === "delivery"
                  ? lang === "en"
                    ? "Delivery request"
                    : "Delivery अनुरोध"
                  : lang === "en"
                  ? "Pickup request"
                  : "Pickup अनुरोध"
              }
              meta={req.medicine_type}
              status={req.status}
              amount={null}
              lang={lang}
            />
          ))
        )}
      </div>
    )}
  </>
)}
     <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
        <button onClick={handleLogout} style={{ width: "100%", background: C.redLight, color: C.red, border: "1px solid #FECACA", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LogOut size={16} /> {lang === "en" ? "Sign Out" : "साइन आउट"}</button>
      </div>
    </div>
  );
}
