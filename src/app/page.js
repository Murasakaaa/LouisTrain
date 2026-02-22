"use client";
import React, { useState, useEffect } from "react";
import "../style/HomePage.css";
import Button from "../components/commons/Button";
import Input from "../components/commons/Input";
import { ArrowLeftRight, ArrowDown } from "lucide-react";

export default function HomePage() {
  const [departs, setDeparts] = useState([]);

  useEffect(() => {
    fetch("/api/departs") // le fetch va appeler le fichier route.js qui est dans le dossier /api/departs
      .then((res) => res.json())
      .then((data) => setDeparts(data));
  }, []);

  return (
    <>
      <div className="home-page-container">
        <img
          src="/images/home-page.png"
          alt="une image de fond"
          id="home-page-bg"
        />
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
              <div className="aller-retour">
                <Input
                  type="text"
                  name="aller"
                  placeholder="Aller :"
                  darkInput={true}
                />
                <Input
                  type="text"
                  name="retour"
                  placeholder="Ajouter le retour +"
                  darkInput={true}
                />
              </div>
              <Button id="recherche-train" text="Rechercher des trains" />
            </form>
          </div>
        </div>
      </div>
      <div className="departs_info">
        <p className="text_info">Tous les départs</p>
        <ArrowDown color="white" />
      </div>
      <section>
        <h2>Départs de trains</h2>
        <ul>
          {departs.map((c) => (
            <li key={c._id} style={{ marginBottom: "10px" }}>
              {c.gare_depart} {c.gare_arrivee} {c.train.modele_train}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
