import { C } from "../constants/colors";

export default function Drawer({
  open,
  onClose,
  setTab,
  user,
  onLogout,
  lang,
  onLangChange
}) {
  if (!open) return null;

  const items = [
    {
      icon: "👤",
      label: lang === "en" ? "Profile" : "प्रोफाइल",
      tab: "profile"
    },
    {
      icon: "🔔",
      label: lang === "en" ? "Follow-up" : "फलो-अप",
      tab: "followup"
    },
    {
      icon: "💊",
      label: lang === "en" ? "Health History" : "स्वास्थ्य इतिहास",
      tab: "history"
    }
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 200
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: C.white,
          zIndex: 201,
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease"
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
            padding: "32px 20px 20px",
            color: "#fff"
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginBottom: 10
            }}
          >
            👤
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 800
            }}
          >
            {user?.name || "User"}
          </div>

          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.75)",
              marginTop: 2
            }}
          >
            {user?.district || "Nepal"}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "12px 0",
            overflowY: "auto"
          }}
        >
          {items.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setTab(item.tab);
                onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                textAlign: "left"
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  width: 28
                }}
              >
                {item.icon}
              </span>

              {item.label}
            </button>
          ))}

          <div
            style={{
              margin: "12px 16px",
              height: 1,
              background: C.border
            }}
          />

          <div style={{ padding: "8px 20px" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.textLight,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5
              }}
            >
              🌐 {lang === "en" ? "Language" : "भाषा"}
            </div>

            <div
              style={{
                display: "flex",
                background: C.bg,
                borderRadius: 10,
                padding: 3,
                gap: 3
              }}
            >
              {[
                ["en", "English"],
                ["ne", "नेपाली"]
              ].map(([languageCode, label]) => (
                <button
                  key={languageCode}
                  onClick={() => onLangChange(languageCode)}
                  style={{
                    flex: 1,
                    background:
                      lang === languageCode ? C.white : "transparent",
                    color:
                      lang === languageCode ? C.primary : C.textLight,
                    border: "none",
                    borderRadius: 8,
                    padding: "8px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid " + C.border
          }}
        >
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: C.redLight,
              color: C.red,
              border: "1px solid #FECACA",
              borderRadius: 10,
              padding: "12px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            🚪 {lang === "en" ? "Sign Out" : "साइन आउट"}
          </button>
        </div>
      </div>
    </>
  );
}