"use client";
import React, { useState, useEffect } from "react";
import { Train, ChevronDown, ChevronUp, Trash2, Plus, ShoppingCart } from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/commons/Button";
import "../../style/panier.css";
import { useRouter } from "next/navigation";

// Couleur pour le logo du train (à revoir si vraiment utile)
const getAvatarColor = (letter) => {
  const colors = {
    A: "#c0392b", B: "#2980b9", C: "#8e44ad", D: "#16a085",
    E: "#2471a3", F: "#ca6f1e", G: "#1e8449", H: "#76448a",
    I: "#117864", J: "#b7950b", K: "#784212", L: "#1a5276",
    M: "#922b21", N: "#1f618d", O: "#1e8449", P: "#d35400",
    Q: "#6c3483", R: "#0e6655", S: "#7d6608", T: "#4a235a",
    U: "#1b4f72", V: "#145a32", W: "#6e2f1a", X: "#212f3c",
    Y: "#7b241c", Z: "#154360",
  };
  return colors[letter?.toUpperCase()] || "#555";
};

// Calcul de la durée du trajet
const calculerDuree = (debut, fin) => {
  const [h1, m1] = debut.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  const totalMinutes = h2 * 60 + m2 - (h1 * 60 + m1);
  const heures = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${heures}h${minutes.toString().padStart(2, "0")}` : `${heures}h`;
};

// Formate la date "Le jj/mm/aaaa"
const formaterDate = (dateStr) => {
  const d = new Date(dateStr);
  const jour = String(d.getDate()).padStart(2, "0");
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const annee = d.getFullYear();
  return `Le ${jour}/${mois}/${annee}`;
};

export default function PanierPage() {
  const router = useRouter();
  const [panier, setPanier] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedRecap, setExpandedRecap] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleRecap = (cartId) => {
    setExpandedRecap((prev) => ({ ...prev, [cartId]: !prev[cartId] }));
  };

  // Chargement du panier depuis le localStorage
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

  // Mise à jour du localStorage à chaque changement
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("panier", JSON.stringify(panier));
    }
  }, [panier, isLoaded]);

  // Suppression d'un article
  const supprimerArticle = (cartId) => {
    setPanier((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Toggle expansion d'un article
  const toggleExpand = (cartId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [cartId]: !prev[cartId],
    }));
  };

  // Calcul des totaux
  const prixHT = panier.reduce((acc, item) => {
    const base = parseFloat(item.prix) || 0;
    const options = (item.selectedOptions || []).reduce(
      (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0),
      0
    );
    return acc + base + options;
  }, 0);

  const TVA_TAUX = 20;
  const montantTVA = prixHT * (TVA_TAUX / 100);
  const prixTTC = prixHT + montantTVA;

  // Groupement par date
  const panierParDate = panier.reduce((acc, item) => {
    const dateKey = formaterDate(item.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const handleValiderCommande = () => {
    console.log("Validation de la commande :", panier);
    // Redirection vers la page de paiement (à implémenter)
  };

  const handleAjouterArticle = () => {
    router.push("/calendrier");
  };

  return (
    <div className="panier-page">

      <main className="panier-main">
        <div className="panier-content">
          {/* ---- Colonne gauche : liste des articles ---- */}
          <div className="panier-articles">
            <h1 className="panier-titre">Récapitulatif de votre panier :</h1>
            <h2 className="panier-sous-titre">
              Vos articles ({panier.length})
            </h2>

            {!isLoaded ? (
              <div className="panier-loading">
                <div className="panier-spinner"></div>
                <p>Chargement de votre panier…</p>
              </div>
            ) : panier.length === 0 ? (
              <div className="panier-vide">
                <ShoppingCart size={48} strokeWidth={1.2} />
                <p>Votre panier est vide.</p>
                <Button
                  text="Trouver un billet"
                  onClick={handleAjouterArticle}
                />
              </div>
            ) : (
              Object.entries(panierParDate).map(([dateLabel, items]) => (
                <div key={dateLabel} className="panier-groupe">
                  <p className="panier-date-label">{dateLabel}</p>

                  {items.map((item) => {
                    const letter = item.trainID?.charAt(0)?.toUpperCase() || "T";
                    const duree = calculerDuree(item.heureD, item.heureA);
                    const isExpanded = expandedItems[item.cartId];
                    const hasOptions = item.selectedOptions?.length > 0;

                    return (
                      <div key={item.cartId} className="panier-card">
                        <div className="panier-card-row">
                          {/* Avatar */}
                          <div
                            className="panier-avatar"
                            style={{ backgroundColor: getAvatarColor(letter) }}
                          >
                            {letter}
                          </div>

                          {/* ID du train */}
                          <span className="panier-train-id">N°{item.trainID}</span>

                          {/* Trajet */}
                          <div className="panier-trajet">
                            <div className="panier-station">
                              <span className="panier-heure">{item.heureD}</span>
                              <span className="panier-gare">{item.gareD}</span>
                            </div>

                            <div className="panier-ligne">
                              <div className="panier-tiret"></div>
                              <div className="panier-icon-train">
                                <Train size={16} />
                                <span className="panier-duree">{duree}</span>
                              </div>
                              <div className="panier-tiret"></div>
                            </div>

                            <div className="panier-station">
                              <span className="panier-heure">{item.heureA}</span>
                              <span className="panier-gare">{item.gareA}</span>
                            </div>
                          </div>

                          {/* Prix */}
                          <span className="panier-prix">
                            {parseFloat(item.prix).toFixed(2).replace(".", ",")}€
                          </span>

                          {/* Boutons */}
                          <div className="panier-actions">
                            {hasOptions && (
                              <button
                                className="panier-toggle"
                                onClick={() => toggleExpand(item.cartId)}
                                title="Voir les options"
                              >
                                {isExpanded ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>
                            )}

                            <button
                              className="panier-delete"
                              onClick={() => supprimerArticle(item.cartId)}
                              title="Supprimer cet article"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Options dépliables */}
                        {isExpanded && hasOptions && (
                          <div className="panier-options">
                            {item.selectedOptions.map((opt, i) => (
                              <div key={i} className="panier-option-item">
                                <span className="panier-option-nom">{opt.nom}</span>
                                <span className="panier-option-prix">
                                  {parseFloat(
                                    opt.prix?.$numberDecimal || opt.prix
                                  ).toFixed(2).replace(".", ",")}€
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* ---- Colonne droite : récapitulatif prix ---- */}
          {panier.length > 0 && (
            <aside className="panier-recap">
              <h3 className="recap-titre">Total</h3>

              {/* Détail article par article */}
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
                      {/* En-tête cliquable */}
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

                      {/* Détail déroulable */}
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

              <hr className="recap-divider" />

              {/* Prix HT + TVA */}
              <div className="recap-lignes">
                <div className="recap-ligne">
                  <span>Prix HT</span>
                  <span className="recap-montant">
                    {prixHT.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
                <div className="recap-ligne recap-tva">
                  <span>TVA ({TVA_TAUX}%)</span>
                  <span className="recap-montant">
                    +{montantTVA.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </div>

              <hr className="recap-divider" />

              {/* Prix TTC */}
              <div className="recap-ligne recap-ttc">
                <span>Prix TTC</span>
                <span className="recap-montant recap-montant--ttc">
                  {prixTTC.toFixed(2).replace(".", ",")}€
                </span>
              </div>

              {/* Modes de paiement */}
              <div className="recap-paiement">
                <p className="recap-paiement-titre">Modes de paiement acceptés</p>
                <div className="recap-paiement-logos">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/960px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                    alt="Visa"
                    className="paiement-img"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    className="paiement-img"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/800px-American_Express_logo_%282018%29.svg.png"
                    alt="American Express"
                    className="paiement-img"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/800px-PayPal.svg.png"
                    alt="PayPal"
                    className="paiement-img"
                  />
                </div>
              </div>

              <Button
                text="Valider ma commande"
                onClick={handleValiderCommande}
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <button
                className="recap-ajouter-btn"
                onClick={handleAjouterArticle}
              >
                <Plus size={16} />
                Ajouter un autre article
              </button>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}