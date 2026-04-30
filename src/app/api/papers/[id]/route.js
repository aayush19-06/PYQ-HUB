import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Paper from "@/models/Paper";
import { jwtVerify } from "jose";

async function getUserFromRequest(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Get single paper
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const paper = await Paper.findById(params.id).populate("uploadedBy", "name");
    
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ paper }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// Update paper
export async function PATCH(request, { params }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const paper = await Paper.findById(params.id);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // Check if user is the owner or admin
    if (paper.uploadedBy.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to update this paper" }, { status: 403 });
    }

    const { title, subject, year, semester, branch, category } = await request.json();

    if (title) paper.title = title;
    if (subject) paper.subject = subject;
    if (year) paper.year = Number(year);
    if (semester) paper.semester = Number(semester);
    if (branch) paper.branch = branch;
    if (category) paper.category = category;

    await paper.save();

    return NextResponse.json({ paper }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// Delete paper
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const paper = await Paper.findById(params.id);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // Check if user is the owner or admin
    if (paper.uploadedBy.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to delete this paper" }, { status: 403 });
    }

    await Paper.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Paper deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
