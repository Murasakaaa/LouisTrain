"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../style/calendar.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "@/components/commons/Input";
import TrainCard from "@/components/trainCard";
import { ArrowLeftRight } from "lucide-react";

export default function Calendar() {
  const [hasReturn, setHasReturn] = useState(false);
  const [departs, setDeparts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams(); // pour récuperer les params dans l'url

  const handleUpdateSearch = (e) => {
    e.preventDefault();

    // On récupère les données du formulaire
    const formData = new FormData(e.currentTarget);
    const depart = formData.get("depart");
    const arrivee = formData.get("arrivee");
    const dateDepart = formData.get("date_départ");
    const dateRetour = formData.get("date_retour");

    // On construit la nouvelle URL avec les nouveaux filtres
    let newUrl = `/calendar?depart=${depart}&arrivee=${arrivee}&date_depart=${dateDepart}`;

    if (hasReturn && dateRetour) {
      newUrl += `&date_retour=${dateRetour}`;
    }

    router.push(newUrl);
  };

  useEffect(() => {
    setIsLoading(true);

    const depart = searchParams.get("depart");
    const arrivee = searchParams.get("arrivee");
    const dateD = searchParams.get("date_depart");
    const dateR = searchParams.get("date_retour");

    let apiUrl = "/api/departs";

    // Si on a des filtres dans l'URL, on les ajoute à l'appel API
    // if (depart || arrivee) {
    //   apiUrl += `?gare_depart=${depart}&gare_arrivee=${arrivee}`;
    // }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setDeparts(data);
        setIsLoading(false);
      })
      .catch((err) => console.error("Erreur fetch:", err));
  }, [searchParams]);

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

                {/* Checkbox pour activer le retour dans la recherche */}
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={hasReturn}
                    onChange={(e) => setHasReturn(e.target.checked)}
                  />
                  <span>Retour ?</span>
                </label>
              </div>

              {/* si le client coche la case retour, on affiche cela*/}
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
        <h2>{isFiltered ? "Résultats :" : "Tous les départs :"}</h2>

        <div className="trains_list">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Recherche des meilleurs trajets...</p>
            </div>
          ) : departs.length > 0 ? (
            departs.map((item) => (
              <TrainCard
                key={item._id}
                trainID={item.train.modele_train}
                gareD={item.gare_depart}
                gareA={item.gare_arrivee}
                heureD={item.heure_depart}
                heureA={item.heure_arrivee}
                nb_place_restantes={item.train.nb_places_restantes}
                prix={item.prix.$numberDecimal}
                optionsDispo={item.options_disponibles}
              />
            ))
          ) : (
            <div className="no-results">
              <p>Désolé, aucun départ ne correspond à vos critères.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
