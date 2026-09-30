import { useState, useRef, useCallback, useEffect } from 'react';

/* ─── Sound definitions ─── */
export const SOUNDS = [
  { id: 'rain',         label: 'Rain',          icon: '🌧️', color: '#7DA7D9', description: 'Gentle rainfall' },
  { id: 'ocean',        label: 'Ocean',          icon: '🌊', color: '#0e86c7', description: 'Rolling waves'  },
  { id: 'forest',       label: 'Forest',         icon: '🌲', color: '#A5C89F', description: 'Birds & breeze' },
  { id: 'wind',         label: 'Wind',           icon: '💨', color: '#C7B8EA', description: 'Soft wind'      },
  { id: 'fireplace',    label: 'Fireplace',      icon: '🔥', color: '#FB923C', description: 'Crackling fire' },
  { id: 'night',        label: 'Night Ambience', icon: '🌙', color: '#6366F1', description: 'Crickets & calm'},
];

/* ─── Synthetic tone generators via Web Audio API ─── */
const createSoundNode = (ctx, id) => {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);

  // Each sound uses a different noise / oscillator approach
  const bufferSize = ctx.sampleRate * 3;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);

  switch (id) {
    case 'rain': {
      // High-frequency filtered white noise
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer; src.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 3000;
      const filter2 = ctx.createBiquadFilter(); filter2.type = 'lowpass'; filter2.frequency.value = 8000;
      src.connect(filter); filter.connect(filter2); filter2.connect(gain); src.start();
      return { src, gain };
    }
    case 'ocean': {
      // Brown noise (low-pass heavy)
      let last = 0;
      for (let i = 0; i < bufferSize; i++) { const white = Math.random() * 2 - 1; last = (last + 0.02 * white) / 1.02; data[i] = last * 3.5; }
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
      src.connect(f); f.connect(gain); src.start();
      return { src, gain };
    }
    case 'forest': {
      // Mid-band pink noise
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer; src.loop = true;
      const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 1200; f1.Q.value = 0.7;
      const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 3000; f2.Q.value = 1.2;
      const mg = ctx.createGain(); mg.gain.value = 2;
      src.connect(f1); f1.connect(mg); src.connect(f2); f2.connect(mg); mg.connect(gain); src.start();
      return { src, gain };
    }
    case 'wind': {
      // Pink noise – slowly modulated
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 0.5;
      src.connect(f); f.connect(gain); src.start();
      // Slow gain modulation (wind gusts)
      const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.3;
      lfo.frequency.value = 0.12; lfo.connect(lfoGain); lfoGain.connect(gain.gain); lfo.start();
      return { src, gain };
    }
    case 'fireplace': {
      // Low crackle – filtered noise bursts
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520;
        b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+w*0.5362)*0.11;
      }
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 800;
      src.connect(f); f.connect(gain); src.start();
      return { src, gain };
    }
    case 'night': {
      // Sub-bass hum + high cricket chirps
      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 55;
      const oscGain = ctx.createGain(); oscGain.gain.value = 0.15;
      osc.connect(oscGain); oscGain.connect(gain); osc.start();
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() > 0.998 ? Math.random() * 2 - 1 : 0;
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4000;
      const hg = ctx.createGain(); hg.gain.value = 3;
      src.connect(f); f.connect(hg); hg.connect(gain); src.start();
      return { src, gain };
    }
    default:
      return { gain };
  }
};

/* ─── Hook ─── */
const useSoundscape = () => {
  const ctxRef      = useRef(null);
  const nodesRef    = useRef({});
  const [isPlaying, setIsPlaying]   = useState(false);
  const [volumes,   setVolumes]     = useState(() =>
    Object.fromEntries(SOUNDS.map((s) => [s.id, 0]))
  );
  const [enabled,   setEnabled]     = useState(() =>
    Object.fromEntries(SOUNDS.map((s) => [s.id, false]))
  );
  const [master,    setMaster]      = useState(0.8);
  const masterGainRef = useRef(null);

  /* Lazily initialise AudioContext */
  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    const mg = ctx.createGain();
    mg.gain.value = master;
    mg.connect(ctx.destination);
    masterGainRef.current = mg;

    SOUNDS.forEach((s) => {
      const node = createSoundNode(ctx, s.id);
      // Rewire gain output to master
      if (node.gain) { node.gain.disconnect(); node.gain.connect(mg); }
      nodesRef.current[s.id] = node;
    });
    return ctx;
  }, [master]);

  /* Toggle play/pause */
  const togglePlay = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();
    setIsPlaying((v) => {
      const next = !v;
      // Fade out all if stopping
      if (!next) {
        Object.values(nodesRef.current).forEach((n) => {
          if (n.gain) { n.gain.gain.cancelScheduledValues(ctx.currentTime); n.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5); }
        });
      } else {
        // Restore enabled volumes
        setEnabled((en) => {
          setVolumes((vol) => {
            Object.entries(en).forEach(([id, on]) => {
              const n = nodesRef.current[id];
              if (n?.gain && on) { n.gain.gain.cancelScheduledValues(ctx.currentTime); n.gain.gain.linearRampToValueAtTime(vol[id], ctx.currentTime + 0.5); }
            });
            return vol;
          });
          return en;
        });
      }
      return next;
    });
  }, [ensureCtx]);

  /* Set volume for a sound */
  const setVolume = useCallback((id, value) => {
    setVolumes((prev) => {
      const next = { ...prev, [id]: value };
      const ctx = ctxRef.current;
      if (ctx && enabled[id] && isPlaying) {
        const n = nodesRef.current[id];
        if (n?.gain) n.gain.gain.linearRampToValueAtTime(value, ctx.currentTime + 0.1);
      }
      return next;
    });
  }, [enabled, isPlaying]);

  /* Toggle a sound on/off */
  const toggleSound = useCallback((id) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const ctx = ctxRef.current;
      if (ctx && isPlaying) {
        const n = nodesRef.current[id];
        if (n?.gain) {
          const target = next[id] ? (volumes[id] || 0.5) : 0;
          n.gain.gain.cancelScheduledValues(ctx.currentTime);
          n.gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.4);
        }
      }
      return next;
    });
  }, [isPlaying, volumes]);

  /* Master volume */
  const setMasterVolume = useCallback((value) => {
    setMaster(value);
    if (masterGainRef.current) masterGainRef.current.gain.linearRampToValueAtTime(value, ctxRef.current.currentTime + 0.1);
  }, []);

  /* Load a preset */
  const loadPreset = useCallback((preset) => {
    const newVolumes = {};
    const newEnabled = Object.fromEntries(SOUNDS.map((s) => [s.id, false]));
    preset.sounds.forEach((s) => { newVolumes[s.id] = s.volume; newEnabled[s.id] = s.enabled; });
    setVolumes((prev) => ({ ...prev, ...newVolumes }));
    setEnabled(newEnabled);
    if (masterGainRef.current) setMasterVolume(preset.masterVolume || 0.8);
  }, [setMasterVolume]);

  /* Cleanup */
  useEffect(() => () => { ctxRef.current?.close(); }, []);

  return {
    isPlaying, volumes, enabled, master,
    togglePlay, setVolume, toggleSound, setMasterVolume, loadPreset,
  };
};

export default useSoundscape;
