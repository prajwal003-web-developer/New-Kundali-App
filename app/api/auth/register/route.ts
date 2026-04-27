import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, name } = body

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'सबै फिल्ड आवश्यक छ।' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'पासवर्ड कम्तीमा ६ अक्षर हुनुपर्छ।' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ username: username.toLowerCase().trim() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'यो username पहिले नै छ। अर्को username छान्नुहोस्।' },
        { status: 409 }
      )
    }

    const user = await User.create({ username, password, name })

    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      name: user.name,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'दर्ता सफल भयो!',
        user: { id: user._id, username: user.username, name: user.name },
      },
      { status: 201 }
    )

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Register error:', error)
    if (error.code === 11000) {
      return NextResponse.json({ error: 'यो username पहिले नै छ।' }, { status: 409 })
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json({ error: messages[0] }, { status: 400 })
    }
    return NextResponse.json({ error: 'सर्भर त्रुटि। पुनः प्रयास गर्नुहोस्।' }, { status: 500 })
  }
}
