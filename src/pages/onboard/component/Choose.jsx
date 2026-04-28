import { useEffect, useState } from "react";
import { client } from "../../../services/sanity/sanityClient";

const colors = {
  greenDark: "#1a3a2a",
  greenMid: "#2d6a4f",
  greenLight: "#52b788",
  cream: "#faf7f2",
  gold: "#c8a96e",
  muted: "#6b7c72",
};

const iconFor = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("customer") || l.includes("client")) return "👥";
  if (l.includes("product") || l.includes("item")) return "🌿";
  if (l.includes("deliver") || l.includes("order")) return "📦";
  if (l.includes("farm") || l.includes("partner")) return "🌾";
  if (l.includes("year") || l.includes("experience")) return "🕰️";
  return "✦";
};

const Skeleton = () => (
  <div
    style={{
      backgroundColor: colors.cream,
      backgroundImage: `radial-gradient(circle at 15% 85%, rgba(82,183,136,0.08) 0%, transparent 55%),
        radial-gradient(circle at 85% 15%, rgba(200,169,110,0.07) 0%, transparent 50%)`,
      width: "100%",
      padding: "5rem 1.5rem",
    }}
  >
    <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            height: "0.75rem",
            width: "6rem",
            borderRadius: "4px",
            backgroundColor: "rgba(82,183,136,0.3)",
          }}
        />
        <div
          style={{
            height: "2.5rem",
            width: "18rem",
            borderRadius: "4px",
            backgroundColor: "rgba(82,183,136,0.2)",
          }}
        />
        <div
          style={{
            height: "2px",
            width: "3rem",
            borderRadius: "4px",
            backgroundColor: "rgba(82,183,136,0.3)",
          }}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "9rem",
              width: "10rem",
              borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(82,183,136,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const StatCard = ({ stat, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
        padding: "2rem 2.5rem",
        minWidth: "130px",
        background: "#fff",
        border: "1px solid rgba(82,183,136,0.18)",
        borderRadius: "2px",
        boxShadow: hovered
          ? "0 16px 48px rgba(26,58,42,0.12)"
          : "0 2px 32px rgba(26,58,42,0.06)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        overflow: "hidden",
        animation: `fadeUp 0.65s ease both`,
        animationDelay: `${0.15 + index * 0.13}s`,
      }}
    >
      {/* top gradient bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${colors.greenLight}, ${colors.gold})`,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.45s ease",
        }}
      />
      <span style={{ fontSize: "1.4rem", marginBottom: "0.25rem", opacity: 0.6 }}>
        {iconFor(stat.label)}
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 600,
          lineHeight: 1,
          color: colors.greenMid,
          letterSpacing: "-0.02em",
        }}
      >
        {stat.value}
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 400,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.muted,
        }}
      >
        {stat.label}
      </span>
    </div>
  );
};

const Choose = () => {
  const [whyChooseFarm2Home, setWhyChooseFarm2Home] = useState([]);
  const [loading, setLoading] = useState(true);

  /* inject keyframe animation once */
  useEffect(() => {
    const id = "choose-keyframes";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    client
      .fetch('*[_type == "whyChooseFarm2Home"] | order(_createdAt asc)')
      .then((data) => {
        setWhyChooseFarm2Home(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (!whyChooseFarm2Home.length) return null;

  return (
    <>
      {whyChooseFarm2Home.map((item, index) => (
        <section
          key={index}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            backgroundColor: colors.cream,
            backgroundImage: `radial-gradient(circle at 15% 85%, rgba(82,183,136,0.08) 0%, transparent 55%),
              radial-gradient(circle at 85% 15%, rgba(200,169,110,0.07) 0%, transparent 50%)`,
            width: "100%",
            padding: "1rem 1.5rem",
            margin: "1.5rem 0",
          }}
        >
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1rem",
                marginBottom: "3.5rem",
                animation: "fadeUp 0.7s ease both",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: colors.greenLight,
                }}
              >
                Our Promise
              </span>

              {/* Divider leaf */}
              <div
                style={{
                  width: "48px",
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${colors.greenLight}, transparent)`,
                  margin: "0 auto",
                }}
              />

              {item.subtitle && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: colors.muted,
                    maxWidth: "28rem",
                    lineHeight: 1.6,
                    marginTop: "0.25rem",
                  }}
                >
                  {item.subtitle}
                </p>
              )}
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1.25rem",
              }}
            >
              {(item.statistics?.length
                ? item.statistics
                : [{ value: "2000+", label: "Happy Customers" }, { value: "150+", label: "Farm Partners" },{ value: "50+", label: "Fresh Products" }]
              ).map((stat, statIndex) => (
                <StatCard key={statIndex} stat={stat} index={statIndex} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default Choose;