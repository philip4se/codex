'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone: string
  age: number
  job: string
  province: string
  city: string
  district: string | null
}

interface Response {
  id: string
  completedAt: string | null
  user: User
}

export default function SurveyResponsesPage() {
  const params = useParams()
  const surveyId = params.id as string

  const [survey, setSurvey] = useState<any>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/responses`)
      if (response.ok) {
        const data = await response.json()
        setSurvey(data.survey)
        setResponses(data.responses)
      }
    } catch (error) {
      console.error('Failed to fetch responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `survey_${surveyId}_responses.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('다운로드 중 오류가 발생했습니다')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                설문 응답 목록
              </h1>
              {survey && (
                <p className="text-gray-600">{survey.title}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={responses.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-300"
              >
                엑셀 다운로드
              </button>
              <Link
                href="/requester"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                목록으로
              </Link>
            </div>
          </div>

          {/* Responses */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">응답을 불러오는 중...</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 완료된 응답이 없습니다
              </h3>
              <p className="text-gray-600">응답자가 설문을 완료하면 여기에 표시됩니다</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-900">
                  총 {responses.length}명의 응답자
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이름</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">연락처</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이메일</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">나이</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">직업</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">거주지역</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">완료일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {responses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{response.user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{response.user.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{response.user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{response.user.age}세</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{response.user.job}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {response.user.province} {response.user.city}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {response.completedAt
                            ? new Date(response.completedAt).toLocaleString('ko-KR')
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
