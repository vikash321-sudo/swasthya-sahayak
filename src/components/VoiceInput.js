import { useState, useRef } from "react";
import { C } from "../constants/colors";

export default function VoiceInput({ input, setInput, onSend, loading, lang }) {
  const [on, setOn] = useState(false);
  const recognitionRef = useRef(null);

  function start() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        lang === "ne"
          ? "तपाईंको browser ले voice input support गर्दैन।"
          : "Your browser does not support voice input."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = lang === "ne" ? "ne-NP" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setOn(true);
    };

    recognition.onend = () => {
      setOn(false);
    };

    recognition.onerror = (event) => {
      setOn(false);

      if (event.error === "language-not-supported") {
        const fallback = new SpeechRecognition();
        fallback.lang = "en-US";
        fallback.interimResults = false;
        fallback.continuous = false;

        fallback.onstart = () => setOn(true);
        fallback.onend = () => setOn(false);
        fallback.onerror = () => setOn(false);

        fallback.onresult = (e) => {
          setInput(e.results[0][0].transcript);
        };

        recognitionRef.current = fallback;
        fallback.start();
      }
    };

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };

    recognition.start();
  }

  function stop() {
    recognitionRef.current?.stop();
    setOn(false);
  }

  return (
    <div>
      {on && (
        <div
          style={{
            marginBottom: 8,
            padding: "8px 14px",
            background: C.primaryLight,
            borderRadius: 10,
            fontSize: 12,
            color: C.primary,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span
            style={{
              animation: "vp 0.8s infinite",
              display: "inline-block"
            }}
          >
            🎤
          </span>
          {lang === "ne" ? "सुनिरहेको छु..." : "Listening..."}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center"
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={
            lang === "ne"
              ? "लक्षण बताउनुहोस्..."
              : "Describe your symptoms..."
          }
          style={{
            flex: 1,
            border: "1.5px solid " + (on ? C.primary : C.border),
            borderRadius: 24,
            padding: "11px 18px",
            fontSize: 14,
            fontFamily: "inherit",
            color: C.text,
            outline: "none",
            background: C.bg,
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = C.primary;
          }}
          onBlur={(e) => {
            if (!on) e.target.style.borderColor = C.border;
          }}
        />

        <button
          onClick={on ? stop : start}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            flexShrink: 0,
            background: on ? "#FEE2E2" : C.primaryLight,
            border: "2px solid " + (on ? C.red : C.primary),
            cursor: "pointer",
            fontSize: 19,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: on ? "vp 1s infinite" : "none"
          }}
        >
          {on ? "⏹" : "🎤"}
        </button>

        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            flexShrink: 0,
            background: input.trim() && !loading ? C.primary : C.border,
            border: "none",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}