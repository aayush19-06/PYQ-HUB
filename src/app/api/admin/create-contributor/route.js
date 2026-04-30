import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, username, password, adminSecret } = await request.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Invalid admin secret passcode" }, { status: 403 });
    }

    if (!name || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const user = await User.create({
      name,
      username,
      password,
      role: "contributor",
    });

    return NextResponse.json({
      message: "Contributor created successfully!",
      user: { id: user._id, name: user.name, username: user.username, role: user.role },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
