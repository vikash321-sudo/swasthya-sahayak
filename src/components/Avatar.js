export default function Av({ init, color, size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0
      }}
    >
      {init}
    </div>
  );
}