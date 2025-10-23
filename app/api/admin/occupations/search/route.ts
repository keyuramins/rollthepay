// app/api/admin/occupations/search/route.ts
// API endpoint for searching occupations by country and query
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllOccupationsForSearch } from "@/lib/db/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const country = req.query.country as string;
  const q = (req.query.q as string) || ""; // optional search query
  const limit = 1000; // max results to return, adjust as needed

  if (!country) {
    return res.status(400).json({ error: "Missing country parameter" });
  }

  try {
    // Fetch all occupations for the country
    let occupations = await getAllOccupationsForSearch(country, limit);

    // If a search query exists, filter server-side for faster dropdown
    if (q.trim().length > 0) {
      const queryLower = q.trim().toLowerCase();

      occupations = occupations.filter((occ) => {
        const title = occ.title.toLowerCase();
        const state = occ.state?.toLowerCase() ?? "";
        const location = occ.location?.toLowerCase() ?? "";
        return (
          title.includes(queryLower) ||
          state.includes(queryLower) ||
          location.includes(queryLower)
        );
      });
    }

    res.status(200).json(occupations);
  } catch (err) {
    console.error("Error fetching occupations:", err);
    res.status(500).json({ error: "Failed to fetch occupations" });
  }
}
