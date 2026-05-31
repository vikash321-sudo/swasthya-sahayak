import { useState } from "react";
import { supabase } from "../../config/supabase";
import { C } from "../../constants/colors";

export default function MedicineRequestFlow({ lang, user }) {
  const [medicineType, setMedicineType] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [requestType, setRequestType] = useState("delivery");
  const [address, setAddress] = useState(
    [user?.local_level, user?.district, user?.province].filter(Boolean).join(", ")
  );
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const medicineTypes = [
    {
      id: "regular",
      icon: "💊",
      en: "Regular Medicine",
      ne: "नियमित औषधि",
      descEn: "For medicines you already take regularly.",
      descNe: "तपाईंले नियमित रूपमा लिने औषधिका लागि।"
    },
    {
      id: "prescription",
      icon: "📄",
      en: "Prescription Medicine",
      ne: "Prescription औषधि",
      descEn: "Requires doctor prescription verification.",
      descNe: "डाक्टरको prescription verification आवश्यक हुन्छ।"
    },
    {
      id: "otc",
      icon: "🧴",
      en: "Basic OTC Items",
      ne: "सामान्य OTC सामग्री",
      descEn: "Basic items like ORS, thermometer, bandage, etc.",
      descNe: "ORS, thermometer, bandage जस्ता सामान्य सामग्री।"
    }
  ];
async function submitMedicineRequest() {
  if (!medicineType || !medicineName.trim() || !address.trim()) {
    alert(
      lang === "en"
        ? "Please select type, enter medicine name and address."
        : "कृपया type छान्नुहोस्, औषधिको नाम र ठेगाना लेख्नुहोस्।"
    );
    return;
  }

  setSaving(true);
  setSaveError("");

  try {
    const {
      data: { user: authUser },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !authUser?.id) {
      throw new Error(
        lang === "en"
          ? "Your login session expired. Please log out and log in again."
          : "Login session सकियो। कृपया logout गरेर फेरि login गर्नुहोस्।"
      );
    }

    const payload = {
      user_id: authUser.id,
      patient_name: user?.name || authUser.email || null,
      medicine_type: medicineType,
      medicine_name: medicineName.trim(),
      request_type: requestType,
      address: address.trim(),
      prescription_note: prescriptionNote.trim() || null,
      status: "pending"
    };

    const { error } = await supabase
      .from("medicine_requests")
      .insert([payload]);

    if (error) throw error;

    setSubmitted(true);
  } catch (err) {
    setSaveError(
      err?.message ||
        (lang === "en"
          ? "Could not submit medicine request. Please try again."
          : "औषधि अनुरोध पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।")
    );
  }

  setSaving(false);
}

  if (submitted) {
    return (
      <div>
        <div
          style={{
            background: C.greenLight,
            border: "1px solid #A7F3D0",
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >
          <div style={{ fontSize: 34, marginBottom: 8 }}>✅</div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: C.green,
              marginBottom: 6
            }}
          >
            {lang === "en" ? "Medicine Request Submitted" : "औषधि अनुरोध पठाइयो"}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#065F46",
              lineHeight: 1.6
            }}
          >
            {lang === "en"
              ? "This is a prototype confirmation. In the real version, a verified pharmacy will check availability and contact the user before confirming."
              : "यो prototype confirmation हो। वास्तविक version मा verified pharmacy ले availability जाँचेर confirm गर्नु अघि user लाई सम्पर्क गर्नेछ।"}
          </div>
        </div>

        <div
          style={{
            background: C.white,
            border: "1px solid " + C.border,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14,
            boxShadow: C.shadow
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: C.text,
              marginBottom: 12
            }}
          >
            {lang === "en" ? "Request Summary" : "अनुरोध सारांश"}
          </div>

          {[
            [lang === "en" ? "Medicine Type" : "औषधि प्रकार", medicineTypes.find((m) => m.id === medicineType)?.[lang === "en" ? "en" : "ne"] || "—"],
            [lang === "en" ? "Medicine / Item" : "औषधि / सामग्री", medicineName || "—"],
            [
              lang === "en" ? "Request Type" : "अनुरोध प्रकार",
              requestType === "delivery"
                ? lang === "en"
                  ? "Delivery request"
                  : "Delivery अनुरोध"
                : lang === "en"
                ? "Pickup request"
                : "Pickup अनुरोध"
            ],
            [lang === "en" ? "Address" : "ठेगाना", address || "—"],
            [lang === "en" ? "Prescription Note" : "Prescription नोट", prescriptionNote || "—"]
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "9px 0",
                borderBottom: "1px solid " + C.border
              }}
            >
              <span style={{ fontSize: 12, color: C.textLight }}>{label}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.text,
                  textAlign: "right"
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setMedicineType("");
            setMedicineName("");
            setRequestType("delivery");
            setPrescriptionNote("");
          }}
          style={{
            width: "100%",
            background: C.primary,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "13px",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          {lang === "en" ? "Create Another Request" : "अर्को अनुरोध गर्नुहोस्"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.text,
          marginBottom: 10
        }}
      >
        {lang === "en" ? "Choose Medicine Request Type" : "औषधि अनुरोध प्रकार छान्नुहोस्"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {medicineTypes.map((type) => {
          const active = medicineType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setMedicineType(type.id)}
              style={{
                background: active ? C.greenLight : C.white,
                border: "1.5px solid " + (active ? C.green : C.border),
                borderRadius: 14,
                padding: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                textAlign: "left",
                boxShadow: active ? "0 4px 12px rgba(5,150,105,0.14)" : C.shadow
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: active ? C.white : C.greenLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0
                }}
              >
                {type.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: C.text,
                    marginBottom: 4
                  }}
                >
                  {lang === "en" ? type.en : type.ne}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: C.textLight,
                    lineHeight: 1.45
                  }}
                >
                  {lang === "en" ? type.descEn : type.descNe}
                </div>
              </div>

              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid " + (active ? C.green : C.border),
                  background: active ? C.green : "transparent",
                  flexShrink: 0,
                  marginTop: 4
                }}
              />
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: C.white,
          border: "1px solid " + C.border,
          borderRadius: 16,
          padding: 16,
          boxShadow: C.shadow,
          marginBottom: 16
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: C.text,
            marginBottom: 12
          }}
        >
          {lang === "en" ? "Medicine Details" : "औषधि विवरण"}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>
            {lang === "en" ? "Medicine / Item Name" : "औषधि / सामग्रीको नाम"}
          </div>

          <input
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder={
              lang === "en"
                ? "Example: Paracetamol 500mg, ORS, thermometer..."
                : "उदाहरण: Paracetamol 500mg, ORS, thermometer..."
            }
            style={{
              width: "100%",
              border: "1.5px solid " + C.border,
              borderRadius: 10,
              padding: "11px 12px",
              fontSize: 13,
              fontFamily: "inherit",
              background: C.bg,
              color: C.text,
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            ["delivery", lang === "en" ? "Delivery" : "Delivery"],
            ["pickup", lang === "en" ? "Pickup" : "Pickup"]
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setRequestType(value)}
              style={{
                background: requestType === value ? C.green : C.bg,
                color: requestType === value ? "#fff" : C.textMid,
                border: "1px solid " + (requestType === value ? C.green : C.border),
                borderRadius: 10,
                padding: "10px 8px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>
            {lang === "en" ? "Address" : "ठेगाना"}
          </div>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            placeholder={
              lang === "en"
                ? "Enter delivery/pickup address"
                : "Delivery/Pickup ठेगाना लेख्नुहोस्"
            }
            style={{
              width: "100%",
              border: "1.5px solid " + C.border,
              borderRadius: 10,
              padding: "10px",
              fontSize: 13,
              fontFamily: "inherit",
              background: C.bg,
              color: C.text,
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              lineHeight: 1.5
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>
            {lang === "en" ? "Prescription / Notes" : "Prescription / नोट"}
          </div>

          <textarea
            value={prescriptionNote}
            onChange={(e) => setPrescriptionNote(e.target.value)}
            rows={3}
            placeholder={
              lang === "en"
                ? "Mention prescription details, quantity, or upload prescription later."
                : "Prescription विवरण, quantity वा upload गर्ने कुरा लेख्नुहोस्।"
            }
            style={{
              width: "100%",
              border: "1.5px solid " + C.border,
              borderRadius: 10,
              padding: "10px",
              fontSize: 13,
              fontFamily: "inherit",
              background: C.bg,
              color: C.text,
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              lineHeight: 1.5
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: C.orangeLight,
          border: "1px solid #FCD34D",
          borderRadius: 14,
          padding: 14,
          fontSize: 12,
          color: C.orange,
          lineHeight: 1.6,
          fontWeight: 600,
          marginBottom: 14
        }}
      >
        {lang === "en"
          ? "Prescription and medicine availability must be verified by a registered pharmacy before confirmation. This app does not directly sell medicines in prototype mode."
          : "Prescription र medicine availability registered pharmacy ले verify गरेपछि मात्र confirm हुन्छ। Prototype mode मा app ले सिधै औषधि बेच्दैन।"}
      </div>

{saveError && (
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
    {saveError}
  </div>
)}
      <button
  onClick={submitMedicineRequest}
  disabled={saving}
        style={{
          width: "100%",
          background: C.green,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "14px",
          fontSize: 15,
          fontWeight: 800,
          fontFamily: "inherit",
          boxShadow: "0 8px 18px rgba(5,150,105,0.22)",
          opacity: saving ? 0.75 : 1,
cursor: saving ? "not-allowed" : "pointer",
        }}
      >
       {saving
  ? (lang === "en" ? "Submitting..." : "पठाउँदैछ...")
  : (lang === "en" ? "Submit Medicine Request" : "औषधि अनुरोध पठाउनुहोस्")}
      </button>
    </div>
  );
}