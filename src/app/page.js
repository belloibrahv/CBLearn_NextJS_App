import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CBLearn</span>
          </div>
          <div className="flex space-x-4">
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Computer Based Learning Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            An interactive e-learning platform designed to enhance computer science education through
            multimedia lessons, interactive quizzes, and progress tracking. Built for students to learn
            at their own pace with engaging content and immediate feedback.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Modules</h3>
            <p className="text-gray-600">
              Access comprehensive modules covering various computer science topics with multimedia content.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quizzes & Assessment</h3>
            <p className="text-gray-600">
              Test your knowledge with interactive quizzes and receive instant feedback on your performance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your learning progress with detailed analytics and performance history.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Project Team</h2>
          
          {/* Supervisor */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Supervisor</h3>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl text-center max-w-sm">
                <div className="w-24 h-24 bg-indigo-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Mrs. Ogunbanjo</h4>
                <p className="text-gray-600">Project Supervisor</p>
              </div>
            </div>
          </div>

          {/* Student Researchers */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Student Researchers</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl text-center">
                <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Lawal Habeeb Ayinde</h4>
                <p className="text-gray-600 text-sm mb-2">Matric Number: 20220204291</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  Student Researcher
                </span>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl text-center">
                <div className="w-20 h-20 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Ibuola Bukola Deborah</h4>
                <p className="text-gray-600 text-sm mb-2">Matric Number: 20220204300</p>
                <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                  Student Researcher
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8 border-t">
          <p>&copy; 2026 CBLearn. A Computer Based Learning Platform.</p>
          <p className="mt-2 text-sm">Department of Computer Science, Tai Solarin University of Education</p>
        </footer>
      </main>
    </div>
  );
}
