import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, message: "Contact form delivery is not configured. Please use the published email address." },
    { status: 501 },
  );
}
