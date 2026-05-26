import { NextResponse } from "next/server";

// Base ID + table come from the Airtable example; override via env if needed.
const AIRTABLE_BASE_ID = "appUH4Cp6jG720uUL";
const AIRTABLE_TABLE_NAME = "Inquiries";

type EarlyListBody = {
  name?: string;
  lineId?: string;
  phone?: string;
};

export async function POST(request: Request) {
  const token = process.env.AIRTABLE_ACCESS_KEY;
  if (!token) {
    return NextResponse.json(
      { error: "Airtable is not configured." },
      { status: 500 },
    );
  }

  let body: EarlyListBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const lineId = body.lineId?.trim();
  const phone = body.phone?.trim();

  if (!name || !lineId || !phone) {
    return NextResponse.json(
      { error: "Name, Line ID, and Phone are all required." },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: name,
          "Line ID": lineId,
          Phone: phone,
        },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error("Airtable create failed:", res.status, detail);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 502 },
    );
  }

  const record = await res.json();
  return NextResponse.json({ id: record.id }, { status: 201 });
}
