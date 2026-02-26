"use client";
import React, { useState, useEffect } from "react";
import "../../style/paiement.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "@/components/commons/Input";
import { ArrowLeftRight } from "lucide-react";

export default function Paiement() {
  return (
    <div className="paiement-container">
      <div className="title">
        <h1>Procéder au paiement</h1>
      </div>

      <div className="forms">
        <div className="left-forms">
          <div className="card">
            <h3>Votre adresse mail</h3>
            <div className="form-group">
              <label htmlFor="email">EMAIL</label>
              <Input id="email" placeholder="example@exemple.com" type="email" name="email" />
            </div>
          </div>

          <div className="card">
            <h3>Paiement</h3>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="nom">NOM TITULAIRE CARTE</label>
                <Input id="nom" placeholder="Esteves" type="text" name="nom" />
              </div>

              <div className="form-group">
                <label htmlFor="prenom">PRENOM TITULAIRE CARTE</label>
                <Input id="prenom" placeholder="Zé" type="text" name="prenom" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="numero">NUMÉRO DE CARTE</label>
              <Input id="numero" type="text" format="card" name="numero"/>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="expiration">DATE D'EXPIRATION</label>
                <Input id="expiration" format="expiration" type="text" name="expiration" />
              </div>

              <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <Input id="cvc" format="cvc" type="text" name="cvc" />
              </div>
            </div>
          </div>
        </div>

        <div className="right-form">
          <div className="card resume">
            <h3>Résumé de la commande</h3>

            <div className="article">
              <div>
                <strong>Place</strong>
                <p>Option bagages</p>
                <p>Option Tranquillité</p>
              </div>
              <div className="price">
                <p>34,00€</p>
                <p>+5,00€</p>
                <p>+5,00€</p>
              </div>
            </div>

            <hr/>

            <div className="total-line">
              <span>Sous Total</span>
              <span>98,00€</span>
            </div>

            <div className="total-line reduction">
              <span>Réduction adhérents</span>
              <span>-3,00€</span>
            </div>

            <hr/>


            <div className="total-line final">
              <strong>Total</strong>
              <strong>95,00€</strong>
            </div>

            <button className="btn-paiement">
              Confirmer le paiement
            </button>
          </div>
        </div>

      </div>
    </div>
  );

}