import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
console.log("DEBUG - loaded URI:", uri)

if (!uri) {
  console.error("❌ Still could not find MONGODB_URI")
  process.exit(1)
}

const client = new MongoClient(uri)
try {
  await client.connect()
  const db = client.db("crochetkart")
  await db.command({ ping: 1 })
  console.log("✅ Connected successfully to MongoDB Atlas!")
} catch (e) {
  console.error("❌ Connection failed:", e.message)
} finally {
  await client.close()
}