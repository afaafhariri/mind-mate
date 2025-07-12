import { NextResponse } from "next/server";
import connectDB from "@lib/mongoose";
import Journal from "@models/journal";
import User from "@models/users";
import jwt from "jsonwebtoken";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function verifyToken(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function POST(req) {
  await connectDB();

  try {
    const decoded = verifyToken(req);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const journals = await Journal.find({
      userId: decoded.userId,
      createdAt: { $gte: oneWeekAgo },
    });

    if (!journals.length) {
      return NextResponse.json(
        { error: "No journals in last 7 days" },
        { status: 404 }
      );
    }

    const textContent = journals
      .map((j) => `Topic: ${j.topic}\n${j.body}`)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a mental health assistant. Based on the journal entries provided, decide if the user's mental health state is 'positive' or 'negative'. Reply with ONLY 'positive' or 'negative'.`,
        },
        {
          role: "user",
          content: textContent,
        },
      ],
    });

    const response = completion.choices[0].message.content.trim().toLowerCase();

    if (!["positive", "negative"].includes(response)) {
      return NextResponse.json(
        { error: "Unexpected response from AI", response },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(decoded.userId, { mentalstate: response });

    return NextResponse.json({ mentalstate: response });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
