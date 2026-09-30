import { useState, useCallback, useRef } from 'react';
import { generateId } from '../utils/helpers';
import { roomService } from '../services/roomService';

const useDreamRoom = () => {
  const [objects,   setObjects]   = useState([]);
  const [theme,     setTheme]     = useState('cozy');
  const [lighting,  setLighting]  = useState('warm');
  const [wallColor, setWallColor] = useState('#F8F4EE');
  const [floorColor,setFloorColor]= useState('#D4A574');
  const [selected,  setSelected]  = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus,setSaveStatus]= useState('idle');
  const saveTimer = useRef(null);

  /* ── Auto-save helper ── */
  const scheduleSave = useCallback((objs, thm, lit, wall, floor) => {
    clearTimeout(saveTimer.current);
    setSaveStatus('idle');
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await roomService.updateRoom({ objects: objs, theme: thm, lighting: lit, wallColor: wall, floorColor: floor });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch { setSaveStatus('error'); }
    }, 1400);
  }, []);

  /* ── Load room ── */
  const loadRoom = useCallback(async () => {
    setIsLoading(true);
    try {
      const res  = await roomService.getRoom();
      const room = res.data?.data?.room;
      if (room) {
        setObjects(room.objects   || []);
        setTheme(room.theme       || 'cozy');
        setLighting(room.lighting || 'warm');
        setWallColor(room.wallColor  || '#F8F4EE');
        setFloorColor(room.floorColor|| '#D4A574');
      }
    } catch {/* no room yet */} finally { setIsLoading(false); }
  }, []);

  /* ── Place object ── */
  const placeObject = useCallback((id, type, x, y, defaultScale = 1) => {
    const obj = { id: generateId(), variant: id, type, x, y, scale: defaultScale, rotation: 0, zIndex: objects.length + 1 };
    setObjects((prev) => {
      const next = [...prev, obj];
      scheduleSave(next, theme, lighting, wallColor, floorColor);
      return next;
    });
    setSelected(obj.id);
  }, [objects.length, theme, lighting, wallColor, floorColor, scheduleSave]);

  /* ── Move ── */
  const moveObject = useCallback((id, x, y) => {
    setObjects((prev) => {
      const next = prev.map((o) => o.id === id ? { ...o, x, y } : o);
      scheduleSave(next, theme, lighting, wallColor, floorColor);
      return next;
    });
  }, [theme, lighting, wallColor, floorColor, scheduleSave]);

  /* ── Scale ── */
  const scaleObject = useCallback((id, scale) => {
    setObjects((prev) => {
      const next = prev.map((o) => o.id === id ? { ...o, scale: Math.max(0.3, Math.min(3, scale)) } : o);
      scheduleSave(next, theme, lighting, wallColor, floorColor);
      return next;
    });
  }, [theme, lighting, wallColor, floorColor, scheduleSave]);

  /* ── Rotate ── */
  const rotateObject = useCallback((id, delta) => {
    setObjects((prev) => {
      const next = prev.map((o) => o.id === id ? { ...o, rotation: ((o.rotation || 0) + delta) % 360 } : o);
      scheduleSave(next, theme, lighting, wallColor, floorColor);
      return next;
    });
  }, [theme, lighting, wallColor, floorColor, scheduleSave]);

  /* ── Remove ── */
  const removeObject = useCallback((id) => {
    setObjects((prev) => {
      const next = prev.filter((o) => o.id !== id);
      scheduleSave(next, theme, lighting, wallColor, floorColor);
      return next;
    });
    setSelected(null);
  }, [theme, lighting, wallColor, floorColor, scheduleSave]);

  /* ── Theme change ── */
  const changeTheme = useCallback((thm, wall, floor) => {
    setTheme(thm); setWallColor(wall); setFloorColor(floor);
    scheduleSave(objects, thm, lighting, wall, floor);
  }, [objects, lighting, scheduleSave]);

  /* ── Lighting change ── */
  const changeLighting = useCallback((lit) => {
    setLighting(lit);
    scheduleSave(objects, theme, lit, wallColor, floorColor);
  }, [objects, theme, wallColor, floorColor, scheduleSave]);

  /* ── Manual save ── */
  const saveRoom = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await roomService.updateRoom({ objects, theme, lighting, wallColor, floorColor });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch { setSaveStatus('error'); }
  }, [objects, theme, lighting, wallColor, floorColor]);

  /* ── Clear ── */
  const clearRoom = useCallback(() => {
    setObjects([]); setSelected(null);
    scheduleSave([], theme, lighting, wallColor, floorColor);
  }, [theme, lighting, wallColor, floorColor, scheduleSave]);

  return {
    objects, theme, lighting, wallColor, floorColor,
    selected, isLoading, saveStatus,
    setSelected, loadRoom, placeObject, moveObject,
    scaleObject, rotateObject, removeObject,
    changeTheme, changeLighting, saveRoom, clearRoom,
  };
};

export default useDreamRoom;
