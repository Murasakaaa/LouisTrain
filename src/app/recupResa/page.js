"use client";
import { useRouter } from "next/navigation";
import "../../style/recupResa.css";
import { useState } from "react";

const trunc = (str, n) => str?.length > n ? str.slice(0, n) + "…" : str ?? "";

export default function RecupResa() {
  const [mail, setMail] = useState("");
  const [numResa, setNumResa] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);
  const router = useRouter();

  // ── BILLETS ──────────────────────────────────────────────────────────────
  const genererBilletsPDF = async (resa, clientName) => {
    const { jsPDF } = await import("jspdf");
    const QRCode = await import("qrcode");

    const idResa = resa._id;
    const name = clientName;
    const reservation = resa;

    if (!reservation?.voyage?.length) return null;

    const doc    = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
    const GREEN  = [28, 169, 77];
    const DGREEN = [20, 120, 55];
    const BLACK  = [20, 20, 20];
    const GREY   = [120, 120, 120];
    const LGREY  = [230, 233, 235];
    const WHITE  = [255, 255, 255];
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

    return doc.output("datauristring");
  };

  // ── FACTURE ──────────────────────────────────────────────────────────────
  const genererFacturePDF = async (resa, clientName, clientMail) => {
    const { jsPDF } = await import("jspdf");

    const idResa = resa._id;
    const name = clientName;
    const reservation = resa;

    const doc = new jsPDF();
    const G  = [28, 169, 77];
    const BK = [20, 20, 20];
    const GR = [110, 110, 110];
    const LG = [240, 242, 245];
    const W  = [255, 255, 255];

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
    doc.text(`Email : ${clientMail}`, 14, 52);

    doc.setDrawColor(...LG); doc.setLineWidth(0.4);
    doc.line(14, 57, 196, 57);

    doc.setTextColor(...BK); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("Detail de la commande", 14, 65);

    const C = { dep: 14, arr: 57, date: 100, billet: 128, opt: 150, total: 190 };
    doc.setFillColor(...LG);
    doc.rect(14, 69, 182, 8, "F");
    doc.setFontSize(7); doc.setTextColor(...GR);
    doc.text("Gare dep.",  C.dep + 1, 75);
    doc.text("Gare arr.",  C.arr,     75);
    doc.text("Date",       C.date,    75);
    doc.text("Billet",     C.billet,  75);
    doc.text("Options",    C.opt,     75);
    doc.text("Total",      C.total,   75, { align: "right" });

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

    return doc.output("datauristring");
  };

  const handleRecherche = async () => {
  if (!mail.trim() || !numResa.trim()) {
    setErreur("Veuillez remplir tous les champs.");
    return;
  }

  setLoading(true);
  setErreur(null);
  setSucces(false);

  try {
    const res = await fetch("/api/client/resa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail: mail.trim(), numResa: numResa.trim() }),
    });

    const data = await res.json();

    if (data.found && data.reservation && data.client) {
      const clientName = `${data.client.prenom} ${data.client.nom}`;

      const billetsPdf = await genererBilletsPDF(data.reservation, clientName);
      const facturePdf = await genererFacturePDF(data.reservation, clientName, mail.trim());

      await fetch("/api/send/resa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: mail.trim(),
          orderNumber: numResa.trim(),
          billetsPdf,
          facturePdf,
        }),
      });
    }

    setSucces(true);

  } catch {
    setErreur("Une erreur est survenue, veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="histo-container">
      <div className="histo-header">
        <h1 className="histo-titre">Retrouvez vos billets</h1>
        <span className="histo-badge">Saisissez vos informations de réservation</span>
      </div>

      <div className="histo-form-card">
        {!succes ? (
          <>
            <div className="histo-form-group">
              <label className="histo-form-label">Adresse e-mail</label>
              <input
                className="histo-form-input"
                type="email"
                placeholder="jean.dupont@email.com"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRecherche()}
              />
            </div>

            <div className="histo-form-group">
              <label className="histo-form-label">Numéro de réservation</label>
              <input
                className="histo-form-input"
                type="text"
                placeholder="Ex : RES-3590C7D437"
                value={numResa}
                onChange={(e) => setNumResa(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRecherche()}
              />
            </div>

            {erreur && <p className="histo-form-erreur">{erreur}</p>}

            <button
              className="histo-btn histo-btn--full"
              onClick={handleRecherche}
              disabled={loading}
            >
              {loading ? "Recherche en cours..." : "Recevoir mes billets par mail"}
            </button>
          </>
        ) : (
          <div className="histo-form-succes">
            <div className="histo-succes-icon">✓</div>
            <p className="histo-succes-titre">Demande prise en compte</p>
            <p className="histo-succes-sub">
              Si l'adresse <strong>{mail}</strong> correspond à une réservation
              avec le numéro <strong>{numResa}</strong>, un e-mail vous sera
              envoyé avec vos billets.
            </p>
            <button
              className="histo-btn histo-btn--full"
              onClick={() => { setSucces(false); setMail(""); setNumResa(""); }}
            >
              Nouvelle recherche
            </button>
          </div>
        )}
      </div>

      <button className="histo-home" onClick={() => router.push("/")}>
        Retour à l'accueil
      </button>
    </div>
  );
}