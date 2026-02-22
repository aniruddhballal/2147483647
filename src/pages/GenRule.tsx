import { useNavigate } from "react-router-dom";
import RuleGenerator from "../components/RuleGenerator";

export default function GenRule() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#0b0b0f",
      fontFamily: "'Sora', sans-serif",
    }}>
      {/* Back button — top left */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "999px",
          color: "#fff",
          fontFamily: "'Sora', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          padding: "8px 18px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        }}
      >
        ← BACK
      </button>

      {/* RuleGenerator fills the page */}
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <RuleGenerator />
      </div>
    </div>
  );
}