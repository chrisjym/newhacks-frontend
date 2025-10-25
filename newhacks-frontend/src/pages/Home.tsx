import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  const handleSubmit = () => {
    if (city.trim()) {
      navigate("/planner");
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <span style={styles.logoText}>Travel Al-gent</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>
              Features
            </a>
            <a href="#how-it-works" style={styles.navLink}>
              How It Works
            </a>
            <a href="#about" style={styles.navLink}>
              About
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Discover Hidden Gems in{" "}
              <span style={styles.highlight}>Every City</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Enter any city and we'll create a personalized itinerary with the
              best local spots, avoiding tourist traps and finding the most
              condensed areas of interest.
            </p>

            {/* Search Section */}
            <div style={styles.searchSection}>
              <div style={styles.searchContainer}>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter a city (e.g., Tokyo, Paris, New York)"
                    style={styles.input}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <div style={styles.searchIcon}>🔍</div>
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    ...styles.ctaButton,
                    ...(city.trim()
                      ? styles.ctaButtonActive
                      : styles.ctaButtonDisabled),
                  }}
                  disabled={!city.trim()}
                >
                  Explore
                </button>
              </div>

              {city && (
                <div style={styles.preview}>
                  <span style={styles.previewText}>Ready to explore:</span>
                  <span style={styles.cityName}> {city}</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div style={styles.features}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🗺️</div>
                <h3 style={styles.featureTitle}>Smart Mapping</h3>
                <p style={styles.featureDesc}>
                  Finds the most condensed areas to minimize travel time
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⭐</div>
                <h3 style={styles.featureTitle}>Local Favorites</h3>
                <p style={styles.featureDesc}>
                  Discover spots loved by locals, not just tourists
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🚶</div>
                <h3 style={styles.featureTitle}>Walkable Routes</h3>
                <p style={styles.featureDesc}>
                  Everything within comfortable walking distance
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Fixed Styles - No Black Space
const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    margin: 0,
    padding: 0,
    width: "100vw",
    overflowX: "hidden" as "hidden",
  },
  navbar: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    padding: "1.5rem 0",
    width: "100vw",
    margin: 0,
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    width: "100%",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontSize: "1.8rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navLinks: {
    display: "flex",
    gap: "2.5rem",
  },
  navLink: {
    textDecoration: "none",
    color: "#4a5568",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "color 0.3s ease",
  },
  hero: {
    paddingTop: "140px",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    margin: 0,
    padding: "0",
  },
  heroContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 2rem",
    textAlign: "center" as "center",
    width: "100%",
  },
  heroText: {
    width: "100%",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "white",
    marginBottom: "2rem",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  highlight: {
    background: "linear-gradient(45deg, #ffd89b, #19547b)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.3rem",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: "1.6",
    marginBottom: "3rem",
    maxWidth: "700px",
    margin: "0 auto 3rem auto",
    fontWeight: "400",
  },
  searchSection: {
    marginBottom: "4rem",
    width: "100%",
  },
  searchContainer: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    width: "100%",
  },
  inputWrapper: {
    position: "relative" as "relative",
    flex: "1",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "1.5rem 1.5rem 1.5rem 3.5rem",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    fontWeight: "500",
    boxSizing: "border-box" as "border-box",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    color: "#2d3748",
  },
  searchIcon: {
    position: "absolute" as "absolute",
    left: "1.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.3rem",
    color: "#667eea",
  },
  ctaButton: {
    padding: "1.5rem 2.5rem",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap" as "nowrap",
    minWidth: "140px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  },
  ctaButtonActive: {
    background: "linear-gradient(45deg, #ff7e5f, #feb47b)",
    color: "white",
  },
  ctaButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    color: "rgba(0, 0, 0, 0.3)",
    cursor: "not-allowed",
  },
  preview: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1.2rem 2rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    border: "none",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
  previewText: {
    color: "#4a5568",
    fontWeight: "600",
    fontSize: "1.1rem",
  },
  cityName: {
    color: "#667eea",
    fontWeight: "800",
    fontSize: "1.2rem",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
    maxWidth: "1000px",
    margin: "0 auto",
    width: "100%",
  },
  featureCard: {
    textAlign: "center" as "center",
    padding: "2rem 1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
  },
  featureTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "white",
    marginBottom: "1rem",
  },
  featureDesc: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: "1.5",
  },
};

export default Home;
