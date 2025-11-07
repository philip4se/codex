'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Survey {
  id: string
  title: string
  description: string
  hasReward: boolean
  rewardType: string | null
  rewardValue: string | null
  createdAt: string
  creator: {
    id: string
    name: string
  }
  _count: {
    responses: number
  }
  userStatus?: 'available' | 'in_progress' | 'completed'
}

export default function ParticipantPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'in_progress' | 'completed'>('all')

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/surveys')
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

  const filteredSurveys = surveys.filter(survey => {
    if (filter === 'all') return true
    return survey.userStatus === filter
  })

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">완료</span>
      case 'in_progress':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">진행중</span>
      case 'available':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">참여 가능</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">설문 참여</h1>
            <p className="text-gray-600 mt-2">나에게 맞는 설문에 참여하세요</p>
          </div>
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            메인으로
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({surveys.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'available'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              참여 가능 ({surveys.filter(s => s.userStatus === 'available').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'in_progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              진행중 ({surveys.filter(s => s.userStatus === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              완료 ({surveys.filter(s => s.userStatus === 'completed').length})
            </button>
          </div>
        </div>

        {/* Surveys List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">설문 목록을 불러오는 중...</p>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">참여 가능한 설문이 없습니다</h3>
            <p className="text-gray-600">나중에 다시 확인해주세요</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSurveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{survey.title}</h3>
                      {getStatusBadge(survey.userStatus)}
                      {survey.hasReward && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {survey.rewardValue || '보상'}
                        </span>
                      )}
                    </div>
                    {survey.description && (
                      <p className="text-gray-600 mb-3">{survey.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>의뢰자: {survey.creator.name}</span>
                      <span>참여자: {survey._count.responses}명</span>
                      <span>등록일: {new Date(survey.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {survey.userStatus === 'completed' ? (
                      <button
                        disabled
                        className="px-6 py-2 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                      >
                        완료됨
                      </button>
                    ) : (
                      <Link
                        href={`/participant/survey/${survey.id}`}
                        className="block px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        {survey.userStatus === 'in_progress' ? '계속하기' : '참여하기'}
                      </Link>
                    )}
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
