"use client";
import React, { useState } from "react";
import { Train, ChevronUp, ChevronDown, X, Calendar } from "lucide-react";
import Button from "./commons/Button";
import "../style/components/trainCard.css";
import { useRouter } from "next/navigation";

// Calcul de la durée du trajet
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
  date,
  nb_place_restantes,
  prix,
  optionsDispo,
  sens = "aller",
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Formattage de la date
  const dateObjet = new Date(date);
  const dateFormatee = dateObjet.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const duree = calculerDuree(heureD, heureA);

  // Ajouter une option sélectionnée dans l'array
  const toggleOption = (option) => {
    if (!selectedOptions.find((o) => o.nom === option.nom)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setShowDropdown(false);
  };

  // Supprimer une option
  const removeOption = (optionNom) => {
    setSelectedOptions(selectedOptions.filter((o) => o.nom !== optionNom));
  };

  // Ajouter au panier et rediriger
  const handleReserver = () => {
    const cartItem = {
      cartId: `${trainID}_${date}_${Date.now()}`,
      sens,        // ← ajout
      trainID,
      gareD,
      gareA,
      heureD,
      heureA,
      date,
      prix,
      selectedOptions,
    };

    const panierActuel = localStorage.getItem("panier");
    const panier = panierActuel ? JSON.parse(panierActuel) : [];

    panier.push(cartItem);
    localStorage.setItem("panier", JSON.stringify(panier));

    router.push("/panier");
  };

  return (
    <div className={`trainCard ${isOpen ? "open" : ""}`}>
      <div className="card-main-row">
        <div className="train-info">
          <span className="train-number">{trainID}</span>
          <div className="date-display">
            <Calendar size={12} />
            <span>{dateFormatee}</span>
          </div>
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

            <Button
              text="Réserver ce billet"
              onClick={handleReserver}
            />
          </div>
        </div>
      )}
    </div>
  );
}