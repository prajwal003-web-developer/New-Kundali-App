import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username र पासवर्ड आवश्यक छ।' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ username: username.toLowerCase().trim() })
    if (!user) {
      return NextResponse.json(
        { error: 'Username वा पासवर्ड गलत छ।' },
        { status: 401 }
      )
    }

    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Username वा पासवर्ड गलत छ।' },
        { status: 401 }
      )
    }

    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      name: user.name,
    })

    const response = NextResponse.json({
      success: true,
      message: 'लगइन सफल भयो!',
      user: { id: user._id, username: user.username, name: user.name },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'सर्भर त्रुटि। पुनः प्रयास गर्नुहोस्।' }, { status: 500 })
  }
}
