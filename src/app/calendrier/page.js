"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../style/calendar.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "../../components/commons/Input";
import TrainCard from "../../components/trainCard";
import { ArrowLeftRight } from "lucide-react";

export default function Calendar() {
  const [hasReturn, setHasReturn] = useState(false);
  const [departs, setDeparts] = useState([]);
  const [retours, setRetours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dataForm, setDataForm] = useState({
    depart: "",
    arrivee: "",
    dateDepart: "",
    dateRetour: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams(); // pour récuperer les params dans l'url

  // Changement des inputs du formulaire
  const handleChange = ({ target: { name, value } }) => {
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  // Construction de l'URL avec les filtres
  const buildSearchUrl = () => {
    const params = new URLSearchParams();

    if (dataForm.depart) params.append("depart", dataForm.depart);
    if (dataForm.arrivee) params.append("arrivee", dataForm.arrivee);
    if (dataForm.dateDepart) params.append("date_depart", dataForm.dateDepart);
    if (hasReturn && dataForm.dateRetour)
      params.append("date_retour", dataForm.dateRetour);

    return `/calendrier?${params.toString()}`;
  };

  const handleUpdateSearch = () => {
    router.push(buildSearchUrl());
  };

  // Synchroniser les paramètres URL dans le state
  useEffect(() => {
    const depart = searchParams.get("depart") || "";
    const arrivee = searchParams.get("arrivee") || "";
    const dateDepart = searchParams.get("date_depart") || "";
    const dateRetour = searchParams.get("date_retour") || "";

    setDataForm({
      depart,
      arrivee,
      dateDepart,
      dateRetour,
    });

    setHasReturn(!!dateRetour);
  }, [searchParams]);

  // Fetch des données quand les paramètres changent
  useEffect(() => {
    const fetchDeparts = async () => {
      try {
        setIsLoading(true);

        const apiParams = new URLSearchParams(searchParams.toString());

        const response = await fetch(
          `/api/departs${
            apiParams.toString() ? `?${apiParams.toString()}` : ""
          }`,
        );

        const data = await response.json();

        setDeparts(data.aller || []);
        setRetours(data.retour || []);
      } catch (error) {
        console.error("Erreur fetch :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeparts();
  }, [searchParams]);

  // On vérifie si on a au moins un filtre
  const isFiltered = searchParams.has("depart") || searchParams.has("arrivee");

  return (
    <div className="calendar_container">
      <div className="filter_container">
        <div className="title">
          <h1>Calendrier des Trains</h1>
        </div>
        <div className="filters">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateSearch();
            }}
          >
            <div className="depart-arrivee">
              <Input
                type="text"
                name="depart"
                placeholder="Départ :"
                darkInput={true}
                onChange={handleChange}
                value={dataForm.depart}
              />
              <div className="icon">
                <ArrowLeftRight id="LeftRightArrow" />
              </div>
              <Input
                type="text"
                name="arrivee"
                placeholder="Arrivée :"
                darkInput={true}
                style={{ paddingLeft: "30px" }}
                onChange={handleChange}
                value={dataForm.arrivee}
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
                    name="dateDepart"
                    darkInput={true}
                    onChange={handleChange}
                    value={dataForm.dateDepart}
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
                      name="dateRetour"
                      darkInput={true}
                      onChange={handleChange}
                      value={dataForm.dateRetour}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              id="recherche-train"
              text="Mettre à jour la recherche"
              type="submit"
            />
          </form>
        </div>
      </div>

      <div className="all_trains_container">
        <h2>{isFiltered ? "Résultats :" : "Tous les départs :"}</h2>

        {/* ----------------- Aller ----------------- */}
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
                departId={item._id}
                gareD={item.gare_depart}
                gareA={item.gare_arrivee}
                heureD={item.heure_depart}
                heureA={item.heure_arrivee}
                date={item.date}
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

        {/* ----------------- Retour ----------------- */}
        {hasReturn && (
          <>
            <h2>Retour :</h2>
            <div className="trains_list">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Recherche des meilleurs trajets...</p>
                </div>
              ) : retours.length > 0 ? (
                retours.map((item) => (
                  <TrainCard
                    key={item._id}
                    departId={item._id}
                    trainID={item.train.modele_train}
                    gareD={item.gare_depart}
                    gareA={item.gare_arrivee}
                    heureD={item.heure_depart}
                    heureA={item.heure_arrivee}
                    date={item.date}
                    nb_place_restantes={item.train.nb_places_restantes}
                    prix={item.prix.$numberDecimal}
                    optionsDispo={item.options_disponibles}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p>Désolé, aucun retour ne correspond à vos critères.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
