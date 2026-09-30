import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import RoomCanvas from '../components/dreamroom/RoomCanvas';
import RoomToolbar from '../components/dreamroom/RoomToolbar';
import useDreamRoom from '../hooks/useDreamRoom';
import styles from './DreamRoomPage.module.css';

const DreamRoomPage = () => {
  const {
    objects, theme, lighting, wallColor, floorColor,
    selected, isLoading, saveStatus,
    setSelected, loadRoom, placeObject, moveObject,
    scaleObject, rotateObject, removeObject,
    changeTheme, changeLighting, saveRoom, clearRoom,
  } = useDreamRoom();

  useEffect(() => { loadRoom(); }, [loadRoom]);

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.topIcon}>🛋️</span>
            <div>
              <h1 className={styles.topTitle}>Dream Room</h1>
              <p className={styles.topSub}>Build Your Own World</p>
            </div>
          </div>
          <div className={styles.topRight}>
            <span className={styles.objectCount}>
              {objects.length} {objects.length === 1 ? 'item' : 'items'}
            </span>
            <span className={styles.themeBadge}>
              {theme} · {lighting}
            </span>
          </div>
        </div>

        {/* ── Workspace ── */}
        <div className={styles.workspace}>
          <RoomToolbar
            theme={theme}
            lighting={lighting}
            saveStatus={saveStatus}
            onThemeChange={changeTheme}
            onLightingChange={changeLighting}
            onClear={clearRoom}
            onSave={saveRoom}
          />

          <div className={styles.canvasWrap}>
            {isLoading ? (
              <div className={styles.loading}>
                <motion.div
                  className={styles.spinner}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p>Loading your room…</p>
              </div>
            ) : (
              <RoomCanvas
                objects={objects}
                wallColor={wallColor}
                floorColor={floorColor}
                lighting={lighting}
                selected={selected}
                setSelected={setSelected}
                onDrop={placeObject}
                onDragEnd={moveObject}
                onScale={scaleObject}
                onRotate={rotateObject}
                onRemove={removeObject}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DreamRoomPage;
