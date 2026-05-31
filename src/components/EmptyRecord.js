import { C } from "../constants/colors";

export default function EmptyRecord({ icon, title, desc }) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 14,
        padding: 24,
        textAlign: "center",
        border: "1px solid " + C.border,
        boxShadow: C.shadow
      }}
    >
      <div style={{ fontSize: 34, marginBottom: 8 }}>{icon}</div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
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
  );
}