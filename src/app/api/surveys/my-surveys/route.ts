import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const surveys = await prisma.survey.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ surveys })
  } catch (error) {
    console.error('My surveys fetch error:', error)
    return NextResponse.json(
      { error: '설문 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
