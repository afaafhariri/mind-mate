import connectDB from "@lib/mongoose";
import User from "@models/users";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't send password back
    const { password, ...userWithoutPassword } = user._doc;

    return NextResponse.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
