'use client';

import { useStudentSearch } from '@/hooks/useStudentSearch';
import SearchBar from '@/components/search/SearchBar';
import ProfileHeader from '@/components/student/ProfileHeader';
import ProfileQuickEdit from '@/components/student/ProfileQuickEdit';
import StudentTabs from '@/components/student/StudentTabs';
import ProfileSkeleton from '@/components/student/ProfileSkeleton';
import RightPanel from '@/components/layout/RightPanel';
import { SearchType } from '@/types';

export default function DashboardPage() {
  const { profile, isLoading, error, searchHistory, search } = useStudentSearch();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Search bar */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <SearchBar
            onSearch={(v, t) => search(v, t)}
            isLoading={isLoading}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {isLoading && <ProfileSkeleton />}

          {!isLoading && error && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '60vh', gap: '12px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: '#fef2f2', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '28px',
              }}>🔍</div>
              <p style={{ fontWeight: 600, color: '#374151', fontSize: '15px' }}>{error}</p>
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>Try a different SR Number or Pay ID</p>
            </div>
          )}

          {!isLoading && profile && !error && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ProfileHeader profile={profile} />
              <ProfileQuickEdit
                student={profile.student}
                payId={profile.student.payId}
              />
              <StudentTabs profile={profile} />
            </div>
          )}

          {!isLoading && !profile && !error && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '60vh', gap: '16px',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                fontSize: '32px',
              }}>🎓</div>
              <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '17px' }}>
                Search for a student
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                Enter an SR Number or Pay ID to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <RightPanel
        activation={profile?.activation ?? null}
        searchHistory={searchHistory}
        onHistoryClick={(v) => search(v, 'SR Number')}
      />
    </div>
  );
}
