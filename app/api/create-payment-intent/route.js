// app/api/create-payment-intent/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  try {
    const { total } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // amount in cents
      currency: "usd",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
