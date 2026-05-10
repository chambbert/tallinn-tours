import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { adminLoginSchema } from '@/lib/validations'

const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = adminLoginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      // Use constant-time comparison to avoid timing attacks
      await bcrypt.hash(password, 12)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const passwordValid = await bcrypt.compare(password, admin.passwordHash)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({ adminId: admin.id, email: admin.email })

    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (error) {
    console.error('[POST /api/admin/auth]', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/admin/auth]', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
