import mongoose from "mongoose";

const siteStatsSchema = new mongoose.Schema({
  type: { type: String, default: "global" },
  visits: { type: Number, default: 0 },
});

export default mongoose.models.SiteStats || mongoose.model("SiteStats", siteStatsSchema);
