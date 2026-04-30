import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
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

// Get user's notifications
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const notifications = await Notification.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: user.id, read: false });

    return NextResponse.json({ notifications, unreadCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// Mark notification as read
export async function PATCH(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const { notificationId, markAllAsRead } = await request.json();

    if (markAllAsRead) {
      await Notification.updateMany({ userId: user.id, read: false }, { read: true });
      return NextResponse.json({ message: "All notifications marked as read" }, { status: 200 });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification || notification.userId.toString() !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    notification.read = true;
    await notification.save();

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// Delete notification
export async function DELETE(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const { notificationId } = await request.json();

    const notification = await Notification.findById(notificationId);
    if (!notification || notification.userId.toString() !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await Notification.findByIdAndDelete(notificationId);

    return NextResponse.json({ message: "Notification deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
