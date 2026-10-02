import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import GardenCanvas from '../components/garden/GardenCanvas';
import GardenToolbar from '../components/garden/GardenToolbar';
import useGarden from '../hooks/useGarden';
import styles from './DigitalGardenPage.module.css';

const DigitalGardenPage = () => {
  const {
    objects, environment, weather, theme, selected,
    saveStatus, isLoading,
    setSelected,
    loadGarden, addObject, moveObject, removeObject,
    scaleObject, rotateObject,
    changeEnvironment, changeWeather, clearGarden, saveGarden,
  } = useGarden();

  /* Load saved garden on mount */
  useEffect(() => { loadGarden(); }, [loadGarden]);

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Header bar ── */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.topIcon}>🌿</span>
            <div>
              <h1 className={styles.topTitle}>Digital Garden</h1>
              <p className={styles.topSub}>Grow Your Space</p>
            </div>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.objectCount}>
              {objects.length} {objects.length === 1 ? 'element' : 'elements'}
            </span>
          </div>
        </div>

        {/* ── Main work area ── */}
        <div className={styles.workspace}>
          {/* Toolbar (left) */}
          <GardenToolbar
            environment={environment}
            weather={weather}
            saveStatus={saveStatus}
            onEnvironmentChange={changeEnvironment}
            onWeatherChange={changeWeather}
            onClear={clearGarden}
            onSave={saveGarden}
          />

          {/* Canvas (right) */}
          <div className={styles.canvasWrap}>
            {isLoading ? (
              <div className={styles.loading}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className={styles.spinner}
                />
                <p>Loading your garden…</p>
              </div>
            ) : (
              <GardenCanvas
                objects={objects}
                environment={environment}
                weather={weather}
                selected={selected}
                setSelected={setSelected}
                onDrop={addObject}
                onDragEnd={moveObject}
                onRemove={removeObject}
                onScale={scaleObject}
                onRotate={rotateObject}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DigitalGardenPage;
