import { transporter } from '@/lib/mailer';

export async function sendResaMail(to, { orderNumber, facturePdf, billetsPdf }) {
  await transporter.sendMail({
    from: '"LouisTrain" <no-reply@louistrain.fr>',
    to,
    subject: `Vos billets - Réservation ${orderNumber}`,
    html: `
      <div">
        <h2>Votre réservation</h2>
        <p>Vous avez demandé à recevoir vos billets et votre facture pour la réservation <strong>${orderNumber}</strong>.</p>
        <p>Vous les trouverez en pièce jointe de cet e-mail.</p>
        <p style="color: #6b7280; font-size: 0.85em;">
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
        </p>
        <p>Bon voyage avec LouisTrain !</p>
      </div>
    `,
    attachments: [
      {
        filename: `billets-${orderNumber}.pdf`,
        content: Buffer.from(billetsPdf.split(',')[1], 'base64'),
        contentType: 'application/pdf',
      },
      {
        filename: `facture-${orderNumber}.pdf`,
        content: Buffer.from(facturePdf.split(',')[1], 'base64'),
        contentType: 'application/pdf',
      },
    ],
  });
}