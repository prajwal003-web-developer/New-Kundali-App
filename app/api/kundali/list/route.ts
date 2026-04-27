import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import KundaliModel from '@/models/Kundali'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return NextResponse.json({ error: 'लगइन आवश्यक छ।' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'अमान्य सत्र।' }, { status: 401 })

    await connectDB()

    const kundalis = await KundaliModel.find({ userId: user.userId })
      .select('personalInfo.fullName personalInfo.gender personalInfo.dateOfBirth personalInfo.birthPlace chartData.lagna chartData.rashi chartData.nakshatra createdAt')
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({ kundalis })
  } catch (error) {
    console.error('Kundali list error:', error)
    return NextResponse.json({ error: 'डेटा लोड गर्न त्रुटि भयो।' }, { status: 500 })
  }
}
