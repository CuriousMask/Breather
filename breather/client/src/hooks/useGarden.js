import { useState, useCallback, useRef } from 'react';
import { generateId } from '../utils/helpers';
import { gardenService } from '../services/gardenService';

const useGarden = () => {
  const [objects,     setObjects]    = useState([]);
  const [environment, setEnvironment]= useState('day');
  const [weather,     setWeather]    = useState('clear');
  const [theme,       setTheme]      = useState('spring');
  const [selected,    setSelected]   = useState(null);
  const [isSaving,    setIsSaving]   = useState(false);
  const [isLoading,   setIsLoading]  = useState(false);
  const [saveStatus,  setSaveStatus] = useState('idle');
  const saveTimer = useRef(null);

  /* ── Load from API ── */
  const loadGarden = useCallback(async () => {
    setIsLoading(true);
    try {
      const res    = await gardenService.getGarden();
      const garden = res.data?.data?.garden;
      if (garden) {
        setObjects(garden.objects     || []);
        setEnvironment(garden.environment || 'day');
        setWeather(garden.weather     || 'clear');
        setTheme(garden.theme         || 'spring');
      }
    } catch {
      /* user may not have a garden yet — silent */
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── Debounced auto-save ── */
  const scheduleSave = useCallback((objs, env, wth, thm) => {
    clearTimeout(saveTimer.current);
    setSaveStatus('idle');
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await gardenService.updateGarden({ objects: objs, environment: env, weather: wth, theme: thm });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    }, 1200);
  }, []);

  /* ── Add object ── */
  const addObject = useCallback((type, variant, x, y) => {
    const obj = {
      id: generateId(),
      type,
      variant: variant || type,
      x,
      y,
      scale: 1,
      rotation: 0,
      zIndex: objects.length + 1,
    };
    setObjects((prev) => {
      const next = [...prev, obj];
      scheduleSave(next, environment, weather, theme);
      return next;
    });
    setSelected(obj.id);
  }, [objects.length, environment, weather, theme, scheduleSave]);

  /* ── Move ── */
  const moveObject = useCallback((id, x, y) => {
    setObjects((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, x, y } : o));
      scheduleSave(next, environment, weather, theme);
      return next;
    });
  }, [environment, weather, theme, scheduleSave]);

  /* ── Remove ── */
  const removeObject = useCallback((id) => {
    setObjects((prev) => {
      const next = prev.filter((o) => o.id !== id);
      scheduleSave(next, environment, weather, theme);
      return next;
    });
    setSelected(null);
  }, [environment, weather, theme, scheduleSave]);

  /* ── Scale (clamped 0.3 – 3) ── */
  const scaleObject = useCallback((id, scale) => {
    const clamped = Math.max(0.3, Math.min(3, scale));
    setObjects((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, scale: clamped } : o));
      scheduleSave(next, environment, weather, theme);
      return next;
    });
  }, [environment, weather, theme, scheduleSave]);

  /* ── Rotate (accumulate delta) ── */
  const rotateObject = useCallback((id, deltaDeg) => {
    setObjects((prev) => {
      const next = prev.map((o) =>
        o.id === id ? { ...o, rotation: ((o.rotation || 0) + deltaDeg) % 360 } : o
      );
      scheduleSave(next, environment, weather, theme);
      return next;
    });
  }, [environment, weather, theme, scheduleSave]);

  /* ── Change environment ── */
  const changeEnvironment = useCallback((env) => {
    setEnvironment(env);
    scheduleSave(objects, env, weather, theme);
  }, [objects, weather, theme, scheduleSave]);

  /* ── Change weather ── */
  const changeWeather = useCallback((w) => {
    setWeather(w);
    scheduleSave(objects, environment, w, theme);
  }, [objects, environment, theme, scheduleSave]);

  /* ── Change theme ── */
  const changeTheme = useCallback((t) => {
    setTheme(t);
    scheduleSave(objects, environment, weather, t);
  }, [objects, environment, weather, scheduleSave]);

  /* ── Clear garden ── */
  const clearGarden = useCallback(() => {
    setObjects([]);
    setSelected(null);
    scheduleSave([], environment, weather, theme);
  }, [environment, weather, theme, scheduleSave]);

  /* ── Manual save ── */
  const saveGarden = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await gardenService.updateGarden({ objects, environment, weather, theme });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [objects, environment, weather, theme]);

  return {
    objects, environment, weather, theme, selected,
    isSaving, isLoading, saveStatus,
    setSelected,
    loadGarden, addObject, moveObject, removeObject,
    scaleObject, rotateObject,
    changeEnvironment, changeWeather, changeTheme,
    clearGarden, saveGarden,
  };
};

export default useGarden;
