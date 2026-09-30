import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

// Full profile built in Phase 10
const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <MainLayout>
      <div style={{ padding: 'var(--space-10) var(--space-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
          Profile — {user?.name}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          Full profile coming in Phase 10
        </p>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
