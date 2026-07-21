import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      {/* Top Navigation */}
      <div className="md-topbar">
        <div className="md-brand">
          <div className="mark"><span className="material-symbols-outlined">school</span></div>
          CBLearn
        </div>
        <div className="md-nav">
          {user ? (
            <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="active">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dashboard</span>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                Sign In
              </Link>
              <Link href="/register" className="md-btn-filled" style={{ padding: '8px 16px' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="md-auth-visual" style={{ minHeight: '70vh', padding: '80px 60px', alignItems: 'center' }}>
        <div style={{ maxWidth: 700 }}>
          <div className="md-label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>COMPUTER-BASED LEARNING PLATFORM</div>
          <h1 className="md-display" style={{ fontSize: 48, color: '#fff', marginBottom: 24, lineHeight: 1.2 }}>
            Transform Your Learning Experience
          </h1>
          <p className="md-body" style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 32, maxWidth: 600, lineHeight: 1.7 }}>
            An interactive e-learning platform designed to enhance computer science education through multimedia lessons, 
            interactive quizzes, and comprehensive progress tracking. Built for students to learn at their own pace 
            with engaging content and immediate feedback.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/register" className="md-btn-filled" style={{ padding: '14px 28px', fontSize: 15 }}>
              <span className="material-symbols-outlined">play_arrow</span>
              Start Learning
            </Link>
            <Link href="/login" className="md-btn-outlined" style={{ padding: '14px 28px', fontSize: 15, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              <span className="material-symbols-outlined">account_circle</span>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="md-shell" style={{ padding: '60px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="md-label">ABOUT THE PLATFORM</div>
          <h2 className="md-display" style={{ fontSize: 36, marginBottom: 16 }}>Empowering Computer Science Education</h2>
          <p className="md-body" style={{ fontSize: 16, maxWidth: 800, margin: '0 auto' }}>
            CBLearn is a comprehensive learning management system developed to address the challenges of traditional 
            computer science education. By combining modern web technologies with pedagogical best practices, 
            we create an engaging and effective learning environment for students at Tai Solarin University of Education.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div className="md-card-elevated" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>lightbulb</span>
            </div>
            <h3 className="md-headline" style={{ fontSize: 20, marginBottom: 12 }}>Our Mission</h3>
            <p className="md-body-sm">
              To provide accessible, high-quality computer science education that empowers students with practical 
              skills and theoretical knowledge for the digital age.
            </p>
          </div>

          <div className="md-card-elevated" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>target</span>
            </div>
            <h3 className="md-headline" style={{ fontSize: 20, marginBottom: 12 }}>Our Vision</h3>
            <p className="md-body-sm">
              To become the leading platform for computer science education in Nigeria, fostering innovation 
              and excellence in technology learning.
            </p>
          </div>

          <div className="md-card-elevated" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--md-sys-color-success-container)', color: 'var(--md-sys-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>verified</span>
            </div>
            <h3 className="md-headline" style={{ fontSize: 20, marginBottom: 12 }}>Our Values</h3>
            <p className="md-body-sm">
              Excellence, accessibility, innovation, and student success are at the core of everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: 'var(--md-sys-color-surface-container)', padding: '60px 28px' }}>
        <div className="md-shell" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="md-label">PLATFORM FEATURES</div>
            <h2 className="md-display" style={{ fontSize: 36, marginBottom: 16 }}>Everything You Need to Succeed</h2>
            <p className="md-body" style={{ fontSize: 16, maxWidth: 700, margin: '0 auto' }}>
              Our platform offers a comprehensive suite of tools designed to enhance your learning experience 
              and help you achieve your academic goals.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <div className="md-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--md-shape-sm)', background: 'var(--md-sys-color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>menu_book</span>
              </div>
              <div>
                <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Interactive Course Modules</h3>
                <p className="md-body-sm">
                  Access comprehensive modules covering various computer science topics including programming, 
                  data structures, algorithms, databases, and more. Each module includes multimedia content, 
                  practical examples, and self-paced learning materials.
                </p>
              </div>
            </div>

            <div className="md-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--md-shape-sm)', background: 'var(--md-sys-color-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>quiz</span>
              </div>
              <div>
                <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Interactive Quizzes</h3>
                <p className="md-body-sm">
                  Test your knowledge with interactive quizzes at the end of each lesson. Receive instant 
                  feedback on your answers, track your scores, and identify areas where you need improvement. 
                  Our adaptive quiz system ensures you're always challenged appropriately.
                </p>
              </div>
            </div>

            <div className="md-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--md-shape-sm)', background: 'var(--md-sys-color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>analytics</span>
              </div>
              <div>
                <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Progress Tracking</h3>
                <p className="md-body-sm">
                  Monitor your learning journey with detailed analytics. Track your completion rates, quiz scores, 
                  and overall progress across all modules. Visual dashboards help you understand your strengths 
                  and areas for improvement at a glance.
                </p>
              </div>
            </div>

            <div className="md-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--md-shape-sm)', background: 'var(--md-sys-color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>schedule</span>
              </div>
              <div>
                <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Self-Paced Learning</h3>
                <p className="md-body-sm">
                  Learn at your own pace with our flexible scheduling system. Access materials anytime, anywhere, 
                  and revisit lessons as many times as needed. Your progress is automatically saved, allowing 
                  you to pick up exactly where you left off.
                </p>
              </div>
            </div>

            <div className="md-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--md-shape-sm)', background: 'var(--md-sys-color-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>devices</span>
              </div>
              <div>
                <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Multi-Device Access</h3>
                <p className="md-body-sm">
                  Access the platform from any device - desktop, tablet, or mobile. Our responsive design ensures 
                  a seamless learning experience regardless of the device you're using. Study on the go or at 
                  your desk with equal ease.
                </p>
              </div>
            </div>

            <div className="md-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--md-shape-sm)', background: 'var(--md-sys-color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>security</span>
              </div>
              <div>
                <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Secure & Private</h3>
                <p className="md-body-sm">
                  Your data and privacy are our top priority. We use industry-standard security measures to 
                  protect your information. Your learning progress and personal details are securely stored 
                  and never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="md-shell" style={{ padding: '60px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="md-label">HOW IT WORKS</div>
          <h2 className="md-display" style={{ fontSize: 36, marginBottom: 16 }}>Simple Steps to Get Started</h2>
          <p className="md-body" style={{ fontSize: 16, maxWidth: 700, margin: '0 auto' }}>
            Getting started with CBLearn is easy. Follow these simple steps to begin your learning journey.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--md-sys-color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 700 }}>
              1
            </div>
            <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Register</h3>
            <p className="md-body-sm">Create your account with your matriculation number and get started in minutes.</p>
          </div>

          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--md-sys-color-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 700 }}>
              2
            </div>
            <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Choose Module</h3>
            <p className="md-body-sm">Browse available course modules and select where you want to start learning.</p>
          </div>

          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--md-sys-color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 700 }}>
              3
            </div>
            <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Learn & Quiz</h3>
            <p className="md-body-sm">Study the lessons and complete quizzes to test your understanding.</p>
          </div>

          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--md-sys-color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 700 }}>
              4
            </div>
            <h3 className="md-headline" style={{ fontSize: 18, marginBottom: 8 }}>Track Progress</h3>
            <p className="md-body-sm">Monitor your progress and continue learning at your own pace.</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div style={{ background: 'var(--md-sys-color-surface-container)', padding: '60px 28px' }}>
        <div className="md-shell" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="md-label">PROJECT TEAM</div>
            <h2 className="md-display" style={{ fontSize: 36, marginBottom: 16 }}>Meet the Team</h2>
            <p className="md-body" style={{ fontSize: 16, maxWidth: 700, margin: '0 auto' }}>
              This project was developed by dedicated student researchers under the guidance of experienced faculty.
            </p>
          </div>

          {/* Supervisor */}
          <div className="md-card-elevated" style={{ maxWidth: 500, margin: '0 auto 32px', textAlign: 'center', padding: 32 }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, var(--md-sys-color-primary), #0E2247)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48 }}>person</span>
            </div>
            <h3 className="md-headline" style={{ fontSize: 24, marginBottom: 8 }}>Mrs. Ogunbanjo</h3>
            <div className="md-chip md-chip-progress" style={{ fontSize: 13, padding: '6px 16px', marginBottom: 12 }}>Project Supervisor</div>
            <p className="md-body-sm" style={{ fontSize: 14 }}>
              Providing guidance, mentorship, and academic oversight throughout the development of this platform.
            </p>
          </div>

          {/* Student Researchers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            <div className="md-card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40 }}>person</span>
              </div>
              <h3 className="md-headline" style={{ fontSize: 20, marginBottom: 8 }}>Lawal Habeeb Ayinde</h3>
              <p className="md-body-sm" style={{ marginBottom: 12 }}>Matric Number: 20220204291</p>
              <div className="md-chip md-chip-neutral">Student Researcher</div>
            </div>

            <div className="md-card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40 }}>person</span>
              </div>
              <h3 className="md-headline" style={{ fontSize: 20, marginBottom: 8 }}>Ibuola Bukola Deborah</h3>
              <p className="md-body-sm" style={{ marginBottom: 12 }}>Matric Number: 20220204300</p>
              <div className="md-chip md-chip-neutral">Student Researcher</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="md-auth-visual" style={{ padding: '60px 28px', textAlign: 'center', minHeight: 'auto' }}>
        <div className="md-shell" style={{ padding: 0 }}>
          <h2 className="md-display" style={{ fontSize: 36, color: '#fff', marginBottom: 16 }}>Ready to Start Learning?</h2>
          <p className="md-body" style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            Join hundreds of students already using CBLearn to enhance their computer science education. 
            Sign up today and take the first step towards mastering essential tech skills.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="md-btn-filled" style={{ padding: '14px 32px', fontSize: 15 }}>
              Create Account
            </Link>
            <Link href="/login" className="md-btn-outlined" style={{ padding: '14px 32px', fontSize: 15, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--md-sys-color-surface-dim)', padding: '40px 28px', borderTop: '1px solid var(--md-sys-color-outline)' }}>
        <div className="md-shell" style={{ padding: 0, textAlign: 'center' }}>
          <div className="md-brand" style={{ justifyContent: 'center', marginBottom: 16 }}>
            <div className="mark"><span className="material-symbols-outlined">school</span></div>
            CBLearn
          </div>
          <p className="md-body-sm" style={{ marginBottom: 8 }}>
            &copy; 2026 CBLearn. Computer Based Learning Platform.
          </p>
          <p className="md-body-sm" style={{ opacity: 0.7 }}>
            Department of Computer Science, Tai Solarin University of Education
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <span className="md-chip md-chip-neutral">Next.js 15</span>
            <span className="md-chip md-chip-neutral">PostgreSQL</span>
            <span className="md-chip md-chip-neutral">Docker</span>
          </div>
        </div>
      </footer>
    </>
  );
}
