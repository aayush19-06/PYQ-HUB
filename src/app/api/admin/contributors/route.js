import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
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

// Get all pending contributors
export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const contributors = await User.find({
      role: "contributor",
      approved: { $exists: false } // Not yet approved
    }).select("-password");

    return NextResponse.json({ contributors }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// Approve/Reject contributor
export async function PATCH(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const { userId, action } = await request.json(); // action: "approve" or "reject"

    if (!userId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "contributor") {
      return NextResponse.json({ error: "User not found or not a contributor" }, { status: 404 });
    }

    if (action === "approve") {
      user.approved = true;
      user.approvedAt = new Date();
      user.approvedBy = admin.id;
      
      // Create notification
      await Notification.create({
        userId: user._id,
        type: "approved",
        title: "Contributor Account Approved! ✅",
        message: "Your contributor account has been approved. You can now upload papers!",
        link: "/upload"
      });
    } else {
      user.approved = false;
      user.approvalReason = "Rejected by admin";
      
      // Create notification
      await Notification.create({
        userId: user._id,
        type: "rejected",
        title: "Contributor Request Rejected ❌",
        message: "Unfortunately, your contributor request was not approved at this time.",
        link: "/how-to-upload"
      });
    }

    await user.save();

    return NextResponse.json(
      { message: `Contributor ${action}ed successfully`, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
