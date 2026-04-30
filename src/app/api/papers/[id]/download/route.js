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

export async function POST(request, { params }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const paperId = params.id;
    const paper = await Paper.findById(paperId);

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // Increment download count
    paper.downloads = (paper.downloads || 0) + 1;
    
    // Track download (optional - for future analytics)
    if (!paper.downloadedBy) {
      paper.downloadedBy = [];
    }
    paper.downloadedBy.push({
      userId: user.id,
      downloadedAt: new Date()
    });

    await paper.save();

    // Return redirect to cloudinary URL
    return NextResponse.json({
      downloadUrl: paper.link,
      fileName: paper.title,
      downloads: paper.downloads
    }, { status: 200 });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
