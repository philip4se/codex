'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Survey {
  id: string
  title: string
  description: string
  status: string
  hasReward: boolean
  rewardType: string | null
  createdAt: string
  _count?: {
    responses: number
  }
}

export default function RequesterPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/surveys/my-surveys')
      if (response.ok) {
        const data = await response.json()
        setSurveys(data.surveys)
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">설문 의뢰 관리</h1>
            <p className="text-gray-600 mt-2">내가 등록한 설문을 관리하세요</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/requester/create"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              새 설문 등록
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              메인으로
            </Link>
          </div>
        </div>

        {/* Surveys List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">설문 목록을 불러오는 중...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">등록된 설문이 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 설문을 등록해보세요!</p>
            <Link
              href="/requester/create"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              설문 등록하기
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{survey.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        survey.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : survey.status === 'closed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {survey.status === 'active' ? '진행중' : survey.status === 'closed' ? '마감' : '임시저장'}
                      </span>
                      {survey.hasReward && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          보상 있음
                        </span>
                      )}
                    </div>
                    {survey.description && (
                      <p className="text-gray-600 mb-3">{survey.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>응답 수: {survey._count?.responses || 0}명</span>
                      <span>등록일: {new Date(survey.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/requester/survey/${survey.id}`}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      상세보기
                    </Link>
                    <Link
                      href={`/requester/survey/${survey.id}/responses`}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      응답보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
