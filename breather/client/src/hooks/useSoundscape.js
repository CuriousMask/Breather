import { useState, useRef, useCallback, useEffect } from 'react';

/* ─── Sound catalogue ─── */
export const SOUNDS = [
  { id: 'rain',      label: 'Rain',           icon: '🌧️', color: '#3B82F6', description: 'Gentle rainfall on a window' },
  { id: 'ocean',     label: 'Ocean',           icon: '🌊', color: '#0EA5E9', description: 'Slow rolling waves'           },
  { id: 'forest',    label: 'Forest',          icon: '🌲', color: '#22C55E', description: 'Birds & rustling leaves'      },
  { id: 'wind',      label: 'Wind',            icon: '💨', color: '#8B5CF6', description: 'Soft gusting breeze'          },
  { id: 'fireplace', label: 'Fireplace',       icon: '🔥', color: '#F97316', description: 'Crackling wood fire'          },
  { id: 'night',     label: 'Night Ambience',  icon: '🌙', color: '#6366F1', description: 'Crickets & calm silence'      },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Synthetic tone generators — pure Web Audio API, no audio files required.
   Each sound is procedurally generated using noise buffers + filters.
───────────────────────────────────────────────────────────────────────────── */
const createSoundNode = (ctx, id) => {
  const gain = ctx.createGain();
  gain.gain.value = 0;                  // start silent; faded in when enabled
  gain.connect(ctx.destination);

  const SR         = ctx.sampleRate;
  const bufferSize = SR * 4;            // 4-second looping buffer
  const buf        = ctx.createBuffer(1, bufferSize, SR);
  const data       = buf.getChannelData(0);

  switch (id) {
    /* ── Rain: high-pass filtered white noise ── */
    case 'rain': {
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2800;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 9000;
      src.connect(hp); hp.connect(lp); lp.connect(gain);
      src.start();
      return { src, gain };
    }

    /* ── Ocean: brown noise (integrated white noise) with slow LFO swell ── */
    case 'ocean': {
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        data[i] = last * 3.5;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 350;
      // LFO — gentle wave swell
      const lfo     = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.07; lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain); lfoGain.connect(gain.gain);
      lfo.start();
      src.connect(lp); lp.connect(gain);
      src.start();
      return { src, gain };
    }

    /* ── Forest: layered mid-band noise for leaves + birds ── */
    case 'forest': {
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.45;
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const bp1 = ctx.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 1100; bp1.Q.value = 0.6;
      const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 3200; bp2.Q.value = 1.0;
      const mix = ctx.createGain(); mix.gain.value = 2.2;
      src.connect(bp1); bp1.connect(mix);
      src.connect(bp2); bp2.connect(mix);
      mix.connect(gain);
      src.start();
      return { src, gain };
    }

    /* ── Wind: bandpass noise + slow LFO gusts ── */
    case 'wind': {
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 550; bp.Q.value = 0.4;
      const lfo     = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.10; lfoGain.gain.value = 0.35;
      lfo.connect(lfoGain); lfoGain.connect(gain.gain);
      lfo.start();
      src.connect(bp); bp.connect(gain);
      src.start();
      return { src, gain };
    }

    /* ── Fireplace: Voss pink-noise algorithm for crackle ── */
    case 'fireplace': {
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
        b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
        b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+w*0.5362) * 0.11;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 750;
      src.connect(lp); lp.connect(gain);
      src.start();
      return { src, gain };
    }

    /* ── Night: bass hum + sparse high cricket pulses ── */
    case 'night': {
      // Sub-bass sine hum
      const osc     = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = 52;
      oscGain.gain.value = 0.12;
      osc.connect(oscGain); oscGain.connect(gain);
      osc.start();
      // Cricket impulse noise
      for (let i = 0; i < bufferSize; i++)
        data[i] = Math.random() > 0.9985 ? (Math.random() * 2 - 1) : 0;
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3500;
      const hg = ctx.createGain(); hg.gain.value = 4;
      src.connect(hp); hp.connect(hg); hg.connect(gain);
      src.start();
      return { src, gain };
    }

    default:
      return { gain };
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────────────────────────── */
const DEFAULT_VOLUMES = Object.fromEntries(SOUNDS.map((s) => [s.id, 0.65]));
const DEFAULT_ENABLED = Object.fromEntries(SOUNDS.map((s) => [s.id, false]));

const useSoundscape = () => {
  const ctxRef        = useRef(null);
  const nodesRef      = useRef({});
  const masterGainRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes,   setVolumes]   = useState({ ...DEFAULT_VOLUMES });
  const [enabled,   setEnabled]   = useState({ ...DEFAULT_ENABLED });
  const [master,    setMaster]    = useState(0.8);

  /* ── Lazy AudioContext init (browsers require user gesture) ── */
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
      if (node.gain) {
        node.gain.disconnect();
        node.gain.connect(mg);   // route through master gain
      }
      nodesRef.current[s.id] = node;
    });

    return ctx;
  }, [master]);

  /* ── Play / Pause ── */
  const togglePlay = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();

    setIsPlaying((playing) => {
      const next = !playing;
      const now  = ctx.currentTime;

      if (!next) {
        // Fade everything out
        Object.values(nodesRef.current).forEach((n) => {
          if (!n?.gain) return;
          n.gain.gain.cancelScheduledValues(now);
          n.gain.gain.linearRampToValueAtTime(0, now + 0.6);
        });
      } else {
        // Fade in all currently-enabled sounds to their saved volumes
        Object.entries(nodesRef.current).forEach(([id, n]) => {
          if (!n?.gain) return;
          n.gain.gain.cancelScheduledValues(now);
          // Use functional setState to read latest enabled/volumes
          setEnabled((en) => {
            setVolumes((vol) => {
              if (en[id]) {
                n.gain.gain.linearRampToValueAtTime(vol[id] ?? 0.65, now + 0.5);
              }
              return vol;
            });
            return en;
          });
        });
      }

      return next;
    });
  }, [ensureCtx]);

  /* ── Toggle a sound on/off ── */
  const toggleSound = useCallback((id) => {
    // Ensure context exists even before pressing Play
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();

    setEnabled((prev) => {
      const next     = { ...prev, [id]: !prev[id] };
      const isOn     = next[id];
      const node     = nodesRef.current[id];
      const now      = ctx.currentTime;

      if (node?.gain) {
        node.gain.gain.cancelScheduledValues(now);
        if (isOn && isPlaying) {
          // fade in to current volume
          setVolumes((vol) => {
            node.gain.gain.linearRampToValueAtTime(vol[id] ?? 0.65, now + 0.4);
            return vol;
          });
        } else {
          // fade out
          node.gain.gain.linearRampToValueAtTime(0, now + 0.4);
        }
      }

      return next;
    });
  }, [ensureCtx, isPlaying]);

  /* ── Set volume for one sound ── */
  const setVolume = useCallback((id, value) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
    const ctx  = ctxRef.current;
    const node = nodesRef.current[id];
    if (ctx && node?.gain && enabled[id] && isPlaying) {
      node.gain.gain.cancelScheduledValues(ctx.currentTime);
      node.gain.gain.linearRampToValueAtTime(value, ctx.currentTime + 0.08);
    }
  }, [enabled, isPlaying]);

  /* ── Master volume ── */
  const setMasterVolume = useCallback((value) => {
    setMaster(value);
    const ctx = ctxRef.current;
    if (ctx && masterGainRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(value, ctx.currentTime + 0.1);
    }
  }, []);

  /* ── Load a saved preset ── */
  const loadPreset = useCallback((preset) => {
    const newVolumes = { ...DEFAULT_VOLUMES };
    const newEnabled = { ...DEFAULT_ENABLED };

    (preset.sounds || []).forEach((s) => {
      if (s.id) {
        newVolumes[s.id] = s.volume  ?? 0.65;
        newEnabled[s.id] = s.enabled ?? false;
      }
    });

    setVolumes(newVolumes);
    setEnabled(newEnabled);
    setMasterVolume(preset.masterVolume ?? 0.8);

    // Apply immediately if already playing
    const ctx = ctxRef.current;
    if (ctx && isPlaying) {
      const now = ctx.currentTime;
      Object.entries(nodesRef.current).forEach(([id, n]) => {
        if (!n?.gain) return;
        n.gain.gain.cancelScheduledValues(now);
        const target = newEnabled[id] ? (newVolumes[id] ?? 0.65) : 0;
        n.gain.gain.linearRampToValueAtTime(target, now + 0.4);
      });
    }
  }, [isPlaying, setMasterVolume]);

  /* ── Cleanup on unmount ── */
  useEffect(() => () => { ctxRef.current?.close(); }, []);

  return {
    isPlaying, volumes, enabled, master,
    togglePlay, toggleSound, setVolume, setMasterVolume, loadPreset,
  };
};

export default useSoundscape;
