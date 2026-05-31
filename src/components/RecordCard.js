import { C } from "../constants/colors";

export default function RecordCard({
  icon,
  title,
  subtitle,
  meta,
  status,
  amount,
  lang
}) {
  const statusColor =
    status === "completed"
      ? C.green
      : status === "cancelled"
      ? C.red
      : status === "confirmed"
      ? C.primary
      : C.orange;

  const statusBg =
    status === "completed"
      ? C.greenLight
      : status === "cancelled"
      ? C.redLight
      : status === "confirmed"
      ? C.primaryLight
      : C.orangeLight;

  return (
    <div
      style={{
        background: C.white,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        border: "1px solid " + C.border,
        boxShadow: C.shadow
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: C.text,
              marginBottom: 3
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 12,
              color: C.textLight,
              marginBottom: 6
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              fontSize: 11,
              color: C.textMid
            }}
          >
            {meta}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <span
            style={{
              background: statusBg,
              color: statusColor,
              borderRadius: 20,
              padding: "4px 8px",
              fontSize: 10,
              fontWeight: 900,
              textTransform: "capitalize"
            }}
          >
            {status || "pending"}
          </span>

          {amount && (
            <div
              style={{
                fontSize: 12,
                color: C.text,
                fontWeight: 900,
                marginTop: 8
              }}
            >
              {amount}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          background: C.bg,
          borderRadius: 10,
          padding: "8px 10px",
          fontSize: 11,
          color: C.textMid,
          lineHeight: 1.5
        }}
      >
        {lang === "en"
          ? "Status will update after partner confirmation."
          : "Partner confirmation पछि status update हुनेछ।"}
      </div>
    </div>
  );
}