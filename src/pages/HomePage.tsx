import React from "react";
import Form from "../components/Form";
import homePageImage from "/images/home-page.png";
import "../style/HomePage.css";
import Button from "../components/commons/Button";
import Input from "../components/commons/Input";
import { ArrowLeftRight  } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="home-page-container">
      <img src={homePageImage} alt="une image de fond" id="home-page-bg" />
      <div className="home-page-overlay"></div>
      <div className="home-page-center">
        <div className="home-page-top-text">
          <h2>Bienvenue à bord !</h2>
          <h1>Réservez votre voyage </h1>
          <h1>en <strong>quelques minutes.</strong></h1>
        </div>
        <div className="home-page-filters">
          <form>
            <div className="depart-arrivee">
              <Input type="text" name="depart" placeholder="Départ :" darkInput={true}/>
              <div className="icon">
                <ArrowLeftRight id="LeftRightArrow"/>
              </div>
              <Input type="text" name="arrivee" placeholder="Arrivée :" darkInput={true}/>
            </div>
            <div className="aller-retour">
              <Input type="text" name="aller" placeholder="Aller :" darkInput={true}/>
              <Input type="text" name="retour" placeholder="Ajouter le retour +" darkInput={true}/>
            </div>
            <Button id="recherche-train" text="Rechercher des trains"/>
          </form>
        </div>
      </div>
    </div>
  );
}
