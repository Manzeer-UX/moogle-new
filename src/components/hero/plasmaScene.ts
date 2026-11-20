/*
 * The hero's plasma orb as a three.js scene, apart from any page: it never touches the DOM, so the
 * same code renders on an OffscreenCanvas in plasmaOrb.worker.ts (the usual path) and on a page
 * canvas in PlasmaOrb's main-thread fallback. Shaders, materials and motion are the ones PlasmaOrb
 * always drew.
 */
import * as THREE from "three";

/** MoogleLabs violet: ink-violet body, violet plasma rising to lavender and white */
const PALETTE = {
  coreShadow: 0x07051f,
  coreBody: 0x1b1160,
  coreLit: 0x5b3fd6,
  coreRim: 0x795df5,
  plasmaDeep: 0x24127a,
  plasmaMid: 0x795df5,
  plasmaBright: 0xc9bcff,
  innerMid: 0x9d7bff,
  innerBright: 0xffffff,
  shellFront: 0xa996ff,
  shellBack: 0x2b1a8a,
  particles: 0xece7ff,
};

const PARAMS = {
  timeScale: 0.78,
  plasmaScale: 0.1404,
  plasmaBrightness: 1.65,
  voidThreshold: 0.072,
  shellOpacity: 1.1,
  /** Radians per second (the original stepped 0.002 / 0.005 per frame at ~60fps) */
  spinX: 0.12,
  spinY: 0.3,
  /** Furthest the orb leans toward the pointer, in radians */
  tilt: 0.35,
};

/** Key light from the upper left, in view space: drives the shading, rim and highlight */
const LIGHT = [-0.55, 0.65, 0.55] as const;

/**
 * "orb": the hero's orb, as approved. "horizon": the same orb made vast, with only its upper edge on
 * screen (the final CTA). Up that close it needs a finer mesh, or the silhouette shows its facets;
 * a finer plasma, or the visible dome is one flat colour; smooth waves for detail; and a slow turn
 * about a tilted axis instead of the tumble, which would race across a sphere that size.
 */
export type PlasmaVariant = "orb" | "horizon";

const LOOKS: Record<
  PlasmaVariant,
  {
    /** Width and height segments of the glass body and shell, and of the outer plasma */
    shell: [number, number];
    plasma: [number, number];
    plasmaScale: number;
    waves: boolean;
    /** Fixed lean of the spin axis about x, in radians (negative tips the pole away) */
    tiltX: number;
    spinX: number;
    spinY: number;
    /** Furthest the orb leans toward the pointer, in radians */
    lean: number;
  }
> = {
  orb: {
    shell: [96, 96],
    plasma: [128, 128],
    plasmaScale: PARAMS.plasmaScale,
    waves: false,
    tiltX: 0,
    spinX: PARAMS.spinX,
    spinY: PARAMS.spinY,
    lean: PARAMS.tilt,
  },
  horizon: {
    shell: [384, 192],
    plasma: [384, 192],
    plasmaScale: 0.9,
    waves: true,
    tiltX: -0.35,
    spinX: 0,
    spinY: 0.04,
    lean: 0.06,
  },
};

/** Distance between the horizon orb's wave crests on screen, in CSS pixels */
const WAVE_SPACING = 46;

