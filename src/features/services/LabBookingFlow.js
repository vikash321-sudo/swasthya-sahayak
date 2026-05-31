import { useState } from "react";
import { supabase } from "../../config/supabase";
import { C } from "../../constants/colors";

export default function LabBookingFlow({ lang, user }) {
  const [selectedTest, setSelectedTest] = useState(null);
  const [collectionType, setCollectionType] = useState("home");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState(
    [user?.local_level, user?.district, user?.province].filter(Boolean).join(", ")
  );
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState("");

  const labTests = [
    {
      id: "cbc",
      nameEn: "CBC / Complete Blood Count",
      nameNe: "CBC / पूरा रगत परीक्षण",
      descEn: "Basic blood test for infection, weakness, anemia and general health.",
      descNe: "संक्रमण, कमजोरी, anemia र सामान्य स्वास्थ्यका लागि आधारभूत रगत परीक्षण।",
      price: "NPR 600",
      icon: "🩸"
    },
    {
      id: "urine",
      nameEn: "Urine Routine Test",
      nameNe: "पिसाब परीक्षण",
      descEn: "Useful for urinary infection, kidney issues and general screening.",
      descNe: "पिसाब संक्रमण, kidney समस्या र सामान्य screening का लागि उपयोगी।",
      price: "NPR 350",
      icon: "🧪"
    },
    {
      id: "diabetes",
      nameEn: "Diabetes Test",
      nameNe: "मधुमेह परीक्षण",
      descEn: "Blood sugar testing for diabetes screening and monitoring.",
      descNe: "मधुमेह जाँच र monitoring का लागि blood sugar test।",
      price: "NPR 450",
      icon: "🍬"
    },
    {
      id: "thyroid",
      nameEn: "Thyroid Profile",
      nameNe: "Thyroid Profile",
      descEn: "Checks thyroid hormone levels for weight, tiredness and hormonal issues.",
      descNe: "तौल, थकान र hormonal समस्याका लागि thyroid hormone जाँच।",
      price: "NPR 1200",
      icon: "🦋"
    },
    {
      id: "liver",
      nameEn: "Liver Function Test",
      nameNe: "Liver Function Test",
      descEn: "Checks liver health and enzyme levels.",
      descNe: "कलेजोको स्वास्थ्य र enzyme level जाँच।",
      price: "NPR 1300",
      icon: "🧬"
    },
    {
      id: "kidney",
      nameEn: "Kidney Function Test",
      nameNe: "Kidney Function Test",
      descEn: "Checks kidney health, creatinine and urea levels.",
      descNe: "kidney health, creatinine र urea level जाँच।",
      price: "NPR 1100",
      icon: "🫘"
    },
    {
      id: "dengue",
      nameEn: "Dengue Test",
      nameNe: "Dengue Test",
      descEn: "Suggested when fever, headache, body pain or weakness continues.",
      descNe: "ज्वरो, टाउको दुखाई, शरीर दुखाई वा कमजोरी जारी रहे उपयोगी।",
      price: "NPR 1500",
      icon: "🦟"
    },
    {
      id: "fullbody",
      nameEn: "Full Body Checkup",
      nameNe: "Full Body Checkup",
      descEn: "General health screening package with multiple tests.",
      descNe: "धेरै test सहित सामान्य स्वास्थ्य screening package।",
      price: "NPR 3500",
      icon: "🏥"
    }
  ];

  const timeSlots = [
    "7:00 AM - 9:00 AM",
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM"
  ];
  async function submitLabRequest() {
  if (!selectedTest || !date || !timeSlot || !address.trim()) {
    alert(
      lang === "en"
        ? "Please select test, date, time and address."
        : "कृपया test, मिति, समय र ठेगाना छान्नुहोस्।"
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
      test_id: selectedTest.id,
      test_name_en: selectedTest.nameEn,
      test_name_ne: selectedTest.nameNe,
      collection_type: collectionType,
      requested_date: date,
      time_slot: timeSlot,
      address: address.trim(),
      notes: notes.trim() || null,
      estimated_price: selectedTest.price,
      status: "pending"
    };

    const { error } = await supabase
      .from("lab_requests")
      .insert([payload]);

    if (error) throw error;

    setSubmitted(true);
  } catch (err) {
    setSaveError(
      err?.message ||
        (lang === "en"
          ? "Could not submit lab request. Please try again."
          : "ल्याब अनुरोध पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।")
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
            {lang === "en" ? "Lab Request Submitted" : "ल्याब अनुरोध पठाइयो"}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#065F46",
              lineHeight: 1.6
            }}
          >
            {lang === "en"
              ? "This is a prototype confirmation. In the real version, a verified lab partner will contact the user to confirm sample collection."
              : "यो prototype confirmation हो। वास्तविक version मा verified lab partner ले sample collection confirm गर्न user लाई सम्पर्क गर्नेछ।"}
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
            {lang === "en" ? "Booking Summary" : "बुकिङ सारांश"}
          </div>

          {[
            [
              lang === "en" ? "Test" : "टेस्ट",
              lang === "en" ? selectedTest?.nameEn : selectedTest?.nameNe
            ],
            [
              lang === "en" ? "Collection" : "Collection",
              collectionType === "home"
                ? lang === "en"
                  ? "Home sample collection"
                  : "घरमै sample collection"
                : lang === "en"
                ? "Visit lab"
                : "Lab मा जाने"
            ],
            [lang === "en" ? "Date" : "मिति", date || "—"],
            [lang === "en" ? "Time" : "समय", timeSlot || "—"],
            [lang === "en" ? "Address" : "ठेगाना", address || "—"],
            [lang === "en" ? "Estimated Price" : "अनुमानित शुल्क", selectedTest?.price || "—"]
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
            setSelectedTest(null);
            setCollectionType("home");
            setDate("");
            setTimeSlot("");
            setNotes("");
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
          {lang === "en" ? "Book Another Test" : "अर्को टेस्ट बुक गर्नुहोस्"}
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
        {lang === "en" ? "Choose a Lab Test" : "ल्याब टेस्ट छान्नुहोस्"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {labTests.map((test) => {
          const active = selectedTest?.id === test.id;

          return (
            <button
              key={test.id}
              onClick={() => setSelectedTest(test)}
              style={{
                background: active ? C.primaryLight : C.white,
                border: "1.5px solid " + (active ? C.primary : C.border),
                borderRadius: 14,
                padding: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                textAlign: "left",
                boxShadow: active ? "0 4px 12px rgba(37,99,235,0.14)" : C.shadow
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: active ? C.white : C.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0
                }}
              >
                {test.icon}
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
                  {lang === "en" ? test.nameEn : test.nameNe}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: C.textLight,
                    lineHeight: 1.45,
                    marginBottom: 6
                  }}
                >
                  {lang === "en" ? test.descEn : test.descNe}
                </div>

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.primary
                  }}
                >
                  {test.price}
                </span>
              </div>

              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid " + (active ? C.primary : C.border),
                  background: active ? C.primary : "transparent",
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
          {lang === "en" ? "Collection Details" : "Sample Collection विवरण"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            ["home", lang === "en" ? "Home Collection" : "घरमै Collection"],
            ["lab", lang === "en" ? "Visit Lab" : "Lab मा जाने"]
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setCollectionType(value)}
              style={{
                background: collectionType === value ? C.primary : C.bg,
                color: collectionType === value ? "#fff" : C.textMid,
                border: "1px solid " + (collectionType === value ? C.primary : C.border),
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>
              {lang === "en" ? "Date" : "मिति"}
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>
              {lang === "en" ? "Time" : "समय"}
            </div>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              style={{
                width: "100%",
                border: "1.5px solid " + C.border,
                borderRadius: 10,
                padding: "10px",
                fontSize: 13,
                fontFamily: "inherit",
                background: C.bg,
                color: timeSlot ? C.text : C.textLight,
                outline: "none"
              }}
            >
              <option value="">{lang === "en" ? "Select" : "छान्नुहोस्"}</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
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
                ? "Enter collection address"
                : "Sample collection ठेगाना लेख्नुहोस्"
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
            {lang === "en" ? "Notes (optional)" : "नोट (ऐच्छिक)"}
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={
              lang === "en"
                ? "Any symptoms, doctor suggestion or special request?"
                : "लक्षण, डाक्टरको सुझाव वा विशेष request?"
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
  onClick={submitLabRequest}
  disabled={saving}
        style={{
          width: "100%",
          background: C.primary,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "14px",
          fontSize: 15,
          fontWeight: 800,
          fontFamily: "inherit",
          boxShadow: "0 8px 18px rgba(37,99,235,0.22)",
          opacity: saving ? 0.75 : 1,
          cursor: saving ? "not-allowed" : "pointer",
          
        }}
      >
        {saving
  ? (lang === "en" ? "Submitting..." : "पठाउँदैछ...")
  : (lang === "en" ? "Submit Lab Request" : "ल्याब अनुरोध पठाउनुहोस्")}
      </button>
    </div>
  );
}