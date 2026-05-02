import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteStats from "@/models/SiteStats";

export async function POST() {
  try {
    await dbConnect();
    const stats = await SiteStats.findOneAndUpdate(
      { type: "global" },
      { $inc: { visits: 1 } },
      { new: true, upsert: true }
    );
    return NextResponse.json({ visits: stats.visits });
  } catch (error) {
    return NextResponse.json({ visits: 0 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const stats = await SiteStats.findOne({ type: "global" });
    return NextResponse.json({ visits: stats ? stats.visits : 0 });
  } catch (error) {
    return NextResponse.json({ visits: 0 });
  }
}
