"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../style/HomePage.css";
import Button from "../components/commons/Button";
import Input from "../components/commons/Input";
import { ArrowLeftRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Fonctions de redirection
  const handleSearchWithFilters = (e) => {
    e.preventDefault();
    // On récupère les valeurs via FormData pour faire simple
    const formData = new FormData(e.currentTarget);
    const depart = formData.get("depart");
    const arrivee = formData.get("arrivee");
    const aller = formData.get("aller");

    // Redirection avec paramètres (ex: /calendrier?depart=Paris&arrivee=Lyon)
    router.push(
      `/calendrier?depart=${depart}&arrivee=${arrivee}&date=${aller}`,
    );
  };

  const handleSeeAllTrains = () => {
    // Redirection simple sans filtres
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
                />
              </div>
              <div className="aller-retour">
                <Input
                  type="date"
                  name="date"
                  darkInput={true}
                />
                <Input
                  type="text"
                  name="retour"
                  placeholder="Ajouter le retour +"
                  darkInput={true}
                />
              </div>

              {/* Bouton qui soumet le formulaire avec filtres */}
              <Button
                id="recherche-train"
                type="submit"
                text="Rechercher des trains"
              />
            </form>

            {/* Bouton pour voir tout les trains sans filtres */}
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
