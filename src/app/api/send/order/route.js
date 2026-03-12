import { sendOrderConfirmation } from '@/lib/email/orderConfirm';

export async function POST(request) {
  const { to, name, orderNumber, billetsPdf, facturePdf } = await request.json();

  await sendOrderConfirmation(to, { orderNumber, facturePdf, billetsPdf });

  return Response.json({ success: true });
}