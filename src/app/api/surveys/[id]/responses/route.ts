import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const { id } = params

    // 설문 소유자 확인
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                job: true,
                province: true,
                city: true,
                district: true,
              },
            },
          },
          where: {
            isCompleted: true,
          },
          orderBy: {
            completedAt: 'desc',
          },
        },
      },
    })

    if (!survey) {
      return NextResponse.json(
        { error: '설문을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    if (survey.creatorId !== userId) {
      return NextResponse.json(
        { error: '권한이 없습니다' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
      },
      responses: survey.responses,
    })
  } catch (error) {
    console.error('Responses fetch error:', error)
    return NextResponse.json(
      { error: '응답 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
