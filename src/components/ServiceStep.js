import { C } from "../constants/colors";

export default function ServiceStep({ number, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start"
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: C.primary,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0
        }}
      >
        {number}
      </div>

      <div
        style={{
          fontSize: 13,
          color: C.text,
          lineHeight: 1.6,
          paddingTop: 2
        }}
      >
        {text}
      </div>
    </div>
  );
}