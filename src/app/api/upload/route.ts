import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "src/data/Concerts.csv");

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.name.endsWith(".csv")) {
    return NextResponse.json(
      { error: "Please upload a .csv file" },
      { status: 400 }
    );
  }

  const content = await file.text();

  if (!content.trim()) {
    return NextResponse.json(
      { error: "File is empty" },
      { status: 400 }
    );
  }

  fs.writeFileSync(CSV_PATH, content);

  return NextResponse.json({ success: true });
}
