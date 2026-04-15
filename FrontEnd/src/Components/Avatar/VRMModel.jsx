import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";

import MODEL_PATH from "../../3d_models/avatar.vrm?url";

// ─── Blink ────────────────────────────────────────────────────────────────────
const BLINK_INTERVAL_MS = 4200;
const BLINK_JITTER_MS   = 2000;
const BLINK_DURATION_MS = 130;
const MOUTH_CLOSE_SPEED = 8;

// ─── Arm rest pose (VRM normalised-humanoid bone space) ───────────────────────
//
//  After rotateVRM0 the character faces +Z.  In normalised bone space:
//    leftUpperArm  Z → positive = arm DOWN, negative = arm UP
//    rightUpperArm Z → negative = arm DOWN, positive = arm UP
//
//  (The previous code had these signs backwards, which is why both arms
//   were pointing up like a T-pose or above.)
//
const HANG = {
  L_UA_Z: +1.28, L_UA_X: +0.04,   // left arm hanging naturally at side
  R_UA_Z: -1.28, R_UA_X: +0.04,   // right arm hanging naturally at side
  L_LA_Z: -0.06, L_LA_X:  0.00,   // left forearm (very slight natural bend)
  R_LA_Z: +0.06, R_LA_X:  0.00,   // right forearm
};

// ─── Speaking gesture targets ────────────────────────────────────────────────
//  Gesture A — right hand explains (arm raised to chest, elbow bent)
const GESTURE_A = {
  R_UA_Z: -0.68, R_UA_X: +0.12,
  R_LA_Z: +0.32, R_LA_X: +0.10,
  L_UA_Z: +1.28, L_UA_X: +0.04,   // left stays at hang
  L_LA_Z: -0.06, L_LA_X:  0.00,
};

//  Gesture B — left hand accents (same thing mirrored)
const GESTURE_B = {
  L_UA_Z: +0.68, L_UA_X: +0.12,
  L_LA_Z: -0.32, L_LA_X: +0.10,
  R_UA_Z: -1.28, R_UA_X: +0.04,   // right stays at hang
  R_LA_Z: +0.06, R_LA_X:  0.00,
};

//  Gesture C — both arms open slightly (presentation, "as you can see…")
const GESTURE_C = {
  L_UA_Z: +1.00, L_UA_X: +0.08,
  L_LA_Z: -0.18, L_LA_X: +0.06,
  R_UA_Z: -1.00, R_UA_X: +0.08,
  R_LA_Z: +0.18, R_LA_X: +0.06,
};

//  Gesture D — right hand raised toward face / emphatic point
const GESTURE_D = {
  R_UA_Z: -0.45, R_UA_X: +0.18,
  R_LA_Z: +0.50, R_LA_X: +0.20,
  L_UA_Z: +1.20, L_UA_X: +0.04,
  L_LA_Z: -0.06, L_LA_X:  0.00,
};

// Sequence to cycle through while speaking (indexes into GESTURES lookup below)
const GESTURE_SEQ = ["A", "A", "C", "B", "B", "D", "A", "C"];
const GESTURES    = { A: GESTURE_A, B: GESTURE_B, C: GESTURE_C, D: GESTURE_D };
const GESTURE_HOLD_S = 2.4;   // seconds per gesture before switching

// ─── Wave gesture ─────────────────────────────────────────────────────────────
const WAVE_RISE_S = 0.55;   // seconds to raise arm
const WAVE_HOLD_S = 2.60;   // seconds of active waving
const WAVE_FALL_S = 0.55;   // seconds to lower arm
const WAVE_TOTAL_S = WAVE_RISE_S + WAVE_HOLD_S + WAVE_FALL_S;

const WAVE_TARGET = {
  R_UA_Z: +0.90,   // right arm raised high (wave height)
  R_UA_X: +0.05,
  R_LA_Z: +0.42,   // elbow bent so forearm points outward/up
  R_LA_X: +0.18,
};

