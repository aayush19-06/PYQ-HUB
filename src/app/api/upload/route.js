import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
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

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || (user.role !== "contributor" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const subject = formData.get("subject");
    const year = formData.get("year");
    const semester = formData.get("semester");
    const branch = formData.get("branch");
    const category = formData.get("category");

    if (!file || !title || !subject || !year || !semester || !branch || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "ucer_pyq", format: "pdf" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const paper = await Paper.create({
      title,
      subject,
      year: Number(year),
      semester: Number(semester),
      branch,
      category,
      link: uploadResult.secure_url,
      uploadedBy: user.id,
    });

    return NextResponse.json({ success: true, paper }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}