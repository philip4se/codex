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
                name: true,
                email: true,
                phone: true,
                age: true,
                job: true,
                province: true,
                city: true,
              },
            },
          },
          where: {
            isCompleted: true,
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

    // CSV 데이터 생성
    const headers = ['이름', '이메일', '연락처', '나이', '직업', '거주지역', '완료일시']
    const rows = survey.responses.map(response => [
      response.user.name,
      response.user.email,
      response.user.phone,
      response.user.age.toString(),
      response.user.job,
      `${response.user.province} ${response.user.city}`,
      response.completedAt ? new Date(response.completedAt).toLocaleString('ko-KR') : '',
    ])

    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    // BOM 추가 (엑셀에서 한글이 깨지지 않도록)
    const bom = '\uFEFF'
    const csvWithBom = bom + csvContent

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey_${survey.id}_responses.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: '내보내기 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
