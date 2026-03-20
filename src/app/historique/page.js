"use client";
import { useRouter } from "next/navigation";
import "../../style/historique.css";
import { useEffect, useState } from "react";

const trunc = (str, n) => str?.length > n ? str.slice(0, n) + "…" : str ?? "";

export default function Historique() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ouvert, setOuvert] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch("/api/client/history")
      .then((res) => {
        if (res.status === 401) { router.push("/connexion"); return null; }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const reservations = user?.reservations ?? [];

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });

  const toggleOuvert = (id) => setOuvert((prev) => ({ ...prev, [id]: !prev[id] }));

  // ── BILLETS ──────────────────────────────────────────────────────────────
  const telechargerBillets = async (resa) => {
    const { jsPDF } = await import("jspdf");
    const QRCode = await import("qrcode");

    const idResa = resa._id;
    const name = `${user.prenom} ${user.nom}`;
    const reservation = resa;

    if (!reservation?.voyage?.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
    const GREEN = [28, 169, 77];
    const DGREEN = [20, 120, 55];
    const BLACK = [20, 20, 20];
    const GREY = [120, 120, 120];
    const LGREY = [230, 233, 235];
    const WHITE = [255, 255, 255];
    const W = 210, H = 148, MID = 130;

    for (const [i, v] of reservation.voyage.entries()) {
      if (i > 0) doc.addPage();

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      doc.setFillColor(...GREEN);
      doc.rect(0, 0, W, 20, "F");
      doc.setTextColor(...WHITE);
      doc.setFont("helvetica", "bold"); doc.setFontSize(13);
      doc.text("LouisTrain", 8, 13);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.text("BILLET DE TRAIN", W - 8, 9, { align: "right" });
      doc.setFontSize(7);
      doc.text(v.sens === "retour" ? "RETOUR" : "ALLER", W - 8, 17, { align: "right" });

      doc.setDrawColor(...LGREY); doc.setLineWidth(0.3);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(MID, 22, MID, H - 18);
      doc.setLineDashPattern([], 0);

      const LM = 10;

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text("GARE DE DEPART", LM, 30);
      doc.setTextColor(...GREEN); doc.setFontSize(13); doc.setFont("helvetica", "bold");
      const depL = doc.splitTextToSize((v.gare_depart || "").toUpperCase(), MID - LM - 5);
      doc.text(depL.slice(0, 2), LM, 38);

      const afterDep = depL.length > 1 ? 52 : 42;

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text("GARE D'ARRIVEE", LM, afterDep + 8);
      doc.setTextColor(...GREEN); doc.setFontSize(13); doc.setFont("helvetica", "bold");
      const arrL = doc.splitTextToSize((v.gare_arrivee || "").toUpperCase(), MID - LM - 5);
      doc.text(arrL.slice(0, 2), LM, afterDep + 16);

      const afterArr = afterDep + (arrL.length > 1 ? 30 : 22);

      doc.setDrawColor(...LGREY); doc.setLineWidth(0.3);
      doc.line(LM, afterArr, MID - 5, afterArr);

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text("DEPART", LM, afterArr + 7);
      doc.text("ARRIVEE", LM + 30, afterArr + 7);
      doc.setTextColor(...BLACK); doc.setFontSize(10); doc.setFont("helvetica", "bold");
      doc.text(v.heure_depart || "", LM, afterArr + 15);
      doc.text(v.heure_arrivee || "", LM + 30, afterArr + 15);

      const dateStr = new Date(v.date).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
      doc.setTextColor(...GREY); doc.setFontSize(7); doc.setFont("helvetica", "normal");
      doc.text(trunc(dateStr, 40), LM, afterArr + 23);

      if (v.options_choisies?.length > 0) {
        doc.setDrawColor(...LGREY);
        doc.line(LM, afterArr + 27, MID - 5, afterArr + 27);
        doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
        doc.text("OPTIONS", LM, afterArr + 34);
        let oy = afterArr + 41;
        v.options_choisies.slice(0, 4).forEach((opt) => {
          doc.setTextColor(...BLACK); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
          doc.text(`+ ${trunc(opt.nom, 22)}`, LM, oy);
          doc.setTextColor(...GREEN);
          doc.text(`${parseFloat(opt.prix || 0).toFixed(2)}EUR`, LM + 62, oy);
          oy += 5;
        });
      }

      const RX = MID + 7, RW = W - RX - 6;

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text("PASSAGER", RX, 30);
      doc.setTextColor(...BLACK); doc.setFontSize(10); doc.setFont("helvetica", "bold");
      const nameL = doc.splitTextToSize(name.toUpperCase(), RW);
      doc.text(nameL.slice(0, 2), RX, 38);

      doc.setDrawColor(...LGREY); doc.setLineWidth(0.3);
      doc.line(RX, 44, W - 6, 44);

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text("N° RESERVATION", RX, 51);
      doc.setTextColor(...BLACK); doc.setFontSize(8); doc.setFont("helvetica", "bold");
      doc.text(idResa, RX, 59);

      doc.setDrawColor(...LGREY);
      doc.line(RX, 63, W - 6, 63);

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text("DATE DU VOYAGE", RX, 70);
      doc.setTextColor(...BLACK); doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.text(new Date(v.date).toLocaleDateString("fr-FR"), RX, 78);

      const qrSize = 24;
      const qrX = RX + (RW - qrSize) / 2;
      const qrDataUrl = await QRCode.toDataURL(idResa);
      doc.addImage(qrDataUrl, "PNG", qrX, 82, qrSize, qrSize);

      doc.setDrawColor(...LGREY);
      doc.line(RX, 110, W - 6, 110);

      doc.setFillColor(...DGREEN);
      doc.rect(0, H - 16, W, 16, "F");
      doc.setTextColor(...WHITE); doc.setFontSize(6.5); doc.setFont("helvetica", "normal");
      doc.text(`Ref : ${idResa}`, 8, H - 7);
      doc.text("Bon voyage avec LouisTrain !", W / 2, H - 7, { align: "center" });
      doc.text(trunc(v.num_billet || "", 24), W - 8, H - 7, { align: "right" });
    }

    doc.save(`billets_${idResa}.pdf`);
  };

  // ── FACTURE ──────────────────────────────────────────────────────────────
  const telechargerFacture = async (resa) => {
    const { jsPDF } = await import("jspdf");

    const idResa = resa._id;
    const name = `${user.prenom} ${user.nom}`;
    const mail = user.email;
    const reservation = resa;

    const doc = new jsPDF();
    const G = [28, 169, 77];
    const BK = [20, 20, 20];
    const GR = [110, 110, 110];
    const LG = [240, 242, 245];
    const W = [255, 255, 255];

    doc.setFillColor(...G);
    doc.rect(0, 0, 210, 26, "F");
    doc.setTextColor(...W); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text("LouisTrain", 14, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("FACTURE", 196, 16, { align: "right" });

    doc.setTextColor(...BK); doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text(`Ref : ${idResa}`, 14, 36);
    doc.setFont("helvetica", "normal"); doc.setTextColor(...GR); doc.setFontSize(7.5);
    doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 14, 42);
    doc.text(`Client : ${name}`, 14, 47);
    doc.text(`Email : ${mail}`, 14, 52);

    doc.setDrawColor(...LG); doc.setLineWidth(0.4);
    doc.line(14, 57, 196, 57);

    doc.setTextColor(...BK); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("Detail de la commande", 14, 65);

    const C = { dep: 14, arr: 57, date: 100, billet: 128, opt: 150, total: 190 };
    doc.setFillColor(...LG);
    doc.rect(14, 69, 182, 8, "F");
    doc.setFontSize(7); doc.setTextColor(...GR);
    doc.text("Gare dep.", C.dep + 1, 75);
    doc.text("Gare arr.", C.arr, 75);
    doc.text("Date", C.date, 75);
    doc.text("Billet", C.billet, 75);
    doc.text("Options", C.opt, 75);
    doc.text("Total", C.total, 75, { align: "right" });

    let y = 83, totalGen = 0;

    (reservation?.voyage || []).forEach((v, i) => {
      if (i % 2 === 0) { doc.setFillColor(250, 251, 252); doc.rect(14, y - 5, 182, 8, "F"); }

      const depLines = doc.splitTextToSize((v.gare_depart || ""), 40);
      const arrLines = doc.splitTextToSize((v.gare_arrivee || ""), 40);
      const rowH = Math.max(depLines.length, arrLines.length) > 1 ? 13 : 8;

      const date = new Date(v.date).toLocaleDateString("fr-FR");
      const pb = parseFloat(v.prix_billet || 0).toFixed(2);
      const po = parseFloat(v.prix_options || 0).toFixed(2);
      const pt = parseFloat(v.prix_ttc || 0).toFixed(2);
      totalGen += parseFloat(v.prix_ttc || 0);

      doc.setTextColor(...BK); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
      doc.text(depLines.slice(0, 2), C.dep + 1, y);
      doc.text(arrLines.slice(0, 2), C.arr, y);
      doc.text(date, C.date, y);
      doc.text(`${pb}`, C.billet, y);
      doc.text(`${po}`, C.opt, y);
      doc.text(`${pt}€`, C.total, y, { align: "right" });
      y += rowH;

      (v.options_choisies || []).forEach((opt) => {
        doc.setTextColor(...GR); doc.setFontSize(6.5);
        doc.text(`  + ${trunc(opt.nom, 22)} : ${parseFloat(opt.prix || 0).toFixed(2)}`, C.dep + 2, y);
        y += 5;
      });
    });

    doc.setDrawColor(...LG);
    doc.line(14, y + 2, 196, y + 2);
    y += 10;

    if (reservation?.reduction_appliquee > 0) {
      doc.setTextColor(...GR); doc.setFontSize(8); doc.setFont("helvetica", "normal");
      doc.text("Reduction adherent :", 130, y);
      doc.text(`-${reservation.reduction_appliquee.toFixed(2)}€`, 190, y, { align: "right" });
      y += 8;
    }

    const totalFinal = reservation?.prix_total ?? totalGen;
    doc.setFillColor(...G);
    doc.rect(128, y - 5, 68, 12, "F");
    doc.setTextColor(...W); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("Total TTC :", 132, y + 3);
    doc.text(`${parseFloat(totalFinal).toFixed(2)}€`, 190, y + 3, { align: "right" });

    y += 25;
    doc.setDrawColor(...LG);
    doc.line(14, y, 196, y);
    doc.setTextColor(...GR); doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("LouisTrain - Merci pour votre confiance. Bon voyage !", 105, y + 7, { align: "center" });

    doc.save(`facture_${idResa}.pdf`);
  };

  // ── RENDER ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="histo-container">
        <p className="histo-loading">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="histo-container">
      <div className="histo-header">
        <h1 className="histo-titre">Mes réservations</h1>
        <span className="histo-badge">
          {reservations.length} réservation{reservations.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="histo-list">
        {reservations.length === 0 ? (
          <div className="histo-empty">
            <p>Vous n'avez aucune réservation pour le moment.</p>
          </div>
        ) : (
          reservations.map((resa, index) => {
            const isOpen = !!ouvert[resa._id ?? index];

            return (
              <div key={resa._id ?? index} className={`histo-card ${isOpen ? "histo-card--open" : ""}`}>

                <button className="histo-card-main" onClick={() => toggleOuvert(resa._id ?? index)}>
                  <div className="histo-card-left">
                    <div className="histo-card-meta">
                      <span className="histo-ref">{resa._id}</span>
                    </div>
                    <div className="histo-card-meta">
                      <span>{formatDate(resa.date_reservation)}</span>
                      <span className="histo-dot">·</span>
                      <span>{resa.voyage?.length} trajet{resa.voyage?.length > 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="histo-card-right">
                    <span className={`histo-statut ${resa.statut === "confirmée" ? "histo-statut--ok" : "histo-statut--old"}`}>
                      {resa.statut}
                    </span>
                    <span className="histo-prix">{resa.prix_total?.toFixed(2)} €</span>
                    <span className={`histo-chevron ${isOpen ? "histo-chevron--open" : ""}`}>‹</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="histo-detail">
                    <div className="histo-detail-trajets">
                      {resa.voyage?.map((trajet, j) => (
                        <div key={j} className="histo-trajet">
                          <div className="histo-trajet-header">
                            <span className="histo-sens">{trajet.sens === "retour" ? "Retour" : "Aller"}</span>
                          </div>
                          <div className="histo-trajet-row">
                            <div className="histo-trajet-gares">
                              <div className="histo-gare">
                                <span className="histo-gare-heure">{trajet.heure_depart}</span>
                                <span className="histo-gare-nom">{trajet.gare_depart}</span>
                              </div>
                              <div className="histo-trait"></div>
                              <div className="histo-gare">
                                <span className="histo-gare-heure">{trajet.heure_arrivee}</span>
                                <span className="histo-gare-nom">{trajet.gare_arrivee}</span>
                              </div>
                            </div>
                            <div className="histo-trajet-infos">
                              <div className="histo-info-row">
                                <span className="histo-info-label">Date</span>
                                <span>{formatDate(trajet.date)}</span>
                              </div>
                              <div className="histo-info-row">
                                <span className="histo-info-label">Prix TTC</span>
                                <span>{trajet.prix_ttc?.toFixed(2)} €</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="histo-detail-footer">
                      <div className="histo-detail-recap">
                        <div className="histo-info-row">
                          <span className="histo-info-label">Réduction</span>
                          <span>{resa.reduction_appliquee > 0 ? `${resa.reduction_appliquee} %` : "Aucune"}</span>
                        </div>
                        <div className="histo-info-row">
                          <span className="histo-info-label">Total</span>
                          <span className="histo-total">{resa.prix_total?.toFixed(2)} €</span>
                        </div>
                      </div>

                      <div className="histo-btns">
                        <button className="histo-btn" onClick={() => telechargerBillets(resa)}>
                          Télécharger mes billets
                        </button>
                        <button className="histo-btn histo-btn--outline" onClick={() => telechargerFacture(resa)}>
                          Télécharger la facture
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <button className="histo-home" onClick={() => router.push("/")}>
        Retour à l'accueil
      </button>
    </div>
  );
}