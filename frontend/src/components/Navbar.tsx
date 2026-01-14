'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                설문 매칭 플랫폼
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                대시보드
              </Link>
              <Link
                href="/surveys"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                설문 목록
              </Link>
              <Link
                href="/matched-surveys"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                참여 가능 설문
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-4">
              {user?.name}님
            </span>
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 mr-4"
            >
              프로필
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
