"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../style/paiement.css";
import "../../style/HomePage.css";
import Button from "../../components/commons/Button";
import Input from "../../components/commons/Input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement,CardExpiryElement, CardCvcElement, useStripe, useElements,} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const STRIPE_ELEMENT_STYLE = {
  disableLink: true,
  style: {
    base: {
      fontSize: "14.4px",
      color: "#1a1a2e",
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: "400",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

function PaiementForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [panier, setPanier] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedRecap, setExpandedRecap] = useState({});
  const [user, setUser] = useState(null);
  const [stripeErrors, setStripeErrors] = useState({});
  const [paymentError, setPaymentError] = useState("");

  const [form, setForm] = useState({
    civilite: "M.",
    email: "",
    emailConfirm: "",
    nom: "",
    prenom: "",
    telephone: "",
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  useEffect(() => {
    const stored = localStorage.getItem("panier");
    if (stored) {
      try { setPanier(JSON.parse(stored)); }
      catch { setPanier([]); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    fetch("/api/client/current")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => setUser(null));
  }, []);

  const toggleRecap = (cartId) => {
    setExpandedRecap((prev) => ({ ...prev, [cartId]: !prev[cartId] }));
  };

  const prixTTC = panier.reduce((acc, item) => {
    const base = parseFloat(item.prix) || 0;
    const options = (item.selectedOptions || []).reduce(
      (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0), 0
    );
    return acc + base + options;
  }, 0);

  const reduction = user?.abonnement?.code_reduction ? 10 : 0;
  const totalFinal = prixTTC - reduction;

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;

    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!emailRegex.test(form.email)) newErrors.email = "Email invalide";

    if (!form.emailConfirm.trim()) newErrors.emailConfirm = "Veuillez confirmer votre email";
    else if (form.email !== form.emailConfirm) newErrors.emailConfirm = "Les emails ne correspondent pas";

    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est requis";

    if (!form.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
    else if (!phoneRegex.test(form.telephone.replace(/\s/g, ""))) newErrors.telephone = "Numéro invalide";

    return newErrors;
  };

  const genererIdResa = () => {
    const uuid = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
    return uuid;
  };

  const handleButtonPay = async () => {
  setPaymentError("");
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  if (!stripe || !elements) return;
  try {
    const departIds = panier.map((item) => item.departId).filter(Boolean);
    if (departIds.length > 0) {
      const placesRes = await fetch("/api/departs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departIds }),
      });
      if (!placesRes.ok) {
        const err = await placesRes.json();
        setPaymentError(err.error || "Plus de places disponibles pour un des trajets.");
        return;
      }
    }
    const voyages = panier.map((item) => {
      const optionsPropres = (item.selectedOptions || []).map((opt) => ({
        nom: opt.nom,
        prix: parseFloat(opt.prix?.$numberDecimal || opt.prix || 0),
      }));
      const prixOptions = optionsPropres.reduce((s, o) => s + o.prix, 0);
      const prixBillet = parseFloat(item.prix);
      return {
        num_billet: item.cartId,
        sens: item.sens || "aller",
        depart_id: item.departId || "",
        gare_depart: item.gareD,
        gare_arrivee: item.gareA,
        date: item.date,
        heure_depart: item.heureD,
        heure_arrivee: item.heureA,
        options_choisies: optionsPropres,
        prix_billet: prixBillet,
        prix_options: prixOptions,
        prix_ttc: prixBillet + prixOptions,
      };
    });
    const idResa = genererIdResa();
    const { client_secret } = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalFinal }),
    }).then((r) => r.json());
    const cardNumberElement = elements.getElement(CardNumberElement);
    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: `${form.prenom} ${form.nom}`,
          email: form.email,
        },
      },
    });
    if (result.error) {
      setPaymentError(result.error.message);
      return;
    }
    const piDetails = await fetch(`/api/stripe?pi=${result.paymentIntent.id}`)
      .then((r) => r.json());
    const reservation = {
      _id: idResa,
      date_reservation: new Date().toISOString(),
      statut: "confirmée",
      reduction_appliquee: reduction,
      prix_total: totalFinal,
      voyage: voyages,
      paiement: {
        titulaire_cb: `${form.prenom} ${form.nom}`,
        num_cb_masque: `****${piDetails.last4}`,
        num_autorisation: result.paymentIntent.id,
        date_expiration: `${piDetails.exp_month}/${piDetails.exp_year}`,
      },
    };
    const res = await fetch("/api/client/current", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservations: [reservation] }),
    });
    if (!res.ok) {
      setPaymentError("Erreur lors de l'enregistrement de la réservation.");
      return;
    }
    if (user?.abonnement?.code_reduction) {
      await fetch("/api/client/current", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          abonnement: { ...user.abonnement, code_reduction: "" },
        }),
      });
    }
    localStorage.setItem("id_resa", idResa);
    localStorage.setItem("name", `${form.civilite} ${form.prenom} ${form.nom}`);
    localStorage.setItem("mail", form.email);
    localStorage.removeItem("panier");
    router.push("/confirmation");
  } catch (error) {
    console.error("Erreur paiement :", error);
    setPaymentError("Une erreur inattendue est survenue. Veuillez réessayer.");
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
            <h3>Vos informations</h3>

            <div className="form-group">
              <label>CIVILITÉ</label>
              <div className="civilite-group">
                {["M.", "Mme"].map((c) => (
                  <label key={c} className="civilite-option">
                    <Input
                      type="radio"
                      name="civilite"
                      value={c}
                      checked={form.civilite === c}
                      onChange={handleFormChange}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="nom">NOM</label>
                <Input id="nom" placeholder="Dupont" type="text" name="nom" value={form.nom} onChange={handleFormChange} />
                {errors.nom && <span className="input-error">{errors.nom}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="prenom">PRÉNOM</label>
                <Input id="prenom" placeholder="Jean" type="text" name="prenom" value={form.prenom} onChange={handleFormChange} />
                {errors.prenom && <span className="input-error">{errors.prenom}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="telephone">TÉLÉPHONE MOBILE</label>
              <Input id="telephone" placeholder="06 12 34 56 78" type="tel" name="telephone" value={form.telephone} onChange={handleFormChange} />
              {errors.telephone && <span className="input-error">{errors.telephone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">EMAIL</label>
              <Input id="email" placeholder="example@exemple.com" type="email" name="email" value={form.email} onChange={handleFormChange} />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="emailConfirm">CONFIRMATION EMAIL</label>
              <Input id="emailConfirm" placeholder="example@exemple.com" type="email" name="emailConfirm" value={form.emailConfirm} onChange={handleFormChange} />
              {errors.emailConfirm && <span className="input-error">{errors.emailConfirm}</span>}
            </div>
          </div>

          <div className="card">
            <h3>Paiement</h3>

            <div className="grid-2">
              <div className="form-group">
                <label>NOM TITULAIRE CARTE</label>
                <Input placeholder="Dupont" type="text" name="nom" value={form.nom} onChange={handleFormChange} />
                {errors.nom && <span className="input-error">{errors.nom}</span>}
              </div>
              <div className="form-group">
                <label>PRÉNOM TITULAIRE CARTE</label>
                <Input placeholder="Jean" type="text" name="prenom" value={form.prenom} onChange={handleFormChange} />
                {errors.prenom && <span className="input-error">{errors.prenom}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>NUMÉRO DE CARTE</label>
              <div className="stripe-input-wrapper">
                <CardNumberElement
                  options={STRIPE_ELEMENT_STYLE}
                  onChange={(e) =>
                    setStripeErrors((prev) => ({ ...prev, numero: e.error?.message || "" }))
                  }
                />
              </div>
              {stripeErrors.numero && <span className="input-error">{stripeErrors.numero}</span>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>DATE D'EXPIRATION</label>
                <div className="stripe-input-wrapper">
                  <CardExpiryElement
                    options={STRIPE_ELEMENT_STYLE}
                    onChange={(e) =>
                      setStripeErrors((prev) => ({ ...prev, expiration: e.error?.message || "" }))
                    }
                  />
                </div>
                {stripeErrors.expiration && <span className="input-error">{stripeErrors.expiration}</span>}
              </div>

              <div className="form-group">
                <label>CVC</label>
                <div className="stripe-input-wrapper">
                  <CardCvcElement
                    options={STRIPE_ELEMENT_STYLE}
                    onChange={(e) =>
                      setStripeErrors((prev) => ({ ...prev, cvc: e.error?.message || "" }))
                    }
                  />
                </div>
                {stripeErrors.cvc && <span className="input-error">{stripeErrors.cvc}</span>}
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
                    (s, o) => s + parseFloat(o.prix?.$numberDecimal || o.prix || 0), 0
                  );
                  const sousTotal = prixBillet + prixOptions;
                  return (
                    <div key={item.cartId} className="recap-article">
                      <button className="recap-article-toggle" onClick={() => toggleRecap(item.cartId)}>
                        <div className="recap-article-header">
                          <span className="recap-article-num">Article {idx + 1}</span>
                          <span className="recap-article-trajet">{item.gareD} → {item.gareA}</span>
                        </div>
                        <div className="recap-article-toggle-right">
                          <span className="recap-article-sous-total-preview">
                            {sousTotal.toFixed(2).replace(".", ",")}€
                          </span>
                          {expandedRecap[item.cartId] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
                              <span>+{parseFloat(opt.prix?.$numberDecimal || opt.prix || 0).toFixed(2).replace(".", ",")}€</span>
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
           {paymentError && (
            <p className="input-error" style={{ marginBottom: "10px", textAlign: "center" }}>
              {paymentError}
            </p>
          )}
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

export default function Paiement() {
  return (
    <Elements stripe={stripePromise}>
      <PaiementForm />
    </Elements>
  );
}