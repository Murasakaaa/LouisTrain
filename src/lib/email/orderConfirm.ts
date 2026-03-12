import { transporter } from '@/lib/mailer';

export async function sendOrderConfirmation(to, { orderNumber, facturePdf, billetsPdf }) {
  await transporter.sendMail({
    from: 'no-reply@louistrain.fr',
    to,
    subject: `Commande #${orderNumber} confirmée`,
    html: `
      <h1>Merci pour votre commande !</h1>
      <p>Votre commande <strong>#${orderNumber}</strong> est bien enregistrée.</p>
      <p>Vous trouverez en pièce jointe votre facture et vos billets.</p>
    `,
    attachments: [
      {
        filename: `facture-${orderNumber}.pdf`,
        content: Buffer.from(facturePdf.split(',')[1], 'base64'),
      },
      {
        filename: `billets-${orderNumber}.pdf`,
        content: Buffer.from(billetsPdf.split(',')[1], 'base64'),
      },
    ],
  });
}