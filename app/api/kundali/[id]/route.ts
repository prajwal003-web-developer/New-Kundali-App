import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import KundaliModel from '@/models/Kundali'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return NextResponse.json({ error: 'लगइन आवश्यक छ।' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'अमान्य सत्र।' }, { status: 401 })

    await connectDB()

    const kundali = await KundaliModel.findOne({
      _id: params.id,
      userId: user.userId,
    })

    if (!kundali) {
      return NextResponse.json({ error: 'कुण्डली फेला परेन।' }, { status: 404 })
    }

    return NextResponse.json({ kundali })
  } catch (error) {
    console.error('Kundali fetch error:', error)
    return NextResponse.json({ error: 'डेटा लोड गर्न त्रुटि भयो।' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return NextResponse.json({ error: 'लगइन आवश्यक छ।' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'अमान्य सत्र।' }, { status: 401 })

    await connectDB()

    const deleted = await KundaliModel.findOneAndDelete({
      _id: params.id,
      userId: user.userId,
    })

    if (!deleted) {
      return NextResponse.json({ error: 'कुण्डली फेला परेन।' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'कुण्डली मेटाइयो।' })
  } catch (error) {
    console.error('Kundali delete error:', error)
    return NextResponse.json({ error: 'मेटाउन त्रुटि भयो।' }, { status: 500 })
  }
}
