import { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { C } from "../../constants/colors";

export default function PharmacyRequestsPanel({ lang }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const statusOptions = [
    "pending",
    "contacted",
    "confirmed",
    "ready",
    "completed",
    "cancelled"
  ];

  async function loadRequests() {
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase
        .from("medicine_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setRequests(data || []);
    } catch (err) {
      setErrorMsg(
        err?.message ||
          (lang === "en"
            ? "Could not load medicine requests."
            : "Medicine requests लोड गर्न सकिएन।")
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id, status) {
    setUpdatingId(id);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("medicine_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (err) {
      setErrorMsg(
        err?.message ||
          (lang === "en"
            ? "Could not update request status."
            : "Request status update गर्न सकिएन।")
      );
    }

    setUpdatingId("");
  }

  function statusStyle(status) {
    if (status === "completed") {
      return { bg: C.greenLight, color: C.green };
    }

    if (status === "cancelled") {
      return { bg: C.redLight, color: C.red };
    }

    if (status === "confirmed" || status === "ready") {
      return { bg: C.primaryLight, color: C.primary };
    }

    return { bg: C.orangeLight, color: C.orange };
  }

  return (
    <div>
      <div
        style={{
          background: C.white,
          border: "1px solid " + C.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 14,
          boxShadow: C.shadow
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            color: C.text,
            marginBottom: 4
          }}
        >
          {lang === "en" ? "Medicine Requests" : "औषधि अनुरोधहरू"}
        </div>

        <div
          style={{
            fontSize: 12,
            color: C.textLight,
            lineHeight: 1.5,
            marginBottom: 12
          }}
        >
          {lang === "en"
            ? "Review user medicine requests and update status after checking availability."
            : "User medicine requests हेर्नुहोस् र availability जाँचेर status update गर्नुहोस्।"}
        </div>

        <button
          onClick={loadRequests}
          disabled={loading}
          style={{
            background: C.primaryLight,
            color: C.primary,
            border: "1px solid #BFDBFE",
            borderRadius: 10,
            padding: "9px 12px",
            fontSize: 12,
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit"
          }}
        >
          {loading
            ? lang === "en"
              ? "Refreshing..."
              : "Refresh हुँदैछ..."
            : lang === "en"
            ? "Refresh Requests"
            : "Requests refresh गर्नुहोस्"}
        </button>
      </div>

      {errorMsg && (
        <div
          style={{
            background: C.redLight,
            border: "1px solid #FECACA",
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 12,
            color: C.red,
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: 12
          }}
        >
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div
          style={{
            background: C.white,
            border: "1px solid " + C.border,
            borderRadius: 14,
            padding: 20,
            textAlign: "center",
            color: C.textLight,
            fontSize: 13
          }}
        >
          {lang === "en" ? "Loading medicine requests..." : "Medicine requests लोड हुँदैछ..."}
        </div>
      ) : requests.length === 0 ? (
        <div
          style={{
            background: C.white,
            border: "1px solid " + C.border,
            borderRadius: 14,
            padding: 24,
            textAlign: "center",
            boxShadow: C.shadow
          }}
        >
          <div style={{ fontSize: 34, marginBottom: 8 }}>💊</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: C.text,
              marginBottom: 4
            }}
          >
            {lang === "en" ? "No medicine requests yet" : "औषधि अनुरोध छैन"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.textLight,
              lineHeight: 1.5
            }}
          >
            {lang === "en"
              ? "New user medicine requests will appear here."
              : "नयाँ user medicine requests यहाँ देखिनेछन्।"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map((request) => {
            const s = statusStyle(request.status);

            return (
              <div
                key={request.id}
                style={{
                  background: C.white,
                  border: "1px solid " + C.border,
                  borderRadius: 16,
                  padding: 15,
                  boxShadow: C.shadow
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 10
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 900,
                        color: C.text,
                        marginBottom: 4
                      }}
                    >
                      {request.medicine_name}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: C.textLight,
                        lineHeight: 1.5
                      }}
                    >
                      {request.patient_name || "User"} · {request.request_type}
                    </div>
                  </div>

                  <span
                    style={{
                      background: s.bg,
                      color: s.color,
                      borderRadius: 20,
                      padding: "5px 9px",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "capitalize",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {request.status}
                  </span>
                </div>

                <div
                  style={{
                    background: C.bg,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                    fontSize: 12,
                    color: C.textMid,
                    lineHeight: 1.65
                  }}
                >
                  <div>
                    <strong>{lang === "en" ? "Type" : "Type"}:</strong>{" "}
                    {request.medicine_type}
                  </div>
                  <div>
                    <strong>{lang === "en" ? "Address" : "Address"}:</strong>{" "}
                    {request.address}
                  </div>
                  <div>
                    <strong>{lang === "en" ? "Note" : "Note"}:</strong>{" "}
                    {request.prescription_note || "—"}
                  </div>
                  <div>
                    <strong>{lang === "en" ? "Requested" : "Requested"}:</strong>{" "}
                    {new Date(request.created_at).toLocaleString(
                      lang === "ne" ? "ne-NP" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8
                  }}
                >
                  {statusOptions.map((status) => {
                    const active = request.status === status;

                    return (
                      <button
                        key={status}
                        onClick={() => updateStatus(request.id, status)}
                        disabled={updatingId === request.id || active}
                        style={{
                          background: active ? C.primary : C.bg,
                          color: active ? "#fff" : C.textMid,
                          border:
                            "1px solid " + (active ? C.primary : C.border),
                          borderRadius: 10,
                          padding: "9px 6px",
                          fontSize: 11,
                          fontWeight: 800,
                          cursor:
                            updatingId === request.id || active
                              ? "not-allowed"
                              : "pointer",
                          fontFamily: "inherit",
                          textTransform: "capitalize",
                          opacity: updatingId === request.id ? 0.65 : 1
                        }}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}