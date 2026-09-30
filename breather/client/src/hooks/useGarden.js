import { useState, useCallback, useRef } from 'react';
import { generateId } from '../utils/helpers';
import { gardenService } from '../services/gardenService';

const DEFAULT_GARDEN = {
  objects: [],
  environment: 'day',
  weather: 'clear',
  theme: 'spring',
};

const useGarden = () => {
  const [objects,      setObjects]     = useState([]);
  const [environment,  setEnvironment] = useState('day');
  const [weather,      setWeather]     = useState('clear');
  const [theme,        setTheme]       = useState('spring');
  const [selected,     setSelected]    = useState(null);
  const [isSaving,     setIsSaving]    = useState(false);
  const [isLoading,    setIsLoading]   = useState(false);
  const [saveStatus,   setSaveStatus]  = useState('idle'); // idle | saving | saved | error
  const saveTimer = useRef(null);

  /* ── Load from API ── */
  const loadGarden = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await gardenService.getGarden();
      const garden = res.data.data.garden;
      if (garden) {
        setObjects(garden.objects || []);
        setEnvironment(garden.environment || 'day');
        setWeather(garden.weather || 'clear');
        setTheme(garden.theme || 'spring');
      }
    } catch (err) {
      console.error('Failed to load garden:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── Auto-save helper ── */
  const scheduleSave = useCallback((newObjects, newEnvironment, newWeather, newTheme) => {
    clearTimeout(saveTimer.current);
    setSaveStatus('idle');
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await gardenService.updateGarden({
          objects: newObjects,
          environment: newEnvironment,
          weather: newWeather,
          theme: newTheme,
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    }, 1200);
  }, []);

  /* ── Add object to garden ── */
  const addObject = useCallback((type, variant, x, y) => {
    const obj = {
      id: generateId(),
      type,
      variant: variant || 'default',
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

  /* ── Move object ── */
  const moveObject = useCallback((id, x, y) => {
    setObjects((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, x, y } : o));
      scheduleSave(next, environment, weather, theme);
      return next;
    });
  }, [environment, weather, theme, scheduleSave]);

  /* ── Remove object ── */
  const removeObject = useCallback((id) => {
    setObjects((prev) => {
      const next = prev.filter((o) => o.id !== id);
      scheduleSave(next, environment, weather, theme);
      return next;
    });
    setSelected(null);
  }, [environment, weather, theme, scheduleSave]);

  /* ── Scale object ── */
  const scaleObject = useCallback((id, scale) => {
    setObjects((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, scale } : o));
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
    scaleObject, changeEnvironment, changeWeather,
    changeTheme, clearGarden, saveGarden,
  };
};

export default useGarden;