// Simplex noise + fbm, unchanged from orbital/magic-plasma-sphere-three-js/script.js
const NOISE = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float total = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 3; i++) {
      total += snoise(p * frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return total;
  }
`;

const VIEW_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PLASMA_VERTEX = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** The original plasma, plus key-light shading and a soft fade at the silhouette so it reads as a volume */
const PLASMA_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uBrightness;
  uniform float uThreshold;
  uniform vec3 uColorDeep;
  uniform vec3 uColorMid;
  uniform vec3 uColorBright;
  uniform vec3 uLightDir;
  #ifdef WAVES
  uniform float uWaveFrequency;
  #endif
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  ${NOISE}
  void main() {
    vec3 p = vPosition * uScale;
    vec3 q = vec3(
      fbm(p + vec3(0.0, uTime * 0.05, 0.0)),
      fbm(p + vec3(5.2, 1.3, 2.8) + uTime * 0.05),
      fbm(p + vec3(2.2, 8.4, 0.5) - uTime * 0.02)
    );
    float density = fbm(p + 2.0 * q);
    float t = (density + 0.4) * 0.8;
    float alpha = smoothstep(uThreshold, 0.7, t);
    vec3 color = mix(uColorDeep, uColorMid, smoothstep(uThreshold, 0.5, t));
    color = mix(color, uColorBright, smoothstep(0.5, 0.8, t));
    color = mix(color, vec3(1.0), smoothstep(0.8, 1.0, t));

    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    float facing = dot(N, V);
    float depthFactor = (facing + 1.0) * 0.5;
    // Front faces take the key light; the silhouette fades so the sphere curves away
    float light = facing > 0.0 ? 0.5 + 0.75 * max(dot(N, normalize(uLightDir)), 0.0) : 0.7;
    float limb = 0.3 + 0.7 * smoothstep(0.0, 0.5, abs(facing));
  #ifdef WAVES
    // Horizon orb only: smooth waves running across the spin axis, bent by slow noise and rolling
    // toward the pole. Each crest is a thin bright line in a soft lavender glow, over broad swells,
    // on the near side only; they fade into the silhouette, and wherever the bands would be finer
    // than a pixel. uWaveFrequency keeps the crests a set distance apart on screen at any orb size.
    float bend = snoise(vPosition * 3.2 + vec3(0.0, 0.0, uTime * 0.05)) * 4.0
               + snoise(vPosition * 7.0 - vec3(uTime * 0.035, 0.0, 0.0)) * 0.9;
    float phase = vPosition.y * uWaveFrequency + bend - uTime * 0.9;
    float wave = 0.5 + 0.5 * sin(phase);
    float crest = pow(wave, 14.0) + pow(wave, 4.0) * 0.3;
    float swell = wave * wave * wave;
    float resolvable = 1.0 - smoothstep(0.6, 1.6, fwidth(phase));
    float strand = 0.45 + 0.55 * smoothstep(-0.6, 0.8, snoise(vPosition * 1.7 + vec3(uTime * 0.025)));
    float nearSide = gl_FrontFacing ? smoothstep(0.03, 0.28, facing) : 0.0;
    float glow = (crest * strand + swell * 0.08) * nearSide * resolvable;
    vec3 waveColor = mix(uColorBright, vec3(1.0), pow(wave, 14.0) * 0.6);
    // Additive: the plasma's own light, already weighted by its alpha, plus the waves
    gl_FragColor = vec4(color * uBrightness * light * limb * alpha * (0.02 + 0.98 * depthFactor) + waveColor * glow * 0.9, 1.0);
  #else
    gl_FragColor = vec4(color * uBrightness * light * limb, alpha * (0.02 + 0.98 * depthFactor));
  #endif
  }
`;

/** requestAnimationFrame / cancelAnimationFrame of whichever thread renders the orb */
export type FrameScheduler = {
  request(callback: FrameRequestCallback): number;
  cancel(handle: number): void;
};

export type PlasmaSceneOptions = {
  /** Device pixels per CSS pixel */
  pixelRatio: number;
  /** Share of the frame the sphere's silhouette fills (PlasmaOrb's SPHERE_FRACTION) */
  sphereFraction: number;
  /** Reduced motion: one still frame, redrawn on resize, and no animation loop */
  still: boolean;
  /** Defaults to "orb", the hero's look */
  variant?: PlasmaVariant;
  frames: FrameScheduler;
  /** After the first frame is drawn, i.e. once the shaders have compiled */
  onFirstFrame?: () => void;
};

/**
 * The canvas as a window onto a larger frame, in CSS pixels: the orb is framed for the full size
 * and the canvas shows only the part at (x, y). Lets a huge, mostly hidden orb draw just its
 * visible slice.
 */
export type ViewWindow = { fullWidth: number; fullHeight: number; x: number; y: number };

export type PlasmaScene = {
  /** The canvas's size on the page, in CSS pixels; with `view`, the part of a larger frame it shows */
  resize(width: number, height: number, view?: ViewWindow): void;
  /** Pointer position across the window, -1 to 1 on each axis; the orb leans toward it */
  pointer(x: number, y: number): void;
  /** Runs or pauses the animation loop. Elapsed time carries over a pause, so the orb resumes where it left off. */
  play(running: boolean): void;
  dispose(): void;
};

/** Builds the orb on `canvas`; null when WebGL is unavailable there. */
export function createPlasmaScene(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  { pixelRatio, sphereFraction, still, variant = "orb", frames, onFirstFrame }: PlasmaSceneOptions,
): PlasmaScene | null {
  const look = LOOKS[variant];
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  // A wider lens than a product shot, for perspective on the plasma; the unit sphere fills sphereFraction of the frame
  const fov = 50;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.z = 1 / Math.sin(Math.atan(sphereFraction * Math.tan(THREE.MathUtils.degToRad(fov / 2))));

  const lightDir = new THREE.Vector3(...LIGHT).normalize();
  const group = new THREE.Group();
  scene.add(group);

  // Glass body: lit upper left, falling into shadow lower right, with a violet band at the rim
  const coreGeo = new THREE.SphereGeometry(1.0, ...look.shell);
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: VIEW_VERTEX,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform vec3 uShadow;
      uniform vec3 uBody;
      uniform vec3 uLit;
      uniform vec3 uRim;
      uniform vec3 uLightDir;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);
        float facing = max(dot(N, V), 0.0);
        float diffuse = max(dot(N, normalize(uLightDir)), 0.0);
        vec3 color = mix(uShadow, uBody, smoothstep(-0.2, 0.6, diffuse));
        color = mix(color, uLit, pow(diffuse, 2.5) * 0.35);
        color = mix(uRim * (0.35 + 0.65 * diffuse), color, smoothstep(0.0, 0.42, facing));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uShadow: { value: new THREE.Color(PALETTE.coreShadow) },
      uBody: { value: new THREE.Color(PALETTE.coreBody) },
      uLit: { value: new THREE.Color(PALETTE.coreLit) },
      uRim: { value: new THREE.Color(PALETTE.coreRim) },
      uLightDir: { value: lightDir },
    },
    depthWrite: false,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.renderOrder = -2;
  group.add(core);

  // Plasma: the original outer gas, and a smaller, denser layer turning the other way inside it
  const plasmaUniforms = (scale: number, brightness: number, mid: number, bright: number) => ({
    uTime: { value: 0 },
    uScale: { value: scale },
    uBrightness: { value: brightness },
    uThreshold: { value: PARAMS.voidThreshold },
    uColorDeep: { value: new THREE.Color(PALETTE.plasmaDeep) },
    uColorMid: { value: new THREE.Color(mid) },
    uColorBright: { value: new THREE.Color(bright) },
    uLightDir: { value: lightDir },
  });
  const plasmaMaterial = (uniforms: ReturnType<typeof plasmaUniforms>, waves = false) =>
    new THREE.ShaderMaterial({
      // The waves' frequency is set from the orb's size on screen, in resize()
      uniforms: waves ? { ...uniforms, uWaveFrequency: { value: 150 } } : uniforms,
      defines: waves ? { WAVES: "" } : {},
      vertexShader: PLASMA_VERTEX,
      fragmentShader: PLASMA_FRAGMENT,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  const plasmaGeo = new THREE.SphereGeometry(0.998, ...look.plasma);
  const plasmaMat = plasmaMaterial(
    plasmaUniforms(look.plasmaScale, PARAMS.plasmaBrightness, PALETTE.plasmaMid, PALETTE.plasmaBright),
    look.waves,
  );
  const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
  group.add(plasma);

  const innerGeo = new THREE.SphereGeometry(0.62, 96, 96);
  const innerMat = plasmaMaterial(plasmaUniforms(0.24, 0.75, PALETTE.innerMid, PALETTE.innerBright));
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // Particles drifting inside the sphere
  const count = 600;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 0.95 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = Math.random();
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(PALETTE.particles) },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPixelRatio;
      attribute float aSize;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.2 + pos.x) * 0.02;
        pos.x += cos(uTime * 0.15 + pos.z) * 0.02;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        // Nearer particles are larger and brighter, for depth
        gl_PointSize = (7.0 * aSize + 3.0) * uPixelRatio * (1.0 / -mvPosition.z);
        vAlpha = (0.55 + 0.45 * sin(uTime + aSize * 10.0)) * clamp(1.6 - (-mvPosition.z - 1.4), 0.25, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        if (dist > 0.5) discard;
        float glow = pow(1.0 - dist * 2.0, 1.8);
        gl_FragColor = vec4(uColor, glow * vAlpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(particleGeo, particleMat));

  // Glass shell: inner rim from the back faces; key-lit rim and a specular highlight up front
  const shellGeo = new THREE.SphereGeometry(1.0, ...look.shell);
  const shellBackMat = new THREE.ShaderMaterial({
    vertexShader: VIEW_VERTEX,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(vViewPosition)), 2.5);
        gl_FragColor = vec4(uColor, fresnel * uOpacity);
      }
    `,
    uniforms: { uColor: { value: new THREE.Color(PALETTE.shellBack) }, uOpacity: { value: 0.3 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const shellFrontMat = new THREE.ShaderMaterial({
    vertexShader: VIEW_VERTEX,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform vec3 uLightDir;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);
        vec3 L = normalize(uLightDir);
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);
        float lit = 0.3 + 0.7 * max(dot(N, L), 0.0);
        float nh = max(dot(N, normalize(L + V)), 0.0);
        float specular = pow(nh, 160.0) * 1.2 + pow(nh, 18.0) * 0.1;
        gl_FragColor = vec4(uColor * fresnel * uOpacity * lit + vec3(specular), 1.0);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(PALETTE.shellFront) },
      uOpacity: { value: PARAMS.shellOpacity },
      uLightDir: { value: lightDir },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(shellGeo, shellBackMat));
  const shellFront = new THREE.Mesh(shellGeo, shellFrontMat);
  shellFront.renderOrder = 2;
  group.add(shellFront);

  // Elapsed time keeps accumulating across pauses (reset() drops the paused gap)
  const timer = new THREE.Timer();
  const lean = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let frame = 0;
  let drawn = false;
  /** Nothing is drawn until the canvas has a size */
  let sized = false;

  const draw = (seconds: number) => {
    if (!sized) return;
    const time = seconds * PARAMS.timeScale;
    plasmaMat.uniforms.uTime.value = time;
    innerMat.uniforms.uTime.value = time * 1.3 + 40;
    particleMat.uniforms.uTime.value = seconds;
    plasma.rotation.y = seconds * 0.08;
    inner.rotation.y = -seconds * 0.16;
    inner.rotation.z = seconds * 0.05;
    lean.x += (lean.targetX - lean.x) * 0.05;
    lean.y += (lean.targetY - lean.y) * 0.05;
    group.rotation.x = look.tiltX + seconds * look.spinX + lean.x;
    group.rotation.y = seconds * look.spinY + lean.y;
    renderer.render(scene, camera);
    if (!drawn) {
      drawn = true;
      onFirstFrame?.();
    }
  };

  const loop = (timestamp: number) => {
    frame = frames.request(loop);
    timer.update(timestamp);
    draw(timer.getElapsed());
  };

  const play = (running: boolean) => {
    if (still) return;
    if (running && !frame) {
      timer.reset();
      frame = frames.request(loop);
    } else if (!running && frame) {
      frames.cancel(frame);
      frame = 0;
    }
  };

  return {
    resize(width, height, view) {
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      if (view) {
        camera.aspect = view.fullWidth / view.fullHeight;
        camera.setViewOffset(view.fullWidth, view.fullHeight, view.x, view.y, width, height);
      } else {
        camera.aspect = width / height;
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
      if (look.waves) {
        // Crests WAVE_SPACING apart on screen: the sphere's radius in CSS pixels, over the spacing, per radian
        const radius = (sphereFraction * (view ? view.fullHeight : height)) / 2;
        plasmaMat.uniforms.uWaveFrequency.value = (2 * Math.PI * radius) / WAVE_SPACING;
      }
      sized = true;
      if (still) draw(12);
    },
    pointer(x, y) {
      lean.targetY = x * look.lean;
      lean.targetX = y * look.lean * 0.6;
    },
    play,
    dispose() {
      play(false);
      for (const geometry of [coreGeo, plasmaGeo, innerGeo, particleGeo, shellGeo]) geometry.dispose();
      for (const material of [coreMat, plasmaMat, innerMat, particleMat, shellBackMat, shellFrontMat]) material.dispose();
      timer.dispose();
      renderer.dispose();
    },
  };
}
