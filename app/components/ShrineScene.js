'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  ToriiGate3D,
  Lantern3D,
  SakuraTree3D,
  OfferingBox3D,
  FoxStatue3D,
  Bench3D,
  SteppingStone3D,
  ShrineBuilding3D,
} from './ShrineItems';

/* =============================================
   GROUND
   ============================================= */
function Ground() {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4a6741" roughness={0.95} />
      </mesh>
      {/* Stone path area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.5]}>
        <planeGeometry args={[1.5, 8]} />
        <meshStandardMaterial color="#8a8078" roughness={0.9} />
      </mesh>
      {/* Shrine courtyard area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -2]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#7a7568" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* =============================================
   AMBIENT SAKURA PETALS (SCENE-WIDE)
   ============================================= */
function AmbientPetals() {
  const ref = useRef();
  const count = 100;

  const { positions, data } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const d = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      d.push({
        speed: 0.1 + Math.random() * 0.3,
        swaySpeed: 0.3 + Math.random() * 0.7,
        swayAmt: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        origX: pos[i * 3],
        origZ: pos[i * 3 + 2],
      });
    }
    return { positions: pos, data: d };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const p = data[i];
      pos[i * 3 + 1] -= p.speed * 0.005;
      pos[i * 3] = p.origX + Math.sin(t * p.swaySpeed + p.phase) * p.swayAmt;
      pos[i * 3 + 2] = p.origZ + Math.cos(t * p.swaySpeed * 0.6 + p.phase) * p.swayAmt * 0.6;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 7 + Math.random() * 2;
        p.origX = (Math.random() - 0.5) * 20;
        p.origZ = (Math.random() - 0.5) * 20;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffb7c5"
        size={0.06}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* =============================================
   ITEM RENDERER
   ============================================= */
const ITEM_COMPONENTS = {
  'torii-gate': ToriiGate3D,
  lantern: Lantern3D,
  'sakura-tree': SakuraTree3D,
  'offering-box': OfferingBox3D,
  'fox-statue': FoxStatue3D,
  bench: Bench3D,
  'stepping-stone': SteppingStone3D,
  'shrine-building': ShrineBuilding3D,
};

function ShrineItem({ item }) {
  const Component = ITEM_COMPONENTS[item.type];
  if (!Component) return null;
  return (
    <Component
      position={item.position}
      rotation={item.rotation || [0, 0, 0]}
    />
  );
}

/* =============================================
   SCENE CONTENT
   ============================================= */
function SceneContent({ items }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#e8d8f0" />
      <directionalLight
        position={[8, 12, 5]}
        intensity={0.8}
        color="#fff5e6"
        castShadow={false}
      />
      <directionalLight
        position={[-5, 8, -3]}
        intensity={0.3}
        color="#e0d0f0"
      />
      {/* Warm fill from below/front */}
      <hemisphereLight
        color="#ffeedd"
        groundColor="#443355"
        intensity={0.4}
      />

      {/* Sky color */}
      <fog attach="fog" args={['#e8ddf0', 12, 25]} />
      <color attach="background" args={['#ddd0e8']} />

      <Ground />
      <AmbientPetals />

      {/* Render data-driven items */}
      {items.map((item) => (
        <ShrineItem key={item.id} item={item} />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 1.2, 0]}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/* =============================================
   MAIN SHRINE SCENE EXPORT
   ============================================= */
export default function ShrineScene({ items = [] }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
    }}>
      <Canvas
        camera={{
          position: [6, 5, 8],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <SceneContent items={items} />
        </Suspense>
      </Canvas>
    </div>
  );
}
