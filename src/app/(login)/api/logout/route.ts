import { NextResponse } from 'next/server'

export async function POST() {
  const payloadLogoutUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/logout`

  const response = await fetch(payloadLogoutUrl, {
    method: 'POST',
    credentials: 'include',
  })

  const headers = new Headers()
  const cookies = response.headers.get('Set-Cookie')
  if (cookies) {
    headers.append('Set-Cookie', cookies)
  }

  return NextResponse.json({ success: true }, { headers })
}
