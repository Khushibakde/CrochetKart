import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  const client = await clientPromise
  const db = client.db("crochetkart")
  const products = await db.collection("products").find({}).toArray()
  const mapped = products.map((p) => ({ ...p, id: p._id.toString(), _id: undefined }))
  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const body = await request.json()
  const client = await clientPromise
  const db = client.db("crochetkart")
  const result = await db.collection("products").insertOne(body)
  return NextResponse.json({ ...body, id: result.insertedId.toString() })
}