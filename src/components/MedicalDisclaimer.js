import { Info } from "lucide-react";
import { C } from "../constants/colors";

export default function MedicalDisclaimer({ lang, compact = false }) {
  return (
    <div
      style={{
        background: C.primaryLight,
        border: "1px solid #BFDBFE",
        borderRadius: compact ? 10 : 14,
        padding: compact ? "9px 12px" : "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        marginBottom: compact ? 12 : 16
      }}
    >
      <Info
        size={16}
        color={C.primary}
        style={{
          marginTop: 2,
          flexShrink: 0
        }}
      />

      <div
        style={{
          fontSize: compact ? 11 : 12,
          color: C.primaryDark,
          lineHeight: 1.55,
          fontWeight: 500
        }}
      >
        {lang === "en"
          ? "Swasthya Sahayak gives basic health guidance only. It does not replace a doctor. In emergencies, call 102 or visit the nearest hospital."
          : "स्वास्थ्य सहायकले सामान्य स्वास्थ्य मार्गदर्शन मात्र दिन्छ। यसले डाक्टरलाई प्रतिस्थापन गर्दैन। आपतकालमा 102 मा फोन गर्नुहोस् वा नजिकको अस्पताल जानुहोस्।"}
      </div>
    </div>
  );
}