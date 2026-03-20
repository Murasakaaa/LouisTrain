"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../style/HomePage.css";
import Button from "../components/commons/Button";
import Input from "../components/commons/Input";
import { ArrowLeftRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [hasReturn, setHasReturn] = useState(false); // gestion du retour

  const handleSearchWithFilters = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const depart = formData.get("depart");
    const arrivee = formData.get("arrivee");
    const dateDepart = formData.get("date_depart");

    // On ne récupère la date de retour que si la case est cochée
    const dateRetour = hasReturn ? formData.get("date_retour") : "";

    // Redirection en ignorant le retour s'il n'y en a pas
    router.push(
      `/calendrier?depart=${depart}&arrivee=${arrivee}&date_depart=${dateDepart}${hasReturn && dateRetour ? `&date_retour=${dateRetour}` : ""}`
    );
  };

  const handleSeeAllTrains = () => {
    router.push("/calendrier");
  };

  return (
    <>
      <div className="home-page-container">
        <img src="/images/home-page.png" alt="fond" id="home-page-bg" />
        <div className="home-page-overlay"></div>
        <div className="home-page-center">
          <div className="home-page-top-text">
            <h2>Bienvenue à bord !</h2>
            <h1>Réservez votre voyage </h1>
            <h1>
              en <strong>quelques minutes.</strong>
            </h1>
          </div>

          <div className="home-page-filters">
            <form onSubmit={handleSearchWithFilters}>
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
                  style={{ paddingLeft: "30px" }}
                />
              </div>

              <div className="aller-retour-wrapper">
                <div className="aller-retour">
                  <Input
                    type="date"
                    name="date_depart"
                    darkInput={true}
                    style={{
                      width: hasReturn ? "50%" : "100%",
                      borderTopRightRadius: hasReturn ? "0" : "1em",
                      borderBottomRightRadius: hasReturn ? "0" : "1em",
                      transition: "all 0.3s ease"
                    }}
                  />

                  {hasReturn && (
                    <div className="return-input-container">
                      <Input
                        type="date"
                        name="date_retour"
                        darkInput={true}
                        style={{
                          width: "100%",
                          borderTopLeftRadius: "0",
                          borderBottomLeftRadius: "0"
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* La Checkbox pour signaler qu'on souhaite avoir le retour*/}
                <label className="checkbox-container-home">
                  <input
                    type="checkbox"
                    checked={hasReturn}
                    onChange={(e) => setHasReturn(e.target.checked)}
                  />
                  <span>Ajouter un retour ?</span>
                </label>
              </div>

              <Button
                id="recherche-train"
                type="submit"
                text="Rechercher des trains"
              />
            </form>

            <div className="btn_scroll">
              <Button
                id="btn-voir-departs"
                onClick={handleSeeAllTrains}
                text="Voir tous les trains"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}