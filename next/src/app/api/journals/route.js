import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@lib/mongoose";
import journal from "@models/journal";
import User from "@models/users";

export async function POST(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, body, location } = await req.json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const journal = await Journal.create({
      topic,
      body,
      location,
      userId: decoded.userId,
    });

    await User.findByIdAndUpdate(decoded.userId, {
      $inc: { totalJournals: 1 },
    });

    return NextResponse.json(journal, { status: 201 });
  } catch (error) {
    console.error("Error creating journal:", error);
    return NextResponse.json(
      { error: "Error creating journal" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const journals = await Journal.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(journals, { status: 200 });
  } catch (error) {
    console.error("Error fetching journals:", error);
    return NextResponse.json(
      { error: "Error fetching journals" },
      { status: 500 }
    );
  }
}
