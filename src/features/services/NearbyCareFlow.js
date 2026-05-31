import { useState } from "react";
import { C } from "../../constants/colors";
import ServiceStep from "../../components/ServiceStep";

export default function NearbyCareFlow({ lang, user }) {
  const [careType, setCareType] = useState("dental");
  const [locationMode, setLocationMode] = useState("saved");
  const [locationStatus, setLocationStatus] = useState("");
  const [coords, setCoords] = useState(null);

  const savedArea = [user?.local_level, user?.district, user?.province]
    .filter(Boolean)
    .join(", ") || "Nepal";

  const careTypes = [
    {
      id: "dental",
      icon: "🦷",
      en: "Dental Care",
      ne: "दन्त सेवा",
      descEn: "Tooth pain, gum problem, dental checkup",
      descNe: "दाँत दुख्ने, गिजाको समस्या, dental checkup"
    },
    {
      id: "eye",
      icon: "👁️",
      en: "Eye Care",
      ne: "आँखा सेवा",
      descEn: "Eye pain, vision problem, redness",
      descNe: "आँखा दुख्ने, दृष्टि समस्या, रातोपन"
    },
    {
      id: "child",
      icon: "👶",
      en: "Child Specialist",
      ne: "बाल रोग विशेषज्ञ",
      descEn: "Child fever, cough, vomiting, weakness",
      descNe: "बच्चाको ज्वरो, खोकी, उल्टी, कमजोरी"
    },
    {
      id: "emergency",
      icon: "🚨",
      en: "Emergency Care",
      ne: "आपतकालीन सेवा",
      descEn: "Severe symptoms, injury, breathing problem",
      descNe: "गम्भीर लक्षण, चोटपटक, सास फेर्न गाह्रो"
    },
    {
      id: "pharmacy",
      icon: "💊",
      en: "Pharmacy",
      ne: "फार्मेसी",
      descEn: "Medicine availability and prescription support",
      descNe: "औषधि availability र prescription support"
    },
    {
      id: "lab",
      icon: "🧪",
      en: "Lab / Diagnostic",
      ne: "ल्याब / Diagnostic",
      descEn: "Blood, urine and health testing",
      descNe: "रगत, पिसाब र स्वास्थ्य परीक्षण"
    },
    {
      id: "general",
      icon: "🏥",
      en: "General Clinic",
      ne: "सामान्य क्लिनिक",
      descEn: "Common health issues and basic consultation",
      descNe: "सामान्य स्वास्थ्य समस्या र basic consultation"
    }
  ];

  const providersByType = {
    dental: [
      {
        nameEn: "Pilot Dental Clinic",
        nameNe: "Pilot Dental Clinic",
        typeEn: "Dental clinic",
        typeNe: "दन्त क्लिनिक",
        distance: "1.2 km",
        statusEn: "Open today",
        statusNe: "आज खुला",
        phone: "01-XXXXXXX",
        noteEn: "Pilot data only. Real dental partners must be verified.",
        noteNe: "Pilot data मात्र। वास्तविक dental partners verify गर्नुपर्छ।"
      },
      {
        nameEn: "Nearby Hospital Dental Department",
        nameNe: "नजिकको अस्पताल Dental Department",
        typeEn: "Hospital department",
        typeNe: "अस्पताल विभाग",
        distance: "2.8 km",
        statusEn: "Call before visit",
        statusNe: "जानुअघि फोन गर्नुहोस्",
        phone: "01-XXXXXXX",
        noteEn: "Useful for severe tooth pain, swelling or injury.",
        noteNe: "गम्भीर दाँत दुखाई, swelling वा injury मा उपयोगी।"
      }
    ],
    eye: [
      {
        nameEn: "Pilot Eye Care Center",
        nameNe: "Pilot Eye Care Center",
        typeEn: "Eye clinic",
        typeNe: "आँखा क्लिनिक",
        distance: "1.5 km",
        statusEn: "Open today",
        statusNe: "आज खुला",
        phone: "01-XXXXXXX",
        noteEn: "For redness, pain, watery eyes or vision problems.",
        noteNe: "आँखा रातो, दुख्ने, पानी आउने वा vision problem का लागि।"
      },
      {
        nameEn: "Nearby Eye Hospital Desk",
        nameNe: "नजिकको आँखा अस्पताल Desk",
        typeEn: "Specialized eye care",
        typeNe: "विशेष आँखा सेवा",
        distance: "3.4 km",
        statusEn: "Call first",
        statusNe: "पहिले फोन गर्नुहोस्",
        phone: "01-XXXXXXX",
        noteEn: "Urgent if sudden vision loss or eye injury occurs.",
        noteNe: "अचानक vision loss वा eye injury भए urgent।"
      }
    ],
    child: [
      {
        nameEn: "Pilot Pediatric Clinic",
        nameNe: "Pilot Pediatric Clinic",
        typeEn: "Child specialist",
        typeNe: "बाल रोग विशेषज्ञ",
        distance: "2.1 km",
        statusEn: "Appointment needed",
        statusNe: "Appointment आवश्यक",
        phone: "01-XXXXXXX",
        noteEn: "For child fever, vomiting, cough or poor feeding.",
        noteNe: "बच्चाको ज्वरो, उल्टी, खोकी वा खाना नखाने समस्या।"
      },
      {
        nameEn: "Nearby Child OPD",
        nameNe: "नजिकको Child OPD",
        typeEn: "Hospital OPD",
        typeNe: "अस्पताल OPD",
        distance: "4.0 km",
        statusEn: "Morning OPD",
        statusNe: "बिहान OPD",
        phone: "01-XXXXXXX",
        noteEn: "Go urgently if child has breathing difficulty or seizure.",
        noteNe: "बच्चालाई सास फेर्न गाह्रो वा seizure भए तुरुन्त जानुहोस्।"
      }
    ],
    emergency: [
      {
        nameEn: "Nearest Emergency Service",
        nameNe: "नजिकको Emergency सेवा",
        typeEn: "Emergency care",
        typeNe: "आपतकालीन सेवा",
        distance: "Nearest available",
        statusEn: "Call 102 now",
        statusNe: "अहिले 102 मा फोन गर्नुहोस्",
        phone: "102",
        noteEn: "For chest pain, severe breathing problem, unconsciousness or major injury.",
        noteNe: "छाती दुखाई, सास फेर्न धेरै गाह्रो, बेहोस वा ठूलो चोटपटकमा।"
      },
      {
        nameEn: "Nearby Hospital Emergency",
        nameNe: "नजिकको अस्पताल Emergency",
        typeEn: "Hospital emergency",
        typeNe: "अस्पताल Emergency",
        distance: "Depends on location",
        statusEn: "24/7 may vary",
        statusNe: "24/7 फरक पर्न सक्छ",
        phone: "01-XXXXXXX",
        noteEn: "Do not wait if symptoms are severe.",
        noteNe: "लक्षण गम्भीर भए प्रतीक्षा नगर्नुहोस्।"
      }
    ],
    pharmacy: [
      {
        nameEn: "Verified Pharmacy Partner",
        nameNe: "Verified Pharmacy Partner",
        typeEn: "Pharmacy",
        typeNe: "फार्मेसी",
        distance: "1.0 km",
        statusEn: "Verification required",
        statusNe: "Verification आवश्यक",
        phone: "01-XXXXXXX",
        noteEn: "Prescription medicines must be verified by a registered pharmacy.",
        noteNe: "Prescription औषधि registered pharmacy ले verify गर्नुपर्छ।"
      },
      {
        nameEn: "Nearby Medicine Counter",
        nameNe: "नजिकको औषधि पसल",
        typeEn: "Medicine counter",
        typeNe: "औषधि पसल",
        distance: "1.8 km",
        statusEn: "Call for availability",
        statusNe: "Availability का लागि फोन गर्नुहोस्",
        phone: "01-XXXXXXX",
        noteEn: "Use Medicine Request for pharmacy confirmation.",
        noteNe: "Pharmacy confirmation का लागि Medicine Request प्रयोग गर्नुहोस्।"
      }
    ],
    lab: [
      {
        nameEn: "Verified Lab Partner",
        nameNe: "Verified Lab Partner",
        typeEn: "Diagnostic lab",
        typeNe: "Diagnostic lab",
        distance: "2.2 km",
        statusEn: "Home collection pilot",
        statusNe: "Home collection pilot",
        phone: "01-XXXXXXX",
        noteEn: "Use Lab Test Booking for home sample request.",
        noteNe: "Home sample request का लागि Lab Test Booking प्रयोग गर्नुहोस्।"
      },
      {
        nameEn: "Nearby Diagnostic Center",
        nameNe: "नजिकको Diagnostic Center",
        typeEn: "Lab service",
        typeNe: "ल्याब सेवा",
        distance: "3.1 km",
        statusEn: "Call before visit",
        statusNe: "जानुअघि फोन गर्नुहोस्",
        phone: "01-XXXXXXX",
        noteEn: "Reports should be uploaded only after verified partnership.",
        noteNe: "Verified partnership पछि मात्र reports upload गर्नुपर्छ।"
      }
    ],
    general: [
      {
        nameEn: "Nearby General Clinic",
        nameNe: "नजिकको General Clinic",
        typeEn: "General consultation",
        typeNe: "सामान्य परामर्श",
        distance: "1.4 km",
        statusEn: "Open today",
        statusNe: "आज खुला",
        phone: "01-XXXXXXX",
        noteEn: "For common symptoms and non-emergency health issues.",
        noteNe: "सामान्य लक्षण र non-emergency स्वास्थ्य समस्याका लागि।"
      },
      {
        nameEn: "Local Health Post / Primary Care",
        nameNe: "स्थानीय Health Post / Primary Care",
        typeEn: "Primary care",
        typeNe: "Primary care",
        distance: "Based on local level",
        statusEn: "Check timing",
        statusNe: "समय जाँच्नुहोस्",
        phone: "01-XXXXXXX",
        noteEn: "Useful for basic screening and referral.",
        noteNe: "Basic screening र referral का लागि उपयोगी।"
      }
    ]
  };

  const selectedCare = careTypes.find((c) => c.id === careType);
  const providers = providersByType[careType] || [];

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus(
        lang === "en"
          ? "Your browser does not support location access."
          : "तपाईंको browser ले location access support गर्दैन।"
      );
      return;
    }

    setLocationMode("gps");
    setLocationStatus(lang === "en" ? "Requesting location..." : "Location माग्दैछ...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus(
          lang === "en"
            ? "Location detected. Real map search will be added after Google/OpenStreetMap integration."
            : "Location detect भयो। Real map search Google/OpenStreetMap integration पछि थपिनेछ।"
        );
      },
      () => {
        setLocationMode("saved");
        setLocationStatus(
          lang === "en"
            ? "Location permission denied. Using saved district/local level."
            : "Location permission दिइएन। Saved district/local level प्रयोग हुँदैछ।"
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div>
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
          ? "Nearby Care is currently using pilot provider data. Real distance, reviews and availability will require verified provider data or map API integration."
          : "Nearby Care अहिले pilot provider data मा आधारित छ। Real distance, reviews र availability का लागि verified provider data वा map API integration आवश्यक हुन्छ।"}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.text,
          marginBottom: 10
        }}
      >
        {lang === "en" ? "Choose Care Type" : "सेवा प्रकार छान्नुहोस्"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 16
        }}
      >
        {careTypes.map((type) => {
          const active = careType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setCareType(type.id)}
              style={{
                background: active ? C.orangeLight : C.white,
                border: "1.5px solid " + (active ? C.orange : C.border),
                borderRadius: 14,
                padding: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                boxShadow: active ? "0 4px 12px rgba(217,119,6,0.14)" : C.shadow
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{type.icon}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.text,
                  marginBottom: 3
                }}
              >
                {lang === "en" ? type.en : type.ne}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.textLight,
                  lineHeight: 1.35
                }}
              >
                {lang === "en" ? type.descEn : type.descNe}
              </div>
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
            marginBottom: 10
          }}
        >
          {lang === "en" ? "Search Area" : "खोज्ने क्षेत्र"}
        </div>

        <div
          style={{
            background: C.bg,
            borderRadius: 12,
            padding: 12,
            fontSize: 13,
            color: C.text,
            lineHeight: 1.5,
            marginBottom: 10
          }}
        >
          <strong>{lang === "en" ? "Saved location:" : "Saved location:"}</strong>{" "}
          {savedArea}
        </div>

        {coords && (
          <div
            style={{
              background: C.primaryLight,
              border: "1px solid #BFDBFE",
              borderRadius: 12,
              padding: 10,
              fontSize: 12,
              color: C.primaryDark,
              lineHeight: 1.5,
              marginBottom: 10
            }}
          >
            GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        )}

        {locationStatus && (
          <div
            style={{
              fontSize: 12,
              color: locationMode === "gps" ? C.primary : C.textMid,
              lineHeight: 1.5,
              marginBottom: 10
            }}
          >
            {locationStatus}
          </div>
        )}

        <button
          onClick={useCurrentLocation}
          style={{
            width: "100%",
            background: C.primaryLight,
            color: C.primary,
            border: "1px solid #BFDBFE",
            borderRadius: 12,
            padding: "12px",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          📍 {lang === "en" ? "Use Current Location" : "Current Location प्रयोग गर्नुहोस्"}
        </button>
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.text,
          marginBottom: 10
        }}
      >
        {lang === "en"
          ? `${selectedCare?.en || "Care"} near you`
          : `${selectedCare?.ne || "सेवा"} नजिक`}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {providers.map((provider) => (
          <div
            key={provider.nameEn}
            style={{
              background: C.white,
              border: "1px solid " + C.border,
              borderRadius: 16,
              padding: 15,
              boxShadow: C.shadow
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: C.orangeLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0
                }}
              >
                {selectedCare?.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: C.text,
                    marginBottom: 3
                  }}
                >
                  {lang === "en" ? provider.nameEn : provider.nameNe}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: C.textLight,
                    marginBottom: 7
                  }}
                >
                  {lang === "en" ? provider.typeEn : provider.typeNe} · {provider.distance}
                </div>

                <div
                  style={{
                    display: "inline-block",
                    background: C.orangeLight,
                    color: C.orange,
                    borderRadius: 20,
                    padding: "4px 9px",
                    fontSize: 10,
                    fontWeight: 800,
                    marginBottom: 8
                  }}
                >
                  {lang === "en" ? provider.statusEn : provider.statusNe}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: C.textMid,
                    lineHeight: 1.55
                  }}
                >
                  {lang === "en" ? provider.noteEn : provider.noteNe}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 12
              }}
            >
              <a
                href={`tel:${provider.phone}`}
                style={{
                  background: careType === "emergency" ? C.red : C.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px",
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                📞 {careType === "emergency" ? "102" : lang === "en" ? "Call" : "फोन"}
              </a>

              <button
                onClick={() =>
                  alert(
                    lang === "en"
                      ? "Directions will be available after map integration."
                      : "Map integration पछि direction उपलब्ध हुनेछ।"
                  )
                }
                style={{
                  background: C.bg,
                  color: C.textMid,
                  border: "1px solid " + C.border,
                  borderRadius: 10,
                  padding: "10px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit"
                }}
              >
                🧭 {lang === "en" ? "Directions" : "Direction"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.primaryLight,
          border: "1px solid #BFDBFE",
          borderRadius: 14,
          padding: 14,
          marginBottom: 14
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: C.primaryDark,
            marginBottom: 10
          }}
        >
          {lang === "en" ? "How Nearby Care will improve" : "Nearby Care कसरी राम्रो हुनेछ"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            lang === "en"
              ? "Connect verified hospital, clinic, pharmacy and lab database"
              : "Verified hospital, clinic, pharmacy र lab database जोड्ने",
            lang === "en"
              ? "Add live distance and map directions"
              : "Live distance र map direction थप्ने",
            lang === "en"
              ? "Show doctor availability, reviews and service timing"
              : "Doctor availability, reviews र service timing देखाउने",
            lang === "en"
              ? "Allow appointment or service request directly"
              : "Appointment वा service request सिधै गर्न मिल्ने"
          ].map((step, index) => (
            <ServiceStep key={step} number={index + 1} text={step} />
          ))}
        </div>
      </div>
    </div>
  );
}
