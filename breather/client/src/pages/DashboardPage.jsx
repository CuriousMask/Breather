import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.css';

// Full dashboard built in Phase 10
const DashboardPage = () => {
  const { user } = useAuth();
  return (
    <MainLayout>
      <div className={styles.page}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className={styles.title}>Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p className={styles.subtitle}>Dashboard — coming in Phase 10</p>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
