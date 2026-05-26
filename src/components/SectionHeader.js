import { C } from "../constants/colors";

export default function Sh({ title, action, onAction }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: C.text
        }}
      >
        {title}
      </span>

      {action && (
        <button
          onClick={onAction}
          style={{
            background: "none",
            border: "none",
            color: C.primary,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          {action} ›
        </button>
      )}
    </div>
  );
}