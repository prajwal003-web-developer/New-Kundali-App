import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'लगआउट सफल भयो।' })
  response.cookies.delete('auth_token')
  return response
}
