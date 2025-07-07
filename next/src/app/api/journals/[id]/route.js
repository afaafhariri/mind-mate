import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@lib/mongoose";
import Journal from "@models/journal";
import User from "@models/users";

function verifyToken(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) throw new Error("Unauthorized");

  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = params;
  console.log("Deleting journal ID:", id);

  if (!id) {
    return NextResponse.json(
      { error: "Journal ID is missing" },
      { status: 400 }
    );
  }

  try {
    const decoded = verifyToken(req);

    const deletedJournal = await Journal.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });

    if (!deletedJournal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(decoded.userId, {
      $inc: { totalJournals: -1 },
    });

    return NextResponse.json(
      { message: "Journal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting journal:", error);
    return NextResponse.json(
      { error: error.message || "Error deleting journal" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { topic, body, location } = await req.json();

  try {
    const decoded = verifyToken(req);

    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { topic, body, location, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedJournal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    return NextResponse.json(updatedJournal, { status: 200 });
  } catch (error) {
    console.error("Error updating journal:", error);
    return NextResponse.json(
      { error: error.message || "Error updating journal" },
      { status: 401 }
    );
  }
}
