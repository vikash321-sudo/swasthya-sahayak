import {
  Home,
  Stethoscope,
  MessageCircle,
  LayoutGrid,
  UserRound
} from "lucide-react";

import { C } from "../constants/colors";

export default function NavBar({ tab, setTab, lang }) {
  const L = {
    en: ["Home", "Symptoms", "Chat", "Services", "Doctors"],
    ne: ["घर", "लक्षण", "सहायक", "सेवा", "डाक्टर"]
  };

  const items = [
    { id: "home", Icon: Home },
    { id: "check", Icon: Stethoscope },
    { id: "chat", Icon: MessageCircle },
    { id: "services", Icon: LayoutGrid },
    { id: "doctors", Icon: UserRound }
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background: C.white,
        borderTop: "1px solid " + C.border,
        display: "flex",
        zIndex: 100,
        boxShadow: "0 -1px 8px rgba(0,0,0,0.06)"
      }}
    >
      {items.map((item, index) => {
        const active = tab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1,
              padding: "8px 2px 10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              borderTop: "2px solid " + (active ? C.primary : "transparent")
            }}
          >
            <item.Icon
              size={20}
              color={active ? C.primary : C.textLight}
              strokeWidth={active ? 2.8 : 2.1}
            />

            <span
              style={{
                fontSize: 9,
                fontWeight: active ? 700 : 500,
                color: active ? C.primary : C.textLight,
                fontFamily: "inherit"
              }}
            >
              {L[lang][index]}
            </span>
          </button>
        );
      })}
    </div>
  );
}