"use client";
import React, { useState } from "react";
import { Train, ChevronUp, ChevronDown, X } from "lucide-react";
import Button from "./commons/Button";
import "@/style/components/trainCard.css";

const calculerDuree = (debut, fin) => {
  const [h1, m1] = debut.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);

  const totalMinutes = h2 * 60 + m2 - (h1 * 60 + m1);
  const heures = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0
    ? `${heures}h${minutes.toString().padStart(2, "0")}`
    : `${heures}h`;
};

export default function TrainCard({
  trainID,
  gareD,
  gareA,
  heureD,
  heureA,
  nb_place_restantes,
  prix,
  optionsDispo,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const duree = calculerDuree(heureD, heureA);
  const toggleOption = (option) => {
    if (!selectedOptions.find((o) => o.nom === option.nom)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setShowDropdown(false);
  };
  const removeOption = (optionNom) => {
    setSelectedOptions(selectedOptions.filter((o) => o.nom !== optionNom));
  };

  return (
    <div className={`trainCard ${isOpen ? "open" : ""}`}>
      <div className="card-main-row">
        <div className="train-info">
          <span className="train-tag">P</span>
          <span className="train-number">{trainID}</span>
        </div>

        <div className="journey-container">
          <div className="station-block">
            <span className="time">{heureD}</span>
            <span className="station-name">{gareD}</span>
          </div>

          <div className="journey-line">
            <div className="line"></div>
            <div className="icon-wrapper">
              <Train size={18} />
              <span className="duration">{duree}</span>
            </div>
            <div className="line"></div>
          </div>

          <div className="station-block">
            <span className="time">{heureA}</span>
            <span className="station-name">{gareA}</span>
          </div>
        </div>

        <div className="availability-tag">
          {nb_place_restantes} places disponibles
        </div>

        <div className="price-block">
          <span className="label">à partir de</span>
          <span className="amount">{prix}€</span>
        </div>

        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* --- SECTION OPTIONS --- */}
      {isOpen && (
        <div className="card-options-section">
          <hr className="divider" />
          <h3>Options</h3>

          <div className="options-controls">
            {/* Dropdown Noir */}
            <div className="dropdown-wrapper">
              <div
                className="custom-select"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                choisissez vos options <ChevronDown size={16} />
              </div>

              {showDropdown && (
                <ul className="options-menu">
                  {optionsDispo.map((opt, index) => (
                    <li key={index} onClick={() => toggleOption(opt)}>
                      <span>{opt.nom}</span>
                      <span>{opt.prix.$numberDecimal}€</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Affichage des options sélectionnées */}
            <div className="pills-container">
              {selectedOptions.map((opt, index) => (
                <div key={index} className="selected-option-pill">
                  {opt.nom} - {opt.prix.$numberDecimal}€
                  <X
                    size={14}
                    onClick={() => removeOption(opt.nom)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>

            <Button text="Choisir ma place" onClick={() => console.log(selectedOptions)}/>
          </div>
        </div>
      )}
    </div>
  );
}
