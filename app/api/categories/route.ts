import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const defaultCategories = [
  { name: "Hair Accessories", emoji: "🎀", href: "#shop" },
  { name: "Bouquets", emoji: "💐", href: "#shop" },
  { name: "Blankets", emoji: "🧶", href: "#shop" },
  { name: "Amigurumi", emoji: "🧸", href: "#shop" },
  { name: "Home Decor", emoji: "🏡", href: "#shop" },
  { name: "Baby Items", emoji: "👶", href: "#shop" },
  { name: "Bags", emoji: "👜", href: "#shop" },
  { name: "Keychains", emoji: "🔑", href: "#shop" },
  { name: "Curtain Ties", emoji: "🪢", href: "#shop" },
  { name: "Flower Pots", emoji: "🪴", href: "#shop" },
  { name: "Accessories", emoji: "✨", href: "#shop" },
]

export async function GET() {
  const client = await clientPromise
  const db = client.db("crochetkart")
  const existing = await db.collection("categories").find({}).toArray()

  if (existing.length === 0) {
    await db.collection("categories").insertMany(defaultCategories)
    return NextResponse.json(defaultCategories)
  }

  const mapped = existing.map((c) => ({ name: c.name, emoji: c.emoji, href: c.href }))
  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const body = await request.json()
  const client = await clientPromise
  const db = client.db("crochetkart")

  const existing = await db.collection("categories").findOne({
    name: { $regex: `^${body.name}$`, $options: "i" },
  })
  if (existing) {
    return NextResponse.json({ error: "Category already exists" }, { status: 400 })
  }

  const newCategory = { name: body.name, emoji: body.emoji, href: "#shop" }
  await db.collection("categories").insertOne(newCategory)
  return NextResponse.json(newCategory)
}