// Regex for greeting detection — triggers wave animation
const GREETING_RE = /\b(hi|hello|hey|chào|xin\s*chào|hé|hei|greetings|howdy)\b/i;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function expLerp(delta, speed) { return 1 - Math.exp(-speed * delta); }

/**
 * VRMModel
 * ─────────────────────────────────────────────────────────────────────────────
 * Props
 *   isSpeaking   boolean  — drives mouth and speaking gestures
 *   spokenText   string   — scanned for greeting keywords → triggers wave
 *   onLoaded     fn(vrm)  — optional, called once model is ready
 *   onError      fn(msg)  — optional, called on load failure
 *
 * Animation layers (all run every frame, blended via lerp):
 *
 *  Layer 0  Body sway, spine counter, breathing, head micro-motion, blink
 *  Layer 1  Arms:
 *             • Idle  — arms hang at sides with gentle pendulum sway
 *             • Speaking — cycles through 4 gesture types (A/B/C/D)
 *             • Wave  — triggered by greeting in spokenText, overrides right arm
 *  Layer 2  Mouth — two-frequency sine while speaking, eases closed otherwise
 */
export function VRMModel({ isSpeaking, spokenText, onLoaded, onError }) {
  const { scene } = useThree();

  const vrmRef        = useRef(null);
  const lastTRef      = useRef(performance.now());
  const mouthOpenRef  = useRef(0);
  const isBlinkRef    = useRef(false);

  // Smooth speak factor (0 → 1) so gestures don't snap
  const speakFRef     = useRef(0);

  // Wave state
  const waveRef = useRef({ active: false, elapsed: 0 });

  // Speaking gesture cycle
  const gstRef = useRef({ seqIdx: 0, elapsed: 0 });

  // Smooth arm state — lerped every frame toward computed targets
  const armRef = useRef({
    L_UA_Z: HANG.L_UA_Z, L_UA_X: HANG.L_UA_X,
    L_LA_Z: HANG.L_LA_Z, L_LA_X: HANG.L_LA_X,
    R_UA_Z: HANG.R_UA_Z, R_UA_X: HANG.R_UA_X,
    R_LA_Z: HANG.R_LA_Z, R_LA_X: HANG.R_LA_X,
    R_H_Z:  0, L_H_Z:  0,
    R_H_Y:  0, L_H_Y:  0,
  });

  // Stable ref for isSpeaking (avoids stale closure in useFrame)
  const speakingRef    = useRef(isSpeaking);
  const prevSpeakRef   = useRef(isSpeaking);
  const pendingWaveRef = useRef(false); // greeting detected, waiting for audio to start

  useEffect(() => { speakingRef.current = isSpeaking; }, [isSpeaking]);

  // ── Wave trigger: mark pending when greeting text arrives ────────────────
  // The wave itself starts only when audio begins (isSpeaking true edge below)
  useEffect(() => {
    if (spokenText && GREETING_RE.test(spokenText)) {
      pendingWaveRef.current = true;
    }
  }, [spokenText]);

  // ── Fire pending wave on isSpeaking false→true edge ──────────────────────
  useEffect(() => {
    const wasOff = !prevSpeakRef.current;
    const nowOn  = isSpeaking;
    prevSpeakRef.current = isSpeaking;

    if (wasOff && nowOn && pendingWaveRef.current) {
      waveRef.current.active  = true;
      waveRef.current.elapsed = 0;
      pendingWaveRef.current  = false;
    }
  }, [isSpeaking]);

  // ── Load VRM ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      MODEL_PATH,
      (gltf) => {
        if (cancelled) return;
        const vrm = gltf.userData.vrm;
        if (!vrm) { onError?.("VRM data not found."); return; }

        try { VRMUtils.removeUnnecessaryVertices(gltf.scene); } catch (_) {}
        try { VRMUtils.rotateVRM0(vrm); }                      catch (_) {}

        vrm.scene.traverse((o) => { o.frustumCulled = false; });
        vrm.scene.position.set(0, -1.30, 0);

        scene.add(vrm.scene);
        vrmRef.current = vrm;
        onLoaded?.(vrm);
      },
      undefined,
      (err) => { if (!cancelled) onError?.(err?.message ?? String(err)); }
    );

    return () => {
      cancelled = true;
      if (vrmRef.current) {
        scene.remove(vrmRef.current.scene);
        try { VRMUtils.deepDispose(vrmRef.current.scene); } catch (_) {}
        vrmRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-blink ────────────────────────────────────────────────────────────
  useEffect(() => {
    let timeout;
    const doBlink = () => {
      const expr = vrmRef.current?.expressionManager;
      if (!expr || isBlinkRef.current) return;
      isBlinkRef.current = true;
      expr.setValue("blink", 1.0);
      setTimeout(() => {
        vrmRef.current?.expressionManager?.setValue("blink", 0.0);
        isBlinkRef.current = false;
      }, BLINK_DURATION_MS);
    };
    const schedule = () => {
      const jitter = (Math.random() - 0.5) * BLINK_JITTER_MS;
      timeout = setTimeout(() => { doBlink(); schedule(); }, BLINK_INTERVAL_MS + jitter);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  // ── Per-frame update ──────────────────────────────────────────────────────
  useFrame(() => {
    const vrm = vrmRef.current;
    if (!vrm) return;

    const now   = performance.now();
    const delta = Math.min((now - lastTRef.current) / 1000, 0.1); // seconds, capped at 100ms
    lastTRef.current = now;
    const t        = performance.now();           // ms
    const expr     = vrm.expressionManager;
    const humanoid = vrm.humanoid;
    const bone     = (n) => humanoid?.getNormalizedBoneNode?.(n) ?? null;
    const speaking = speakingRef.current;

    // ── Smooth speak factor ─────────────────────────────────────────────────
    speakFRef.current = lerp(
      speakFRef.current,
      speaking ? 1.0 : 0.0,
      expLerp(delta, 3.5)
    );
    const sf = speakFRef.current;   // 0 = idle, 1 = fully speaking

    // ── Layer 0A: Body sway ─────────────────────────────────────────────────
    const swayPhase = t * 0.00082;
    const hips = bone("hips");
    if (hips) {
      hips.rotation.z  = Math.sin(swayPhase) * 0.036 + Math.sin(swayPhase * 1.7 + 0.4) * 0.010;
      hips.position.x  = Math.sin(swayPhase) * 0.012;
      hips.rotation.x  = Math.sin(t * 0.00055 + 0.9) * 0.011;
    }

    const spine = bone("spine");
    if (spine) {
      spine.rotation.z = -Math.sin(swayPhase) * 0.014;
      spine.rotation.x =  Math.sin(t * 0.00095) * 0.008;
    }

    const chest = bone("chest");
    if (chest) {
      chest.rotation.x = Math.sin(t * 0.00090) * 0.009;
    }

    // ── Layer 0B: Head micro-motion ─────────────────────────────────────────
    const head = bone("head");
    if (head) {
      head.rotation.x =  Math.sin(t * 0.00065) * 0.020;
      head.rotation.z =  Math.sin(t * 0.00043 + 1.1) * 0.012;
      head.rotation.y =  Math.sin(t * 0.00031 + 2.3) * 0.016;
    }

    // ── Layer 1: Arms ───────────────────────────────────────────────────────
    const arm   = armRef.current;
    const wave  = waveRef.current;
    const gst   = gstRef.current;
    const BLEND = expLerp(delta, 4.5);   // arm blend speed (~4.5 /sec)

    // Pendulum idle sway: arms counter-swing with body sway
    // (left arm swings right when body leans left, like a pendulum)
    const pendulumAmp = 0.028 - sf * 0.014;   // smaller when gesturing
    const pendL = -Math.sin(swayPhase) * pendulumAmp;   // opposite body sway
    const pendR =  Math.sin(swayPhase) * pendulumAmp;   // mirror

    // --- Speaking gesture cycle ---
    if (speaking) {
      gst.elapsed += delta;
      if (gst.elapsed >= GESTURE_HOLD_S) {
        gst.elapsed -= GESTURE_HOLD_S;
        gst.seqIdx   = (gst.seqIdx + 1) % GESTURE_SEQ.length;
      }
    } else {
      // Slowly reset toward beginning of sequence when not speaking
      gst.elapsed = Math.max(0, gst.elapsed - delta * 2);
    }

    const gData = GESTURES[GESTURE_SEQ[gst.seqIdx]];

    // --- Wave state machine for right arm ---
    let waveBlend = 0;   // 0 = no wave, 1 = full wave
    let waveHandZ = 0;   // hand oscillation value

    if (wave.active) {
      wave.elapsed += delta;
      if (wave.elapsed < WAVE_RISE_S) {
        // Rising — smooth ease-in
        waveBlend = smoothstep(wave.elapsed / WAVE_RISE_S);
      } else if (wave.elapsed < WAVE_RISE_S + WAVE_HOLD_S) {
        // Waving
        waveBlend   = 1.0;
        const waveT = wave.elapsed - WAVE_RISE_S;
        waveHandZ   = Math.sin(waveT * Math.PI * 3.2) * 0.60;  // 1.6 Hz wave
      } else if (wave.elapsed < WAVE_TOTAL_S) {
        // Falling — smooth ease-out
        waveBlend = smoothstep(1.0 - (wave.elapsed - WAVE_RISE_S - WAVE_HOLD_S) / WAVE_FALL_S);
      } else {
        wave.active  = false;
        wave.elapsed = 0;
        waveBlend    = 0;
      }
    }

    // --- Compute right arm target (wave overrides gesture) ---
    let tgt_R_UA_Z, tgt_R_UA_X, tgt_R_LA_Z, tgt_R_LA_X;
    if (waveBlend > 0.01) {
      // Blend between hang→gesture(if any)→wave
      const baseR_UA_Z = lerp(HANG.R_UA_Z, gData.R_UA_Z, sf);
      const baseR_UA_X = lerp(HANG.R_UA_X, gData.R_UA_X, sf);
      const baseR_LA_Z = lerp(HANG.R_LA_Z, gData.R_LA_Z, sf);
      const baseR_LA_X = lerp(HANG.R_LA_X, gData.R_LA_X, sf);
      tgt_R_UA_Z = lerp(baseR_UA_Z, WAVE_TARGET.R_UA_Z, waveBlend);
      tgt_R_UA_X = lerp(baseR_UA_X, WAVE_TARGET.R_UA_X, waveBlend);
      tgt_R_LA_Z = lerp(baseR_LA_Z, WAVE_TARGET.R_LA_Z, waveBlend);
      tgt_R_LA_X = lerp(baseR_LA_X, WAVE_TARGET.R_LA_X, waveBlend);
    } else {
      tgt_R_UA_Z = lerp(HANG.R_UA_Z, gData.R_UA_Z, sf);
      tgt_R_UA_X = lerp(HANG.R_UA_X, gData.R_UA_X, sf);
      tgt_R_LA_Z = lerp(HANG.R_LA_Z, gData.R_LA_Z, sf);
      tgt_R_LA_X = lerp(HANG.R_LA_X, gData.R_LA_X, sf);
    }

    // --- Compute left arm target ---
    const tgt_L_UA_Z = lerp(HANG.L_UA_Z, gData.L_UA_Z, sf);
    const tgt_L_UA_X = lerp(HANG.L_UA_X, gData.L_UA_X, sf);
    const tgt_L_LA_Z = lerp(HANG.L_LA_Z, gData.L_LA_Z, sf);
    const tgt_L_LA_X = lerp(HANG.L_LA_X, gData.L_LA_X, sf);

    // --- Lerp arm state toward targets (smooth motion) ---
    arm.L_UA_Z = lerp(arm.L_UA_Z, tgt_L_UA_Z + pendL, BLEND);
    arm.L_UA_X = lerp(arm.L_UA_X, tgt_L_UA_X, BLEND);
    arm.L_LA_Z = lerp(arm.L_LA_Z, tgt_L_LA_Z, BLEND);
    arm.L_LA_X = lerp(arm.L_LA_X, tgt_L_LA_X, BLEND);
    arm.R_UA_Z = lerp(arm.R_UA_Z, tgt_R_UA_Z + pendR, BLEND);
    arm.R_UA_X = lerp(arm.R_UA_X, tgt_R_UA_X, BLEND);
    arm.R_LA_Z = lerp(arm.R_LA_Z, tgt_R_LA_Z, BLEND);
    arm.R_LA_X = lerp(arm.R_LA_X, tgt_R_LA_X, BLEND);

    // --- Wrist / hand ---
    const wf = t * 0.00130;
    // Speaking wrist oscillation — both hands twist gently, adds life
    const speakWristL = sf * Math.sin(wf * 2.1)                    * 0.07;
    const speakWristR = sf * Math.sin(wf * 2.1 + Math.PI)          * 0.07;

    arm.L_H_Y = lerp(arm.L_H_Y,  Math.sin(wf) * 0.08 + speakWristL, BLEND);
    arm.L_H_Z = lerp(arm.L_H_Z,  Math.sin(wf * 0.7) * 0.04, BLEND);

    if (waveBlend > 0.1) {
      // Wave hand rotation takes over right hand
      arm.R_H_Z = lerp(arm.R_H_Z, waveHandZ, BLEND * 1.4);
      arm.R_H_Y = lerp(arm.R_H_Y, 0, BLEND);
    } else {
      arm.R_H_Z = lerp(arm.R_H_Z, -Math.sin(wf * 0.7 + Math.PI) * 0.04, BLEND);
      arm.R_H_Y = lerp(arm.R_H_Y, -Math.sin(wf + Math.PI) * 0.08 + speakWristR, BLEND);
    }

    // --- Apply to bones ---
    const leftUA  = bone("leftUpperArm");
    const rightUA = bone("rightUpperArm");
    const leftLA  = bone("leftLowerArm");
    const rightLA = bone("rightLowerArm");
    const leftH   = bone("leftHand");
    const rightH  = bone("rightHand");

    if (leftUA)  { leftUA.rotation.z  = arm.L_UA_Z; leftUA.rotation.x  = arm.L_UA_X; }
    if (rightUA) { rightUA.rotation.z = arm.R_UA_Z; rightUA.rotation.x = arm.R_UA_X; }
    if (leftLA)  { leftLA.rotation.z  = arm.L_LA_Z; leftLA.rotation.x  = arm.L_LA_X; }
    if (rightLA) { rightLA.rotation.z = arm.R_LA_Z; rightLA.rotation.x = arm.R_LA_X; }
    if (leftH)   { leftH.rotation.y   = arm.L_H_Y;  leftH.rotation.z   = arm.L_H_Z; }
    if (rightH)  { rightH.rotation.y  = arm.R_H_Y;  rightH.rotation.z  = arm.R_H_Z; }

    // ── Layer 2: Mouth ──────────────────────────────────────────────────────
    if (expr) {
      if (speaking) {
        const jaw = 0.38 + 0.24 * Math.sin(t * 0.0082) + 0.10 * Math.sin(t * 0.0197 + 0.7);
        mouthOpenRef.current = Math.max(0.04, Math.min(0.88, jaw));
      } else {
        mouthOpenRef.current = Math.max(0, mouthOpenRef.current - delta * MOUTH_CLOSE_SPEED);
      }
      expr.setValue("aa", mouthOpenRef.current);
    }

    vrm.update(delta);
  });

  return null;
}

// ─── Smoothstep 0→1 ───────────────────────────────────────────────────────────
function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}
