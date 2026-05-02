import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, username, password } = await request.json();

    if (!name || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const userRole = "student";
    const user = await User.create({
      name,
      username,
      password,
      role: userRole,
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "ucer_secret_key");
    const token = await new SignJWT({ id: user._id.toString(), role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, role: user.role },
    }, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
