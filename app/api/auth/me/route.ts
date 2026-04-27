import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'प्रमाणीकरण आवश्यक छ।' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'अमान्य टोकन।' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: payload.userId,
        username: payload.username,
        name: payload.name,
      },
    })
  } catch {
    return NextResponse.json({ error: 'सर्भर त्रुटि।' }, { status: 500 })
  }
}
