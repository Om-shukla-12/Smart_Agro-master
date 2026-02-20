import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Dashboard.css";
import axiosInstance from "../utils/axiosInstance";
import SensorGraph from "../components/SensorGraphs";
import { isAuthenticated } from "../utils/authSession";
import { motion } from "framer-motion";
import gsap from "gsap";

function Dashboard() {
  const dashboardRef = useRef(null);
  const galleryStripRef = useRef(null);
  const suggestionsRef = useRef(null);
  const submitFormRef = useRef(null);
  const agricultureVisuals = [
    {
      src: "/image/home-agri-1-4k.jpg",
      title: "Irrigation and Field Readiness",
      caption: "Large-scale crop fields prepared with smart water planning.",
    },
    {
      src: "/image/home-agri-2-4k.jpg",
      title: "Soil Conservation in Action",
      caption: "Structured farming terrain for moisture retention and control.",
    },
    {
      src: "/image/home-agri-3-4k.jpg",
      title: "Connected Water Channels",
      caption: "Smart agriculture depends on precise water distribution networks.",
    },
    {
      src: "/image/home-agri-4-4k.jpg",
      title: "Healthy Crop Expansion",
      caption: "Field intelligence helps scale crop quality across seasons.",
    },
    {
      src: "/image/login-hero-4k.jpg",
      title: "Smart Farm Monitoring",
      caption: "Aerial views support better decisions using dashboard analytics.",
    },
    {
      src: "/image/register-hero-4k.jpg",
      title: "Data-Driven Agriculture",
      caption: "Combine sensors, insights, and automation for stronger yields.",
    },
  ];
  const keyMetrics = [
    { label: "Monitored Sensors", value: "03", note: "humidity, moisture, light" },
    { label: "Irrigation Response", value: "92%", note: "automation success rate" },
    { label: "Suggested Crops", value: "02+", note: "season-aware recommendations" },
  ];

  const [cropData, setCropData] = useState({
    crop: "",
    cultivationDate: "",
    quantity: "",
    description: "",
  });
  const [suggestedCrops, setSuggestedCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollGallery = (direction) => {
    if (!galleryStripRef.current) return;
    const moveBy = Math.min(540, Math.max(360, galleryStripRef.current.clientWidth * 0.55));
    galleryStripRef.current.scrollBy({
      left: direction === "left" ? -moveBy : moveBy,
      behavior: "smooth",
    });
  };

  const scrollToSection = (sectionRef) => {
    const target = sectionRef.current;
    if (!target) return;

    const lenisInstance = window.__smartAgroLenis;
    if (lenisInstance && typeof lenisInstance.scrollTo === "function") {
      lenisInstance.scrollTo(target, {
        offset: -90,
        duration: 1,
      });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fetchSensorData = useCallback(async () => {
    try {
      await axiosInstance.get("/sensor-data");
      suggestCrops();
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  }, []);

  const suggestCrops = () => {
    const month = new Date().getMonth();
    const crops = [];
    if (month === 11 || month === 0) {
      crops.push({
        name: "Wheat",
        reason:
          "Wheat grows well in cooler temperatures and requires moderate moisture.",
      });
    } else {
      crops.push({
        name: "Corn",
        reason: "Corn thrives in warm weather with moderate soil moisture.",
      });
    }
    setSuggestedCrops(crops);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/records", cropData);
      alert("Crop record added successfully!");
      setCropData({
        crop: "",
        cultivationDate: "",
        quantity: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding crop record:", error);
      alert("Failed to add crop record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, [fetchSensorData]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(".dashboard-title", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.from(".dashboard-section", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.12,
        ease: "power2.out",
      });
    }, dashboardRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return undefined;

    const currentPath = "/dashboard";
    const blockRouteBackNavigation = () => {
      if (window.location.pathname === currentPath) return;
      window.history.pushState(null, "", currentPath);
    };

    window.addEventListener("popstate", blockRouteBackNavigation);

    return () => {
      window.removeEventListener("popstate", blockRouteBackNavigation);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-container" ref={dashboardRef}>
        <section className="dashboard-hero dashboard-section">
          <div className="hero-copy">
            <p className="hero-eyebrow">Precision Agriculture Intelligence</p>
            <h1 className="dashboard-title">🌱 Smart Agriculture Dashboard</h1>
            <p className="hero-subtext">
              Track sensors, monitor crop conditions, and automate field decisions with a
              single real-time control center.
            </p>
            <div className="hero-cta-group">
              <button type="button" className="hero-cta" onClick={() => scrollToSection(suggestionsRef)}>
                View Crop Suggestions
              </button>
              <button type="button" className="hero-cta hero-cta-ghost" onClick={() => scrollToSection(submitFormRef)}>
                Submit Field Data
              </button>
            </div>
          </div>
          <div className="hero-stat-grid">
            {keyMetrics.map((metric) => (
              <motion.div
                key={metric.label}
                className="hero-stat-card"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                <p className="hero-stat-value">{metric.value}</p>
                <p className="hero-stat-label">{metric.label}</p>
                <span className="hero-stat-note">{metric.note}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="dashboard-sections">
          <section className="agri-gallery-section dashboard-section">
            <div className="section-top-row">
              <div>
                <h2>📸 Smart Agriculture Visuals</h2>
                <p className="agri-gallery-subtitle">
                  Side-scroll through high-resolution farm visuals and smart agriculture scenes.
                </p>
              </div>
            </div>
            <div className="agri-scroll-shell">
              <button
                type="button"
                className="side-scroll-btn side-scroll-left"
                onClick={() => scrollGallery("left")}
                aria-label="Scroll images left"
              >
                ◀
              </button>
              <div className="agri-side-scroll" ref={galleryStripRef}>
                {agricultureVisuals.map((visual) => (
                  <motion.figure
                    key={visual.src}
                    className="agri-visual-card"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  >
                    <img src={visual.src} alt={visual.title} className="agri-visual-image" loading="lazy" />
                    <figcaption className="agri-visual-caption">
                      <h3>{visual.title}</h3>
                      <p>{visual.caption}</p>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
              <button
                type="button"
                className="side-scroll-btn side-scroll-right"
                onClick={() => scrollGallery("right")}
                aria-label="Scroll images right"
              >
                ▶
              </button>
            </div>
          </section>

          <section className="graphs-section dashboard-section" id="sensor-graphs">
            <h2>📊 Sensor Graphs</h2>
            <div className="graphs-grid">
              <motion.div
                className="graph-container"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                <SensorGraph sensorType="Air Humidity" />
              </motion.div>
              <motion.div
                className="graph-container"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                <SensorGraph sensorType="Soil Moisture" />
              </motion.div>
              <motion.div
                className="graph-container"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                <SensorGraph sensorType="Light Intensity" />
              </motion.div>
            </div>
          </section>

          <section className="suggestions-section dashboard-section" id="crop-suggestions" ref={suggestionsRef}>
            <h2>🌾 Crop Suggestions</h2>
            <div className="crop-card-grid">
              {suggestedCrops.length > 0 ? (
                suggestedCrops.map((crop, index) => (
                  <motion.div
                    key={index}
                    className="crop-card"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <h3>{crop.name}</h3>
                    <p>{crop.reason}</p>
                  </motion.div>
                ))
              ) : (
                <p>No crop suggestions available at the moment.</p>
              )}
            </div>
          </section>

          <section className="form-section dashboard-section" id="submit-crop-data" ref={submitFormRef}>
            <h2>📝 Submit Crop Data</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="crop"
                placeholder="Crop Name"
                value={cropData.crop}
                onChange={(e) =>
                  setCropData({ ...cropData, crop: e.target.value })
                }
                required
              />
              <input
                type="date"
                name="cultivationDate"
                value={cropData.cultivationDate}
                onChange={(e) =>
                  setCropData({ ...cropData, cultivationDate: e.target.value })
                }
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity (kg)"
                value={cropData.quantity}
                onChange={(e) =>
                  setCropData({ ...cropData, quantity: e.target.value })
                }
                required
              />
              <textarea
                name="description"
                placeholder="Additional Notes"
                value={cropData.description}
                onChange={(e) =>
                  setCropData({ ...cropData, description: e.target.value })
                }
                required
              ></textarea>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
