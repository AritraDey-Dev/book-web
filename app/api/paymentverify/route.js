import { NextResponse } from "next/server";
import Stripe from "stripe";
import Payment from "@/models/Payment";
import { connectMongoDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  try {
    const {
      name,
      email,
      phone,
      address,
      payment,
      items,
      total,
      payment_intent_id,
    } = await req.json();

    await connectMongoDB();

    // Get the user ID from the authorization token
    const authorizationHeader = req.headers.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header is missing or invalid' },
        { status: 401 }
      );
    }

    const token = authorizationHeader.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Verify the Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { message: "fail" },
        { status: 400 }
      );
    }

    // Find or create a Payment record
    let paymentRecord = await Payment.findOne({ user: userId });

    if (!paymentRecord) {
      paymentRecord = await Payment.create({
        user: userId,
        name,
        email,
        phone,
        address,
        payment,
        items,
        total,
        stripe_payment_intent_id: payment_intent_id,
      });
    } else {
      // Update the existing Payment record if needed
      paymentRecord = await Payment.create({
        user: userId,
        name,
        email,
        phone,
        address,
        payment,
        items,
        total,
        stripe_payment_intent_id: payment_intent_id,
      });
    }

    return NextResponse.json(
      { message: "success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while payment verification.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();

    // Get the user ID from the authorization token
    const authorizationHeader = req.headers.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header is missing or invalid' },
        { status: 401 }
      );
    }

    const token = authorizationHeader.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the Payment records for this user
    const payments = await Payment.find({ user: userId });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching payment records.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
