import { NextResponse } from "next/server";
import Stripe from "stripe";
import { nanoid } from 'nanoid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  const { total, email } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // Stripe amount is in cents
      currency: 'inr',
      receipt_email: email,
      description: `Order receipt: ${nanoid()}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while payment processing",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
