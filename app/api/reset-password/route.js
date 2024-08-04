import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendOtp } from '@/lib/sendGrid';

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongoDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetPasswordToken = hashedOtp;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendOtp(email, otp);

    return NextResponse.json({ message: 'OTP sent to your email', userId: user._id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while sending OTP.', error: error.message },
      { status: 500 }
    );
  }
}

