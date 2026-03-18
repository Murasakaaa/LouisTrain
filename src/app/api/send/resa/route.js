import { sendResaMail } from '@/lib/email/sendResa';

export async function POST(request) {
  const { to, name, orderNumber, billetsPdf, facturePdf } = await request.json();

  await sendResaMail(to, { orderNumber, facturePdf, billetsPdf });

  return Response.json({ success: true });
}