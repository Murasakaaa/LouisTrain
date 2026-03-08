"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../style/confirmation.css";

export default function Confirmation() {
  const router = useRouter();
  const [idResa, setIdResa] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id_resa") || "";
    const n  = localStorage.getItem("name")    || "";
    const m  = localStorage.getItem("mail")    || "";
    setIdResa(id);
    setName(n);
    setMail(m);
    if (id) {
      fetch("/api/client/current")
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data?.user?.reservations) {
            const resa = data.user.reservations.find((r) => r._id === id);
            setReservation(resa || null);
          }
        })
        .catch(() => null);
    }
  }, []);

  const trunc = (str, max) =>
    (str || "").length > max ? str.substring(0, max - 1) + "..." : (str || "");

  const drawFakeQR = (doc, x, y, size) => {
    const cell = size / 10;
    const pat  = [
      [1,1,1,1,1,1,1,0,1,0],[1,0,0,0,0,0,1,0,0,1],
      [1,0,1,1,1,0,1,1,0,1],[1,0,1,1,1,0,1,0,1,0],
      [1,0,1,1,1,0,1,1,1,0],[1,0,0,0,0,0,1,0,0,1],
      [1,1,1,1,1,1,1,0,1,0],[0,0,1,0,0,1,0,1,0,1],
      [1,0,0,1,1,0,1,1,0,0],[0,1,0,0,1,0,0,1,1,1],
    ];
    doc.setFillColor(255,255,255);
    doc.rect(x-1, y-1, size+2, size+2, "F");
    doc.setFillColor(20,20,20);
    pat.forEach((row,ri) => row.forEach((c,ci) => {
      if (c) doc.rect(x+ci*cell, y+ri*cell, cell-0.2, cell-0.2, "F");
    }));
  };

  // ── BILLETS ─────────────────────────────────────────────────────────────────
  const telechargerBillets = async () => {
    const { jsPDF } = await import("jspdf");
    if (!reservation?.voyage?.length) return;

    const doc    = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
    const GREEN  = [28, 169, 77];
    const DGREEN = [20, 120, 55];
    const BLACK  = [20, 20, 20];
    const GREY   = [120, 120, 120];
    const LGREY  = [230, 233, 235];
    const WHITE  = [255, 255, 255];
    const W = 210, H = 148, MID = 130;

    reservation.voyage.forEach((v, i) => {
      if (i > 0) doc.addPage();

      doc.setFillColor(255,255,255);
      doc.rect(0, 0, W, H, "F");

      // Header vert
      doc.setFillColor(...GREEN);
      doc.rect(0, 0, W, 20, "F");
      doc.setTextColor(...WHITE);
      doc.setFont("helvetica","bold"); doc.setFontSize(13);
      doc.text("LouisTrain", 8, 13);
      doc.setFont("helvetica","normal"); doc.setFontSize(8);
      doc.text("BILLET DE TRAIN", W-8, 9, { align:"right" });
      doc.setFontSize(7);
      doc.text(v.sens === "retour" ? "RETOUR" : "ALLER", W-8, 17, { align:"right" });

      // Séparateur vertical
      doc.setDrawColor(...LGREY); doc.setLineWidth(0.3);
      doc.setLineDashPattern([2,2], 0);
      doc.line(MID, 22, MID, H-18);
      doc.setLineDashPattern([], 0);

      // ── GAUCHE ──
      const LM = 10;

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("GARE DE DEPART", LM, 30);
      doc.setTextColor(...GREEN); doc.setFontSize(13); doc.setFont("helvetica","bold");
      const depL = doc.splitTextToSize((v.gare_depart||"").toUpperCase(), MID-LM-5);
      doc.text(depL.slice(0,2), LM, 38);

      const afterDep = depL.length > 1 ? 52 : 42;

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("GARE D'ARRIVEE", LM, afterDep + 8);
      doc.setTextColor(...GREEN); doc.setFontSize(13); doc.setFont("helvetica","bold");
      const arrL = doc.splitTextToSize((v.gare_arrivee||"").toUpperCase(), MID-LM-5);
      doc.text(arrL.slice(0,2), LM, afterDep + 16);

      const afterArr = afterDep + (arrL.length > 1 ? 30 : 22);

      doc.setDrawColor(...LGREY); doc.setLineWidth(0.3);
      doc.line(LM, afterArr, MID-5, afterArr);

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("DEPART", LM, afterArr+7);
      doc.text("ARRIVEE", LM+30, afterArr+7);
      doc.setTextColor(...BLACK); doc.setFontSize(10); doc.setFont("helvetica","bold");
      doc.text(v.heure_depart||"", LM, afterArr+15);
      doc.text(v.heure_arrivee||"", LM+30, afterArr+15);

      const dateStr = new Date(v.date).toLocaleDateString("fr-FR", {
        weekday:"long", day:"numeric", month:"long", year:"numeric"
      });
      doc.setTextColor(...GREY); doc.setFontSize(7); doc.setFont("helvetica","normal");
      doc.text(trunc(dateStr, 40), LM, afterArr+23);

      if (v.options_choisies?.length > 0) {
        doc.setDrawColor(...LGREY);
        doc.line(LM, afterArr+27, MID-5, afterArr+27);
        doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
        doc.text("OPTIONS", LM, afterArr+34);
        let oy = afterArr+41;
        v.options_choisies.slice(0,4).forEach((opt) => {
          doc.setTextColor(...BLACK); doc.setFont("helvetica","normal"); doc.setFontSize(7);
          doc.text(`+ ${trunc(opt.nom,22)}`, LM, oy);
          doc.setTextColor(...GREEN);
          doc.text(`${parseFloat(opt.prix||0).toFixed(2)}EUR`, LM+62, oy);
          oy += 5;
        });
      }

      // ── DROITE ──
      const RX = MID+7, RW = W-RX-6;

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("PASSAGER", RX, 30);
      doc.setTextColor(...BLACK); doc.setFontSize(10); doc.setFont("helvetica","bold");
      const nameL = doc.splitTextToSize(name.toUpperCase(), RW);
      doc.text(nameL.slice(0,2), RX, 38);

      doc.setDrawColor(...LGREY); doc.setLineWidth(0.3);
      doc.line(RX, 44, W-6, 44);

      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("N° RESERVATION", RX, 51);
      doc.setTextColor(...BLACK); doc.setFontSize(8); doc.setFont("helvetica","bold");
      doc.text(idResa, RX, 59);

      doc.setDrawColor(...LGREY);
      doc.line(RX, 63, W-6, 63);

      // Date + QR dessous
      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("DATE DU VOYAGE", RX, 70);
      doc.setTextColor(...BLACK); doc.setFontSize(9); doc.setFont("helvetica","normal");
      doc.text(new Date(v.date).toLocaleDateString("fr-FR"), RX, 78);

      // QR code juste sous la date
      const qrSize = 24;
      const qrX    = RX + (RW - qrSize) / 2;
      drawFakeQR(doc, qrX, 82, qrSize);

      doc.setDrawColor(...LGREY);
      doc.line(RX, 110, W-6, 110);

      // Prix en bas de la colonne droite
      doc.setTextColor(...GREY); doc.setFontSize(6.5); doc.setFont("helvetica","bold");
      doc.text("PRIX TOTAL", RX, 117);
      doc.setTextColor(...GREEN); doc.setFontSize(14); doc.setFont("helvetica","bold");
      doc.text(`${parseFloat(v.prix_ttc||0).toFixed(2)} EUR`, RX, 127);

      // Footer vert
      doc.setFillColor(...DGREEN);
      doc.rect(0, H-16, W, 16, "F");
      doc.setTextColor(...WHITE); doc.setFontSize(6.5); doc.setFont("helvetica","normal");
      doc.text(`Ref : ${idResa}`, 8, H-7);
      doc.text("Bon voyage avec LouisTrain !", W/2, H-7, { align:"center" });
      doc.text(trunc(v.num_billet||"", 24), W-8, H-7, { align:"right" });
    });

    doc.save(`billets_${idResa}.pdf`);
  };

  // ── FACTURE ──────────────────────────────────────────────────────────────────
  const telechargerFacture = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const G   = [28, 169, 77];
    const BK  = [20, 20, 20];
    const GR  = [110, 110, 110];
    const LG  = [240, 242, 245];
    const W   = [255, 255, 255];

    // Header
    doc.setFillColor(...G);
    doc.rect(0, 0, 210, 26, "F");
    doc.setTextColor(...W); doc.setFont("helvetica","bold"); doc.setFontSize(16);
    doc.text("LouisTrain", 14, 16);
    doc.setFont("helvetica","normal"); doc.setFontSize(9);
    doc.text("FACTURE", 196, 16, { align:"right" });

    // Infos client
    doc.setTextColor(...BK); doc.setFontSize(8); doc.setFont("helvetica","bold");
    doc.text(`Ref : ${idResa}`, 14, 36);
    doc.setFont("helvetica","normal"); doc.setTextColor(...GR); doc.setFontSize(7.5);
    doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 14, 42);
    doc.text(`Client : ${name}`, 14, 47);
    doc.text(`Email : ${mail}`, 14, 52);

    doc.setDrawColor(...LG); doc.setLineWidth(0.4);
    doc.line(14, 57, 196, 57);

    doc.setTextColor(...BK); doc.setFontSize(9); doc.setFont("helvetica","bold");
    doc.text("Detail de la commande", 14, 65);

    // En-têtes tableau — colonnes resserrées
    const C = { dep: 14, arr: 57, date: 100, billet: 128, opt: 150, total: 190 };
    doc.setFillColor(...LG);
    doc.rect(14, 69, 182, 8, "F");
    doc.setFontSize(7); doc.setTextColor(...GR);
    doc.text("Gare dep.",  C.dep+1,   75);
    doc.text("Gare arr.",  C.arr,     75);
    doc.text("Date",       C.date,    75);
    doc.text("Billet",     C.billet,  75);
    doc.text("Options",    C.opt,     75);
    doc.text("Total",      C.total,   75, { align:"right" });

    let y = 83, totalGen = 0;

    (reservation?.voyage || []).forEach((v, i) => {
      if (i % 2 === 0) { doc.setFillColor(250,251,252); doc.rect(14, y-5, 182, 8, "F"); }

      // Noms de gare sur 2 lignes si besoin
      const depLines = doc.splitTextToSize((v.gare_depart||""), 40);
      const arrLines = doc.splitTextToSize((v.gare_arrivee||""), 40);
      const rowH     = Math.max(depLines.length, arrLines.length) > 1 ? 13 : 8;

      const date = new Date(v.date).toLocaleDateString("fr-FR");
      const pb   = parseFloat(v.prix_billet||0).toFixed(2);
      const po   = parseFloat(v.prix_options||0).toFixed(2);
      const pt   = parseFloat(v.prix_ttc||0).toFixed(2);
      totalGen  += parseFloat(v.prix_ttc||0);

      doc.setTextColor(...BK); doc.setFont("helvetica","normal"); doc.setFontSize(7);
      doc.text(depLines.slice(0,2), C.dep+1, y);
      doc.text(arrLines.slice(0,2), C.arr,   y);
      doc.text(date,     C.date,   y);
      doc.text(`${pb}`,  C.billet, y);
      doc.text(`${po}`,  C.opt,    y);
      doc.text(`${pt}€`,  C.total,  y, { align:"right" });
      y += rowH;

      (v.options_choisies||[]).forEach((opt) => {
        doc.setTextColor(...GR); doc.setFontSize(6.5);
        doc.text(`  + ${trunc(opt.nom,22)} : ${parseFloat(opt.prix||0).toFixed(2)}`, C.dep+2, y);
        y += 5;
      });
    });

    // Totaux
    doc.setDrawColor(...LG);
    doc.line(14, y+2, 196, y+2);
    y += 10;

    if (reservation?.reduction_appliquee > 0) {
      doc.setTextColor(...GR); doc.setFontSize(8); doc.setFont("helvetica","normal");
      doc.text("Reduction adherent :", 130, y);
      doc.text(`-${reservation.reduction_appliquee.toFixed(2)}€`, 190, y, { align:"right" });
      y += 8;
    }

    const totalFinal = reservation?.prix_total ?? totalGen;
    doc.setFillColor(...G);
    doc.rect(128, y-5, 68, 12, "F");
    doc.setTextColor(...W); doc.setFontSize(9); doc.setFont("helvetica","bold");
    doc.text("Total TTC :", 132, y+3);
    doc.text(`${parseFloat(totalFinal).toFixed(2)}€`, 190, y+3, { align:"right" });

    y += 25;
    doc.setDrawColor(...LG);
    doc.line(14, y, 196, y);
    doc.setTextColor(...GR); doc.setFontSize(7); doc.setFont("helvetica","normal");
    doc.text("LouisTrain - Merci pour votre confiance. Bon voyage !", 105, y+7, { align:"center" });

    doc.save(`facture_${idResa}.pdf`);
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-title">
        <h1>Confirmation de votre commande</h1>
        {idResa && <span className="confirmation-ref">Ref : {idResa}</span>}
      </div>

      <div className="confirmation-card">
        <div>
          <p className="confirmation-merci">Merci {name},</p>
          <p className="confirmation-sub">Votre commande a bien ete enregistree</p>
        </div>

        <p className="confirmation-mail-info">
          Telechargez vos billets et votre facture ici,<br />
          ou recuperez les sur votre adresse mail a{" "}
          <a href={`mailto:${mail}`}>{mail}</a>
        </p>

        <div className="confirmation-btns">
          <button className="confirmation-btn" onClick={telechargerBillets}>
            Telecharger mes billets
          </button>
          <button className="confirmation-btn confirmation-btn--outline" onClick={telechargerFacture}>
            Telecharger ma facture
          </button>
        </div>

        <p className="confirmation-footer">Bon voyage et a bientot !</p>

        <button className="confirmation-home" onClick={() => router.push("/")}>
          Retour a l'accueil
        </button>
      </div>
    </div>
  );
}