import { useState } from "react";
import { C } from "../constants/colors";
import Sh from "../components/SectionHeader";
import LabBookingFlow from "../features/services/LabBookingFlow";
import MedicineRequestFlow from "../features/services/MedicineRequestFlow";
import NearbyCareFlow from "../features/services/NearbyCareFlow";

export default function ServicesScreen({ setTab, lang, user }) {
  const [selectedService, setSelectedService] = useState(null);

  const serviceGroups = [
    {
      title: lang === "en" ? "Popular Services" : "लोकप्रिय सेवाहरू",
      items: [
        {
          id: "lab",
          icon: "🧪",
          title: lang === "en" ? "Lab Test Booking" : "ल्याब टेस्ट बुकिङ",
          desc:
            lang === "en"
              ? "Book home sample collection for blood, urine and health tests."
              : "रगत, पिसाब र स्वास्थ्य परीक्षणका लागि घरमै sample collection बुक गर्नुहोस्।",
          badge: lang === "en" ? "Prototype" : "प्रोटोटाइप",
          color: C.primary,
          bg: C.primaryLight
        },
        {
          id: "medicine",
          icon: "💊",
          title: lang === "en" ? "Medicine Request" : "औषधि अनुरोध",
          desc:
            lang === "en"
              ? "Request medicines from partner pharmacies with prescription support."
              : "Prescription support सहित partner pharmacy बाट औषधि अनुरोध गर्नुहोस्।",
          badge: lang === "en" ? "Coming soon" : "चाँडै आउँदैछ",
          color: C.green,
          bg: C.greenLight
        },
        {
          id: "nearby",
          icon: "📍",
          title: lang === "en" ? "Nearby Care" : "नजिकको स्वास्थ्य सेवा",
          desc:
            lang === "en"
              ? "Find nearby clinics, dental care, labs, pharmacies and emergency care."
              : "नजिकको clinic, dental care, lab, pharmacy र emergency सेवा खोज्नुहोस्।",
          badge: lang === "en" ? "Pilot data" : "पाइलट डाटा",
          color: C.orange,
          bg: C.orangeLight
        }
      ]
    },
    {
      title: lang === "en" ? "Health Management" : "स्वास्थ्य व्यवस्थापन",
      items: [
        {
          id: "firstaid",
          icon: "🩹",
          title: lang === "en" ? "First Aid Guide" : "प्राथमिक उपचार",
          desc:
            lang === "en"
              ? "Step-by-step help for fever, wounds, burns, fainting and emergencies."
              : "ज्वरो, घाउ, जलन, बेहोस र emergency को चरणबद्ध सहायता।",
          badge: lang === "en" ? "Available" : "उपलब्ध",
          color: C.red,
          bg: C.redLight,
          tab: "firstaid"
        },
        {
          id: "followup",
          icon: "🔔",
          title: lang === "en" ? "Follow-up Reminders" : "फलो-अप रिमाइन्डर",
          desc:
            lang === "en"
              ? "Track fever, medicine, symptoms and recovery progress."
              : "ज्वरो, औषधि, लक्षण र recovery progress track गर्नुहोस्।",
          badge: lang === "en" ? "Available" : "उपलब्ध",
          color: C.teal,
          bg: C.tealLight,
          tab: "followup"
        },
        {
          id: "records",
          icon: "📋",
          title: lang === "en" ? "Health Records" : "स्वास्थ्य रेकर्ड",
          desc:
            lang === "en"
              ? "View your AI chat history, symptom checks and future lab reports."
              : "AI chat history, symptom check र भविष्यका lab report हेर्नुहोस्।",
          badge: lang === "en" ? "Available" : "उपलब्ध",
          color: C.purple,
          bg: C.purpleLight,
          tab: "history"
        }
      ]
    }
  ];

  function openService(service) {
    if (service.tab) {
      setTab(service.tab);
      return;
    }

    setSelectedService(service);
  }

  if (selectedService) {
    return (
      <div style={{ padding: "20px 16px 100px" }}>
        <button
          onClick={() => setSelectedService(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: C.textMid,
            fontFamily: "inherit",
            fontWeight: 600,
            marginBottom: 16
          }}
        >
          ← {lang === "en" ? "Back to Services" : "सेवाहरूमा फर्कनुहोस्"}
        </button>

        <div
          style={{
            background: selectedService.bg,
            border: "1px solid " + selectedService.color + "33",
            borderRadius: 18,
            padding: 18,
            marginBottom: 16
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              marginBottom: 12
            }}
          >
            {selectedService.icon}
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: C.text,
              marginBottom: 6
            }}
          >
            {selectedService.title}
          </div>

          <div
            style={{
              fontSize: 13,
              color: C.textMid,
              lineHeight: 1.6,
              marginBottom: 12
            }}
          >
            {selectedService.desc}
          </div>

          <span
            style={{
              background: C.white,
              color: selectedService.color,
              border: "1px solid " + selectedService.color + "33",
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 800
            }}
          >
            {selectedService.badge}
          </span>
        </div>

        <div
          style={{
            background: C.white,
            border: "1px solid " + C.border,
            borderRadius: 16,
            padding: 16,
            boxShadow: C.shadow,
            marginBottom: 14
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: C.text,
              marginBottom: 10
            }}
          >
            {lang === "en" ? "How this will work" : "यो कसरी काम गर्नेछ"}
          </div>
           {selectedService.id === "lab" && (
  <LabBookingFlow lang={lang} user={user} />
)}
          {selectedService.id === "medicine" && (
  <MedicineRequestFlow lang={lang} user={user} />
)}

          {selectedService.id === "nearby" && (
  <NearbyCareFlow lang={lang} user={user} />
)}
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
            fontWeight: 600
          }}
        >
          {lang === "en"
            ? "This service is currently in prototype mode. Real pharmacy, lab and hospital partners must be verified before public transactions."
            : "यो सेवा अहिले prototype mode मा छ। सार्वजनिक transaction अघि pharmacy, lab र hospital partners verify गर्नुपर्छ।"}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: C.text,
          marginBottom: 4
        }}
      >
        {lang === "en" ? "Services" : "सेवाहरू"}
      </div>

      <div
        style={{
          fontSize: 13,
          color: C.textLight,
          marginBottom: 16,
          lineHeight: 1.5
        }}
      >
        {lang === "en"
          ? "Access health services, care support and future partner features from one place."
          : "स्वास्थ्य सेवा, care support र भविष्यका partner features एउटै ठाउँबाट प्रयोग गर्नुहोस्।"}
      </div>

      <div
        style={{
          background: C.primaryLight,
          border: "1px solid #BFDBFE",
          borderRadius: 14,
          padding: 14,
          marginBottom: 18,
          display: "flex",
          alignItems: "flex-start",
          gap: 10
        }}
      >
        <span style={{ fontSize: 20 }}>ℹ️</span>
        <div
          style={{
            fontSize: 12,
            color: C.primaryDark,
            lineHeight: 1.6,
            fontWeight: 500
          }}
        >
          {lang === "en"
            ? "Some services are prototypes. We will only activate real booking after verified partners are onboarded."
            : "केही सेवाहरू prototype हुन्। Verified partners onboard भएपछि मात्रै real booking activate गरिनेछ।"}
        </div>
      </div>

      {serviceGroups.map((group) => (
        <div key={group.title} style={{ marginBottom: 22 }}>
          <Sh title={group.title} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {group.items.map((service) => (
              <button
                key={service.id}
                onClick={() => openService(service)}
                style={{
                  background: C.white,
                  border: "1px solid " + C.border,
                  borderRadius: 16,
                  padding: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "left",
                  boxShadow: C.shadow
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: service.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0
                  }}
                >
                  {service.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.text,
                      marginBottom: 3
                    }}
                  >
                    {service.title}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: C.textLight,
                      lineHeight: 1.45
                    }}
                  >
                    {service.desc}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6
                  }}
                >
                  <span
                    style={{
                      background: service.bg,
                      color: service.color,
                      borderRadius: 20,
                      padding: "4px 8px",
                      fontSize: 9,
                      fontWeight: 800,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {service.badge}
                  </span>

                  <span
                    style={{
                      color: C.textLight,
                      fontSize: 18
                    }}
                  >
                    ›
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}