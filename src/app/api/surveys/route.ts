import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      contentType,
      contentUrl,
      targetAgeMin,
      targetAgeMax,
      targetProvince,
      targetCity,
      targetJob,
      hasReward,
      rewardType,
      rewardValue,
      rewardCondition,
      maxResponses,
    } = body

    if (!title || !contentUrl) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요' },
        { status: 400 }
      )
    }

    const survey = await prisma.survey.create({
      data: {
        title,
        description: description || null,
        contentType: contentType || 'google_sheet',
        contentUrl,
        targetAgeMin: targetAgeMin || null,
        targetAgeMax: targetAgeMax || null,
        targetProvince: targetProvince || null,
        targetCity: targetCity || null,
        targetJob: targetJob || null,
        hasReward: hasReward || false,
        rewardType: rewardType || null,
        rewardValue: rewardValue || null,
        rewardCondition: rewardCondition || null,
        maxResponses: maxResponses || null,
        status: 'active',
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: '설문이 성공적으로 등록되었습니다',
        survey,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Survey creation error:', error)
    return NextResponse.json(
      { error: '설문 등록 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // 사용자별 맞춤 설문 조회 (참여자용)
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다' },
          { status: 404 }
        )
      }

      // 타겟팅 조건에 맞는 설문 찾기
      const surveys = await prisma.survey.findMany({
        where: {
          AND: [
            { status: 'active' },
            { creatorId: { not: userId } }, // 자신이 만든 설문 제외
            {
              OR: [
                { targetAgeMin: null },
                { targetAgeMin: { lte: user.age } },
              ],
            },
            {
              OR: [
                { targetAgeMax: null },
                { targetAgeMax: { gte: user.age } },
              ],
            },
            {
              OR: [
                { targetProvince: null },
                { targetProvince: user.province },
              ],
            },
            {
              OR: [
                { targetCity: null },
                { targetCity: user.city },
              ],
            },
            {
              OR: [
                { targetJob: null },
                { targetJob: user.job },
              ],
            },
          ],
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
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

      // 이미 응답한 설문 확인
      const responseIds = await prisma.response.findMany({
        where: {
          userId,
          surveyId: { in: surveys.map(s => s.id) },
        },
        select: { surveyId: true, isCompleted: true },
      })

      const responseMap = new Map(responseIds.map(r => [r.surveyId, r.isCompleted]))

      const surveysWithStatus = surveys.map(survey => ({
        ...survey,
        userStatus: responseMap.has(survey.id)
          ? responseMap.get(survey.id)
            ? 'completed'
            : 'in_progress'
          : 'available',
      }))

      return NextResponse.json({ surveys: surveysWithStatus })
    }

    // 전체 설문 조회 (공개용)
    const surveys = await prisma.survey.findMany({
      where: status ? { status } : undefined,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
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
    console.error('Survey fetch error:', error)
    return NextResponse.json(
      { error: '설문 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
