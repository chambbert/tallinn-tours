import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface AdminTokenPayload {
  adminId: string
  email: string
  iat?: number
  exp?: number
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  return secret
}

export async function signToken(payload: { adminId: string; email: string }): Promise<string> {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '24h' })
}

export async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminTokenPayload
    return decoded
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}
