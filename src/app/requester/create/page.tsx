'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { provinces, cities, jobs } from '@/lib/regions'

export default function CreateSurveyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'google_sheet',
    contentUrl: '',

    // 타겟팅
    targetAgeMin: '',
    targetAgeMax: '',
    targetProvince: '',
    targetCity: '',
    targetJob: '',

    // 보상
    hasReward: false,
    rewardType: '',
    rewardValue: '',
    rewardCondition: '설문 완료',

    maxResponses: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'targetProvince' ? { targetCity: '' } : {}),
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = '설문 제목을 입력해주세요'
    if (!formData.contentUrl) newErrors.contentUrl = '구글 시트 URL을 입력해주세요'

    if (formData.targetAgeMin && formData.targetAgeMax) {
      if (parseInt(formData.targetAgeMin) > parseInt(formData.targetAgeMax)) {
        newErrors.targetAgeMin = '최소 나이가 최대 나이보다 클 수 없습니다'
      }
    }

    if (formData.hasReward) {
      if (!formData.rewardType) newErrors.rewardType = '보상 종류를 선택해주세요'
      if (!formData.rewardValue) newErrors.rewardValue = '보상 내용을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          targetAgeMin: formData.targetAgeMin ? parseInt(formData.targetAgeMin) : null,
          targetAgeMax: formData.targetAgeMax ? parseInt(formData.targetAgeMax) : null,
          maxResponses: formData.maxResponses ? parseInt(formData.maxResponses) : null,
          targetProvince: formData.targetProvince || null,
          targetCity: formData.targetCity || null,
          targetJob: formData.targetJob || null,
          rewardType: formData.hasReward ? formData.rewardType : null,
          rewardValue: formData.hasReward ? formData.rewardValue : null,
          rewardCondition: formData.hasReward ? formData.rewardCondition : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '설문 등록에 실패했습니다')
      }

      alert('설문이 성공적으로 등록되었습니다!')
      router.push('/requester')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">새 설문 등록</h1>
            <p className="text-gray-600">설문지를 등록하고 타겟 응답자를 설정하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 기본 정보 */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">기본 정보</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설문 제목 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="설문의 제목을 입력하세요"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설문 설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="설문에 대한 간단한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    구글 시트 URL *
                  </label>
                  <input
                    type="url"
                    name="contentUrl"
                    value={formData.contentUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                  {errors.contentUrl && <p className="mt-1 text-sm text-red-600">{errors.contentUrl}</p>}
                  <p className="mt-1 text-sm text-gray-500">
                    구글 시트 설문지의 공유 링크를 입력하세요
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 응답 수 (선택사항)
                  </label>
                  <input
                    type="number"
                    name="maxResponses"
                    value={formData.maxResponses}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="제한 없음"
                  />
                </div>
              </div>
            </div>

            {/* 타겟 설정 */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">타겟 응답자 설정</h2>
              <p className="text-sm text-gray-600 mb-4">
                설정하지 않으면 모든 사용자에게 노출됩니다
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최소 나이
                    </label>
                    <input
                      type="number"
                      name="targetAgeMin"
                      value={formData.targetAgeMin}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최대 나이
                    </label>
                    <input
                      type="number"
                      name="targetAgeMax"
                      value={formData.targetAgeMax}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 30"
                    />
                  </div>
                </div>
                {errors.targetAgeMin && <p className="text-sm text-red-600">{errors.targetAgeMin}</p>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      도/시
                    </label>
                    <select
                      name="targetProvince"
                      value={formData.targetProvince}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">전체</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시/군/구
                    </label>
                    <select
                      name="targetCity"
                      value={formData.targetCity}
                      onChange={handleChange}
                      disabled={!formData.targetProvince}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">전체</option>
                      {formData.targetProvince && cities[formData.targetProvince]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직업
                  </label>
                  <select
                    name="targetJob"
                    value={formData.targetJob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {jobs.map(job => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 보상 설정 */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">보상 설정</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasReward"
                    name="hasReward"
                    checked={formData.hasReward}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasReward" className="ml-2 text-sm font-medium text-gray-700">
                    보상 제공
                  </label>
                </div>

                {formData.hasReward && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        보상 종류 *
                      </label>
                      <select
                        name="rewardType"
                        value={formData.rewardType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">선택하세요</option>
                        <option value="gifticon">기프티콘</option>
                        <option value="culture_voucher">모바일 문화상품권</option>
                        <option value="cash">현금</option>
                        <option value="other">기타</option>
                      </select>
                      {errors.rewardType && <p className="mt-1 text-sm text-red-600">{errors.rewardType}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        보상 내용 *
                      </label>
                      <input
                        type="text"
                        name="rewardValue"
                        value={formData.rewardValue}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 스타벅스 아메리카노, 5,000원 문화상품권"
                      />
                      {errors.rewardValue && <p className="mt-1 text-sm text-red-600">{errors.rewardValue}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        보상 지급 조건
                      </label>
                      <input
                        type="text"
                        name="rewardCondition"
                        value={formData.rewardCondition}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 설문 완료"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {loading ? '등록 중...' : '설문 등록'}
              </button>
              <Link
                href="/requester"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
