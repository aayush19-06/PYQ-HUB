import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Paper from "@/models/Paper";
import User from "@/models/User";
import { jwtVerify } from "jose";

async function getAdminFromRequest(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    // Get all papers
    const allPapers = await Paper.find({}).lean();
    
    // Get users stats
    const totalUsers = await User.countDocuments();
    const totalContributors = await User.countDocuments({ role: "contributor" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const approvedContributors = await User.countDocuments({ role: "contributor", approved: true });
    const pendingContributors = await User.countDocuments({ role: "contributor", approved: { $ne: true } });
    
    // Get papers stats
    const totalPapers = allPapers.length;
    const totalDownloads = allPapers.reduce((sum, p) => sum + (p.downloads || 0), 0);
    
    // Top papers by downloads
    const topPapers = allPapers
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 5)
      .map(p => ({
        title: p.title,
        subject: p.subject,
        downloads: p.downloads || 0
      }));

    // Papers by category
    const papersByCategory = allPapers.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    // Papers by branch
    const papersByBranch = allPapers.reduce((acc, p) => {
      acc[p.branch] = (acc[p.branch] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      users: {
        total: totalUsers,
        contributors: totalContributors,
        students: totalStudents,
        approvedContributors,
        pendingContributors
      },
      papers: {
        total: totalPapers,
        totalDownloads,
        byCategory: papersByCategory,
        byBranch: papersByBranch,
        topPapers
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
