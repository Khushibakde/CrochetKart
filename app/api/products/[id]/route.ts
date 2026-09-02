import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const client = await clientPromise
  const db = client.db("crochetkart")
  await db.collection("products").updateOne({ _id: new ObjectId(params.id) }, { $set: body })
  return NextResponse.json({ ...body, id: params.id })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db("crochetkart")
  await db.collection("products").deleteOne({ _id: new ObjectId(params.id) })
  return NextResponse.json({ success: true })
}