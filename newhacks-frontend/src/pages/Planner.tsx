import React, { useState } from "react";
import InteractiveMap from "./Map";
import { useNavigate } from "react-router-dom";
import "./Planner.css";

export default function Map() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header Bar */}
        <div className="header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div>
            <h1 style={{ margin: "0.5vw", fontSize: "1.5rem" }}>
              Watching: Paris
            </h1>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <InteractiveMap />
        </div>
      </div>
    </>
  );
}
