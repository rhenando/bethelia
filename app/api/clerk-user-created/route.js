// /app/api/clerk-user-created/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req) {
  const bodyText = await req.text();
  const headerList = headers();
  const signature = headerList.get("clerk-signature");
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(bodyText, "utf8")
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(bodyText);
  const user = body.data;

  const userId = user.id;
  const email = user.email_addresses[0]?.email_address || "";
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  await setDoc(doc(db, "users", userId), {
    id: userId,
    email,
    name,
    role: "buyer", // customize based on signup type
    createdAt: new Date(),
  });

  return NextResponse.json({ status: "success" });
}
