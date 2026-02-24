"use client";
import React, { useState, useEffect} from "react";
import { useSearchParams } from "next/navigation"; // 1. Import pour lire l'URL
import "../../style/calendar.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "../../components/commons/Input";
import { ArrowLeftRight } from "lucide-react";

export default function Calendar() {
  const [hasReturn, setHasReturn] = useState(false);
  const [departs, setDeparts] = useState([]);

  useEffect(() => {
      fetch("") // le fetch va appeler le fichier route.js qui est dans le dossier /api/client
        .then((res) => res.json())
        .then((data) => setDeparts(data));
    }, []);
    
  // 2. Initialisation des paramètres de recherche
  const searchParams = useSearchParams();

  // On vérifie si on a au moins un critère de recherche
  const isFiltered = searchParams.has("depart") || searchParams.has("arrivee");

  return (
    <div className="calendar_container">
      <div className="filter_container">
        <div className="title">
          <h1>Calendrier des Trains</h1>
        </div>
        <div className="filters">
          <form>
            <div className="depart-arrivee">
              <Input
                type="text"
                name="depart"
                placeholder="Départ :"
                darkInput={true}
              />
              <div className="icon">
                <ArrowLeftRight id="LeftRightArrow" />
              </div>
              <Input
                type="text"
                name="arrivee"
                placeholder="Arrivée :"
                darkInput={true}
              />
            </div>

            <div className="aller-retour-calendar">
              <div className="date-group">
                {/* Groupe Date de départ */}
                <div className="input-with-label">
                  <label htmlFor="date_départ">Date de départ</label>
                  <Input
                    type="date"
                    id="date_départ"
                    name="date_départ"
                    darkInput={true}
                  />
                </div>

                {/* Checkbox décalée vers le bas pour s'aligner avec l'input */}
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={hasReturn}
                    onChange={(e) => setHasReturn(e.target.checked)}
                  />
                  <span>Retour ?</span>
                </label>
              </div>

              {/* Groupe Date de retour (Conditionnel) */}
              {hasReturn && (
                <div className="return-input-animate">
                  <div className="input-with-label">
                    <label htmlFor="date_retour">Date de retour</label>
                    <Input
                      type="date"
                      id="date_retour"
                      name="date_retour"
                      darkInput={true}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button id="recherche-train" text="Mettre à jour la recherche" />
          </form>
        </div>
      </div>

      <div className="all_trains_container">
        {/* 3. Condition d'affichage du titre */}
        <h2>
          {isFiltered
            ? "Résultats de la recherche:"
            : "Tous les départs disponibles:"}
        </h2>
        {/*si il n'y a pas de résultat on affichera un texte par défaut*/}
        {departs.length > 0 ? "test" : "Aucun départs"}
      </div>
    </div>
  );
}
