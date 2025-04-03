import { NextResponse } from "next/server";
import { execFile } from "child_process";

export async function POST(req) {
  const { userId, movieIds } = await req.json();

  return new Promise((resolve, reject) => {
    execFile(
      "python",
      ["python-backend/recommend.py", userId, ...movieIds],
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error:", error);
          reject(NextResponse.json({ error: "Failed to fetch recommendations" }));
        } else {
          const recommendations = JSON.parse(stdout);
          resolve(NextResponse.json({ recommendations }));
        }
      }
    );
  });
}
