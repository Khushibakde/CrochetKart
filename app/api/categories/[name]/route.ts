import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function DELETE(_request: Request, context: { params: Promise<{ name: string }> | { name: string } }) {
  const params = await context.params
  const client = await clientPromise
  const db = client.db("crochetkart")
  await db.collection("categories").deleteOne({ name: decodeURIComponent(params.name) })
  return NextResponse.json({ success: true })
}