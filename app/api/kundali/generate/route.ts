import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import KundaliModel from '@/models/Kundali'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { calculateKundali } from '@/lib/astrology'
import { generateAIInterpretation } from '@/lib/aiInterpretation'
import { bsToAd } from '@/lib/bsConverter'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'लगइन आवश्यक छ।' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'अमान्य सत्र।' }, { status: 401 })
    }

    const body = await request.json()
    const {
      fullName, gender,
      calendarType, adYear, adMonth, adDay,
      bsYear, bsMonth, bsDay,
      birthHour, birthMinute,
      country, province, district, state,
      latitude, longitude, altitude,
    } = body

    // Resolve AD date
    let resolvedYear = adYear, resolvedMonth = adMonth, resolvedDay = adDay
    const resolvedBsYear = bsYear, resolvedBsMonth = bsMonth, resolvedBsDay = bsDay

    if (calendarType === 'BS') {
      const ad = bsToAd({ year: bsYear, month: bsMonth, day: bsDay })
      resolvedYear  = ad.year
      resolvedMonth = ad.month
      resolvedDay   = ad.day
    }

    if (!fullName || !gender || !resolvedYear || !resolvedMonth || !resolvedDay) {
      return NextResponse.json(
        { error: 'सबै आवश्यक फिल्डहरू भर्नुहोस्।' },
        { status: 400 }
      )
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'जन्म स्थान अक्षांश/देशान्तर आवश्यक छ।' },
        { status: 400 }
      )
    }

    // ── calculateKundali is now async (WASM init) ──────────────────────────
    const chartData = await calculateKundali({
      year:      Number(resolvedYear),
      month:     Number(resolvedMonth),
      day:       Number(resolvedDay),
      hour:      Number(birthHour  ?? 12),
      minute:    Number(birthMinute ?? 0),
      latitude:  parseFloat(latitude),
      longitude: parseFloat(longitude),
      altitude:  parseFloat(altitude)  || 0,
      utcOffset: country === 'Nepal' ? 5.75 : 5.5,
    })

    // Generate AI interpretation (Anthropic API)
    const aiInterpretation = await generateAIInterpretation(chartData, fullName)

    // Save to MongoDB
    await connectDB()

    const kundali = await KundaliModel.create({
      userId: user.userId,
      personalInfo: {
        fullName,
        gender,
        dateOfBirth: {
          adYear:       Number(resolvedYear),
          adMonth:      Number(resolvedMonth),
          adDay:        Number(resolvedDay),
          bsYear:       resolvedBsYear  ? Number(resolvedBsYear)  : undefined,
          bsMonth:      resolvedBsMonth ? Number(resolvedBsMonth) : undefined,
          bsDay:        resolvedBsDay   ? Number(resolvedBsDay)   : undefined,
          calendarType: calendarType || 'AD',
        },
        timeOfBirth: {
          hour:   Number(birthHour  ?? 12),
          minute: Number(birthMinute ?? 0),
        },
        birthPlace: {
          country,
          province: province || undefined,
          district: district || undefined,
          state:    state    || undefined,
          latitude:  parseFloat(latitude),
          longitude: parseFloat(longitude),
          altitude:  parseFloat(altitude) || 0,
        },
      },
      chartData,
      aiInterpretation,
    })

    return NextResponse.json({
      success: true,
      message: 'कुण्डली सफलतापूर्वक बनाइयो!',
      kundaliId: kundali._id.toString(),
      chartData,
      aiInterpretation,
    })
  } catch (error: any) {
    console.error('Kundali generation error:', error)
    return NextResponse.json(
      { error: error.message || 'कुण्डली बनाउन त्रुटि भयो।' },
      { status: 500 }
    )
  }
}
