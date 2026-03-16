import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      payment_method_types: ["card"],
      description: "Réservation train",
    });

    return Response.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const piId = searchParams.get("pi");

    const paymentIntent = await stripe.paymentIntents.retrieve(piId, {
      expand: ["payment_method"],
    });

    const card = paymentIntent.payment_method?.card;

    return Response.json({
      last4: card?.last4 || "????",
      exp_month: String(card?.exp_month).padStart(2, "0"),
      exp_year: String(card?.exp_year).slice(-2),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}