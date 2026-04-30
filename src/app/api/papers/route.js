import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Paper from "@/models/Paper";
import { jwtVerify } from "jose";

async function getUserFromRequest(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "ucer_secret_key");
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch { return null; }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = {};

    if (searchParams.get("branch")) query.branch = searchParams.get("branch");
    if (searchParams.get("semester")) query.semester = Number(searchParams.get("semester"));
    if (searchParams.get("category")) query.category = searchParams.get("category");
    if (searchParams.get("subject")) query.subject = new RegExp(searchParams.get("subject"), "i");
    if (searchParams.get("year")) query.year = Number(searchParams.get("year"));

    const papers = await Paper.find(query)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ papers });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || (user.role !== "contributor" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized: Contributors only" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { title, branch, semester, category, subject, year, link } = body;

    if (!title || !branch || !semester || !category || !subject || !year || !link) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const paper = await Paper.create({
      title, branch, semester, category, subject, year, link,
      uploadedBy: user.id,
    });

    return NextResponse.json({ paper }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Paper.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
