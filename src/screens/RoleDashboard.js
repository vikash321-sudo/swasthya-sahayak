import { LogOut } from "lucide-react";
import { C } from "../constants/colors";
import PharmacyRequestsPanel from "../features/providers/PharmacyRequestsPanel";

export default function RoleDashboard({ user, lang, onLangChange, onLogout }) {
  const role = user?.role || "member";
  const verification = user?.verification_status || "pending_verification";

  const roleInfo = {
    doctor: {
      icon: "👨‍⚕️",
      titleEn: "Doctor Dashboard",
      titleNe: "Doctor Dashboard",
      descEn: "Manage appointment requests, consultations and patient follow-ups.",
      descNe: "Appointment requests, consultations र follow-ups manage गर्नुहोस्।",
      cards: [
        ["📅", "Appointment Requests", "View and accept consultation requests."],
        ["🩺", "Consultations", "Upcoming and completed consultations."],
        ["✅", "Verification", "Your medical details must be approved before receiving requests."]
      ]
    },

    pharmacy: {
      icon: "💊",
      titleEn: "Pharmacy Partner Dashboard",
      titleNe: "Pharmacy Partner Dashboard",
      descEn: "Manage medicine requests, prescription checks and delivery coordination.",
      descNe: "Medicine requests, prescription checks र delivery coordination manage गर्नुहोस्।",
      cards: [
        ["💊", "Medicine Requests", "Check requested medicines and availability."],
        ["📄", "Prescription Review", "Verify prescription before confirmation."],
        ["🛵", "Delivery Coordination", "Coordinate pickup or delivery tasks."]
      ]
    },

    lab: {
      icon: "🧪",
      titleEn: "Lab Partner Dashboard",
      titleNe: "Lab Partner Dashboard",
      descEn: "Manage lab bookings, sample collection and report status.",
      descNe: "Lab bookings, sample collection र report status manage गर्नुहोस्।",
      cards: [
        ["🧪", "Lab Requests", "View pending lab test bookings."],
        ["🏠", "Sample Collection", "Assign or manage home collection."],
        ["📋", "Report Status", "Update report processing status."]
      ]
    },

    field_partner: {
      icon: "🛵",
      titleEn: "Field Partner Dashboard",
      titleNe: "Field Partner Dashboard",
      descEn: "Handle sample pickup and medicine delivery tasks.",
      descNe: "Sample pickup र medicine delivery tasks handle गर्नुहोस्।",
      cards: [
        ["📍", "Assigned Tasks", "See assigned pickup or delivery work."],
        ["🧪", "Sample Pickup", "Collect lab samples from user location."],
        ["💊", "Medicine Delivery", "Deliver confirmed medicine orders."]
      ]
    },

    admin: {
      icon: "🛡️",
      titleEn: "Admin Dashboard",
      titleNe: "Admin Dashboard",
      descEn: "Verify partners, manage requests and monitor platform safety.",
      descNe: "Partners verify, requests manage र platform safety monitor गर्नुहोस्।",
      cards: [
        ["✅", "Partner Verification", "Approve doctors, labs, pharmacies and field partners."],
        ["📦", "All Requests", "Monitor lab and medicine requests."],
        ["⚠️", "Safety Issues", "Track urgent or flagged cases."]
      ]
    }
  };

  const current = roleInfo[role] || roleInfo.doctor;

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "'Inter','Noto Sans Devanagari','Segoe UI',system-ui,sans-serif",
        color: C.text
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
          padding: "22px 18px 26px",
          color: "#fff"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12
          }}
        >
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{current.icon}</div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 5
              }}
            >
              {lang === "en" ? current.titleEn : current.titleNe}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.5
              }}
            >
              {lang === "en" ? current.descEn : current.descNe}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-end"
            }}
          >
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: 3,
                gap: 2
              }}
            >
              {[
                ["en", "EN"],
                ["ne", "ने"]
              ].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => onLangChange(code)}
                  style={{
                    background: lang === code ? "#fff" : "transparent",
                    color: lang === code ? C.primary : "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onLogout}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 10,
                padding: "7px 10px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div
          style={{
            background:
              verification === "approved" ? C.greenLight : C.orangeLight,
            border:
              "1px solid " +
              (verification === "approved" ? "#A7F3D0" : "#FCD34D"),
            borderRadius: 14,
            padding: 14,
            marginBottom: 16
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: verification === "approved" ? C.green : C.orange,
              marginBottom: 4
            }}
          >
            {verification === "approved"
              ? "Account Approved"
              : "Verification Pending"}
          </div>

          <div
            style={{
              fontSize: 12,
              color: verification === "approved" ? "#065F46" : C.orange,
              lineHeight: 1.55,
              fontWeight: 600
            }}
          >
            {verification === "approved"
              ? lang === "en"
                ? "You can access partner features assigned to your role."
                : "तपाईं आफ्नो role अनुसार partner features access गर्न सक्नुहुन्छ।"
              : lang === "en"
              ? "Your account must be verified before receiving real requests."
              : "Real requests पाउनुअघि तपाईंको account verify हुनुपर्छ।"}
          </div>
        </div>

        <div
          style={{
            background: C.white,
            border: "1px solid " + C.border,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            boxShadow: C.shadow
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: C.text,
              marginBottom: 8
            }}
          >
            {user?.organization_name || user?.name || "Partner"}
          </div>

          <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.7 }}>
            <div>
              <strong>Role:</strong> {role}
            </div>
            <div>
              <strong>License/ID:</strong> {user?.license_number || "—"}
            </div>
            <div>
              <strong>Service Area:</strong>{" "}
              {user?.service_area || user?.district || "—"}
            </div>
          </div>
        </div>

        {role === "pharmacy" && verification === "approved" ? (
  <PharmacyRequestsPanel lang={lang} />
) : (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {current.cards.map(([icon, title, desc]) => (
      <div
        key={title}
        style={{
          background: C.white,
          border: "1px solid " + C.border,
          borderRadius: 16,
          padding: 15,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          boxShadow: C.shadow
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: C.primaryLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0
          }}
        >
          {icon}
        </div>

        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: C.text,
              marginBottom: 4
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 12,
              color: C.textLight,
              lineHeight: 1.5
            }}
          >
            {desc}
          </div>
        </div>
      </div>
    ))}
  </div>
)}

        <div
          style={{
            background: C.primaryLight,
            border: "1px solid #BFDBFE",
            borderRadius: 14,
            padding: 14,
            marginTop: 16,
            fontSize: 12,
            color: C.primaryDark,
            lineHeight: 1.6,
            fontWeight: 600
          }}
        >
          {lang === "en"
            ? "This is the first version of role-based access. Request management screens will be added next."
            : "यो role-based access को पहिलो version हो। Request management screens अर्को चरणमा थपिनेछ।"}
        </div>
      </div>
    </div>
  );
}