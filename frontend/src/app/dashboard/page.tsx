'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Survey } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const [mySurveys, setMySurveys] = useState<Survey[]>([]);
  const [matchedSurveys, setMatchedSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // 내가 만든 설문 조회
        const surveysRes = await api.get(`/surveys?userId=${user?.id}`);
        setMySurveys(surveysRes.data.slice(0, 5));

        // 나에게 맞는 설문 조회
        const matchedRes = await api.get('/participation/matched-surveys');
        setMatchedSurveys(matchedRes.data.slice(0, 5));
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            안녕하세요, {user.name}님!
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 내가 만든 설문 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    내가 만든 설문
                  </h2>
                  <Link
                    href="/surveys/create"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    + 새 설문 만들기
                  </Link>
                </div>

                {mySurveys.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    아직 만든 설문이 없습니다.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {mySurveys.map((survey) => (
                      <li key={survey.id} className="py-3">
                        <Link href={`/surveys/${survey.id}`}>
                          <p className="text-sm font-medium text-gray-900 hover:text-primary-600">
                            {survey.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            응답 {survey.currentResponseCount}/{survey.targetResponseCount} · {survey.status}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 참여 가능한 설문 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    참여 가능한 설문
                  </h2>
                  <Link
                    href="/matched-surveys"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    전체 보기
                  </Link>
                </div>

                {matchedSurveys.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    현재 참여 가능한 설문이 없습니다.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {matchedSurveys.map((survey) => (
                      <li key={survey.id} className="py-3">
                        <Link href={`/surveys/${survey.id}/participate`}>
                          <p className="text-sm font-medium text-gray-900 hover:text-primary-600">
                            {survey.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {survey.reward?.rewardName && `보상: ${survey.reward.rewardName}`}
                            {survey.estimatedDuration && ` · ${survey.estimatedDuration}분`}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        총 생성 설문
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {mySurveys.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        참여 가능 설문
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {matchedSurveys.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
