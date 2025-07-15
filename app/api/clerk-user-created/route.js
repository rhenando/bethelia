import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = headers().get("clerk-signature");
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Webhook signature mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const user = body.data;

    const userId = user.id;
    const email = user.email_addresses[0]?.email_address || "";
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    await setDoc(doc(db, "users", userId), {
      id: userId,
      name: fullName,
      email,
      role: "buyer",
      createdAt: new Date(),
    });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("🔥 Webhook Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
