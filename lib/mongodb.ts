import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://prajwal_sms:prajwal123@cluster0.rc5yn3r.mongodb.net/astro?appName=Cluster0"

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

declare const global: GlobalWithMongoose

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
