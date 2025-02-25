import { NextResponse } from 'next/server'
import CryptoJS from 'crypto-js'

export async function POST(request: Request) {
  let { email, password: encryptedPassword } = await request.json()

  // Decrypt the password
  const secretKey = process.env.ENCRYPTION_KEY!
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey)
  const password = bytes.toString(CryptoJS.enc.Utf8)

  try {
    const payloadLoginUrl = `${process.env.NEXT_SERVER_URL}/api/users/login`
    const response = await fetch(payloadLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.log('errorData', errorData)
      return NextResponse.json(
        { message: errorData.message || 'Login failed' },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Set cookies from Payload response
    const headers = new Headers()
    const cookies = response.headers.get('Set-Cookie')
    if (cookies) {
      headers.append('Set-Cookie', cookies)
    }
    return NextResponse.json({ user: data.user }, { headers })
  } catch (error) {
    console.log('error', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
