import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "lib/mongoose";
import User from "@models/users";

export async function POST(req) {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      age,
      country,
      city,
      occupation,
    } = await req.json();

    if (
      !firstName ||
      !email ||
      !password ||
      !gender ||
      !age ||
      !country ||
      !city ||
      !occupation
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      age: parseInt(age, 10),
      country,
      city,
      occupation,
    });

    await newUser.save();

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
