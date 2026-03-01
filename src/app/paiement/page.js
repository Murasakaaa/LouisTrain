"use client";
import React, { useState, useEffect } from "react";
import "../../style/paiement.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "../../components/commons/Input";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Paiement() {
  const [panier, setPanier] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedRecap, setExpandedRecap] = useState({});
  const [user, setUser] = useState(null);

  // États des champs du formulaire
  const [form, setForm] = useState({
    email: "",
    nom: "",
    prenom: "",
    numero: "",
    expiration: "",
    cvc: "",
  });

  // Erreurs de validation
  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  useEffect(() => {
    const stored = localStorage.getItem("panier");
    if (stored) {
      try {
        setPanier(JSON.parse(stored));
      } catch {
        setPanier([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    fetch("/api/client/current")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const toggleRecap = (cartId) => {
    setExpandedRecap((prev) => ({ ...prev, [cartId]: !prev[cartId] }));
  };

  const prixTTC = panier.reduce((acc, item) => {
    const base = parseFloat(item.prix) || 0;
    const options = (item.selectedOptions || []).reduce(
      (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0),
      0
    );
    return acc + base + options;
  }, 0);

  const reduction = user?.abonnement ? 3 : 0;
  const totalFinal = prixTTC - reduction;

  // Methode pour check si tout les champs sont bons
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardRegex = /^(\d{4} ){3}\d{4}$/;
    const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvcRegex = /^\d{3}$/;

    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!emailRegex.test(form.email)) newErrors.email = "Email invalide";

    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est requis";

    if (!form.numero.trim()) newErrors.numero = "Le numéro de carte est requis";
    else if (!cardRegex.test(form.numero)) newErrors.numero = "Numéro invalide (16 chiffres)";

    if (!form.expiration.trim()) newErrors.expiration = "La date d'expiration est requise";
    else if (!expirationRegex.test(form.expiration)) newErrors.expiration = "Format invalide (MM/AA)";

    if (!form.cvc.trim()) newErrors.cvc = "Le CVC est requis";
    else if (!cvcRegex.test(form.cvc)) newErrors.cvc = "CVC invalide (3 chiffres)";

    return newErrors;
  };

  const handleButtonPay = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const reservations = panier.map((item) => ({
      date_reservation: new Date().toISOString(),
      statut: "confirmée",
      reduction_appliquee: reduction,
      prix_total: totalFinal,
      voyage: [{
        num_billet: item.cartId,
        gare_depart: item.gareD,
        gare_arrivee: item.gareA,
        date: item.date,
        heure_depart: item.heureD,
        heure_arrivee: item.heureA,
        options_choisies: item.selectedOptions || [],
        prix_billet: parseFloat(item.prix),
        prix_options: (item.selectedOptions || []).reduce(
          (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0), 0
        ),
        prix_ttc: parseFloat(item.prix) + (item.selectedOptions || []).reduce(
          (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0), 0
        ),
      }],
      paiement: {
        titulaire_cb: `${form.prenom} ${form.nom}`,
        num_cb_masque: `****${form.numero.replace(/\s/g, "").slice(-4)}`,
        date_expiration: form.expiration,
      },
    }));

    const res = await fetch("/api/client/reservation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservations }),
    });

    if (res.ok) {
      localStorage.removeItem("panier"); 
      router.push("/confirmation"); 
    } else {
      console.error("Erreur lors de la réservation");
    }
  };

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
              <Input
                id="email"
                placeholder="example@exemple.com"
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
              />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
          </div>

          <div className="card">
            <h3>Paiement</h3>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="nom">NOM TITULAIRE CARTE</label>
                <Input
                  id="nom"
                  placeholder="Esteves"
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleFormChange}
                />
                {errors.nom && <span className="input-error">{errors.nom}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="prenom">PRENOM TITULAIRE CARTE</label>
                <Input
                  id="prenom"
                  placeholder="Zé"
                  type="text"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleFormChange}
                />
                {errors.prenom && <span className="input-error">{errors.prenom}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="numero">NUMÉRO DE CARTE</label>
              <Input
                id="numero"
                type="text"
                format="card"
                name="numero"
                value={form.numero}
                onChange={handleFormChange}
              />
              {errors.numero && <span className="input-error">{errors.numero}</span>}
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="expiration">DATE D'EXPIRATION</label>
                <Input
                  id="expiration"
                  format="expiration"
                  type="text"
                  name="expiration"
                  value={form.expiration}
                  onChange={handleFormChange}
                />
                {errors.expiration && <span className="input-error">{errors.expiration}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <Input
                  id="cvc"
                  format="cvc"
                  type="text"
                  name="cvc"
                  value={form.cvc}
                  onChange={handleFormChange}
                />
                {errors.cvc && <span className="input-error">{errors.cvc}</span>}
              </div>
            </div>
          </div>
        </div>

        {panier.length > 0 && (
          <aside className="panier-recap">
            <h3 className="recap-titre">Résumé de la commande</h3>

            {!isLoaded ? (
              <p>Chargement...</p>
            ) : (
              <div className="recap-detail">
                {panier.map((item, idx) => {
                  const prixBillet = parseFloat(item.prix) || 0;
                  const prixOptions = (item.selectedOptions || []).reduce(
                    (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0),
                    0
                  );
                  const sousTotal = prixBillet + prixOptions;

                  return (
                    <div key={item.cartId} className="recap-article">
                      <button
                        className="recap-article-toggle"
                        onClick={() => toggleRecap(item.cartId)}
                      >
                        <div className="recap-article-header">
                          <span className="recap-article-num">Article {idx + 1}</span>
                          <span className="recap-article-trajet">
                            {item.gareD} → {item.gareA}
                          </span>
                        </div>
                        <div className="recap-article-toggle-right">
                          <span className="recap-article-sous-total-preview">
                            {sousTotal.toFixed(2).replace(".", ",")}€
                          </span>
                          {expandedRecap[item.cartId]
                            ? <ChevronUp size={14} />
                            : <ChevronDown size={14} />
                          }
                        </div>
                      </button>

                      {expandedRecap[item.cartId] && (
                        <div className="recap-article-detail">
                          <div className="recap-article-ligne">
                            <span>Billet x1</span>
                            <span>{prixBillet.toFixed(2).replace(".", ",")}€</span>
                          </div>
                          {(item.selectedOptions || []).map((opt, i) => (
                            <div key={i} className="recap-article-ligne recap-article-option">
                              <span>{opt.nom}</span>
                              <span>
                                +{parseFloat(opt.prix?.$numberDecimal || opt.prix || 0)
                                  .toFixed(2)
                                  .replace(".", ",")}€
                              </span>
                            </div>
                          ))}
                          <div className="recap-article-ligne recap-article-sous-total">
                            <span>Sous-total</span>
                            <span>{sousTotal.toFixed(2).replace(".", ",")}€</span>
                          </div>
                        </div>
                      )}

                      {idx < panier.length - 1 && <hr className="recap-article-sep" />}
                    </div>
                  );
                })}
              </div>
            )}

            <hr className="recap-divider" />

            <div className="recap-ligne">
              <span>Sous-total TTC</span>
              <span className="recap-montant">{prixTTC.toFixed(2).replace(".", ",")}€</span>
            </div>

            {user?.abonnement && (
              <div className="recap-ligne reduction">
                <span>Réduction adhérents</span>
                <span className="recap-montant">-{reduction.toFixed(2).replace(".", ",")}€</span>
              </div>
            )}

            <hr className="recap-divider" />

            <div className="recap-ligne recap-ttc">
              <span>Total TTC</span>
              <span className="recap-montant recap-montant--ttc">
                {totalFinal.toFixed(2).replace(".", ",")}€
              </span>
            </div>

            <Button
              text="Confirmer le paiement"
              onClick={handleButtonPay}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}