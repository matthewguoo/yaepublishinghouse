'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* =============================================
   TORII GATE
   ============================================= */
export function ToriiGate3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const red = '#c0392b';
  const darkRed = '#922b21';
  const pillarH = 3.5;
  const pillarR = 0.12;
  const span = 2.8;

  return (
    <group position={position} rotation={rotation}>
      {/* Left pillar */}
      <mesh position={[-span / 2, pillarH / 2, 0]}>
        <cylinderGeometry args={[pillarR, pillarR * 1.1, pillarH, 12]} />
        <meshStandardMaterial color={red} roughness={0.6} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[span / 2, pillarH / 2, 0]}>
        <cylinderGeometry args={[pillarR, pillarR * 1.1, pillarH, 12]} />
        <meshStandardMaterial color={red} roughness={0.6} />
      </mesh>
      {/* Top beam (kasagi) - curved look with box */}
      <mesh position={[0, pillarH + 0.15, 0]}>
        <boxGeometry args={[span + 1, 0.18, 0.28]} />
        <meshStandardMaterial color={darkRed} roughness={0.5} />
      </mesh>
      {/* Second beam (nuki) */}
      <mesh position={[0, pillarH * 0.7, 0]}>
        <boxGeometry args={[span + 0.3, 0.12, 0.2]} />
        <meshStandardMaterial color={red} roughness={0.6} />
      </mesh>
      {/* Top cap pieces */}
      <mesh position={[-span / 2, pillarH + 0.32, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial color={darkRed} roughness={0.5} />
      </mesh>
      <mesh position={[span / 2, pillarH + 0.32, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial color={darkRed} roughness={0.5} />
      </mesh>
      {/* Central tablet (gakuzuka) */}
      <mesh position={[0, pillarH * 0.85, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.08]} />
        <meshStandardMaterial color={'#2c1810'} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* =============================================
   STONE LANTERN (ISHIDOUROU)
   ============================================= */
export function Lantern3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const stone = '#a0978e';
  const stoneLight = '#b8b0a6';
  const warmLight = '#ffcc66';

  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.16, 6]} />
        <meshStandardMaterial color={stone} roughness={0.85} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
        <meshStandardMaterial color={stoneLight} roughness={0.8} />
      </mesh>
      {/* Light box (hibukuro) */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial color={stoneLight} roughness={0.8} />
      </mesh>
      {/* Light openings (emissive insets) */}
      {[
        [0, 1.1, 0.21],
        [0, 1.1, -0.21],
        [0.21, 1.1, 0],
        [-0.21, 1.1, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}>
          <planeGeometry args={[0.18, 0.2]} />
          <meshStandardMaterial
            color={warmLight}
            emissive={warmLight}
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Roof (kasa) */}
      <mesh position={[0, 1.42, 0]}>
        <coneGeometry args={[0.4, 0.3, 4]} />
        <meshStandardMaterial color={stone} roughness={0.85} />
      </mesh>
      {/* Top finial */}
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={stoneLight} roughness={0.8} />
      </mesh>
      {/* Point light for glow */}
      <pointLight
        position={[0, 1.1, 0]}
        color={warmLight}
        intensity={2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

/* =============================================
   SAKURA TREE
   ============================================= */
function SakuraPetalParticles({ count = 60, spread = 2.5, height = 3.5, yBase = 2 }) {
  const ref = useRef();
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * spread * 2,
        y: yBase + Math.random() * height,
        z: (Math.random() - 0.5) * spread * 2,
        speed: 0.2 + Math.random() * 0.4,
        swaySpeed: 0.5 + Math.random() * 1,
        swayAmount: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count, spread, height, yBase]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    });
    return pos;
  }, [particles, count]);

  useFrame((state) => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const pos = geo.attributes.position.array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      // Slow falling
      pos[i * 3 + 1] -= p.speed * 0.008;
      // Sway
      pos[i * 3] = p.x + Math.sin(t * p.swaySpeed + p.phase) * p.swayAmount;
      pos[i * 3 + 2] = p.z + Math.cos(t * p.swaySpeed * 0.7 + p.phase) * p.swayAmount * 0.5;
      // Reset when fallen
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = yBase + height;
      }
    }
    geo.attributes.position.needsUpdate = true;
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
        size={0.08}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function SakuraTree3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const bark = '#5c3a1e';
  const blossom1 = '#ffb7c5';
  const blossom2 = '#ff91a4';
  const blossom3 = '#ffd1dc';

  return (
    <group position={position} rotation={rotation}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 2.4, 8]} />
        <meshStandardMaterial color={bark} roughness={0.9} />
      </mesh>
      {/* Branch 1 */}
      <mesh position={[0.4, 2.2, 0.2]} rotation={[0.2, 0, 0.6]}>
        <cylinderGeometry args={[0.04, 0.08, 1.2, 6]} />
        <meshStandardMaterial color={bark} roughness={0.9} />
      </mesh>
      {/* Branch 2 */}
      <mesh position={[-0.3, 2.4, -0.15]} rotation={[-0.15, 0, -0.5]}>
        <cylinderGeometry args={[0.035, 0.07, 1, 6]} />
        <meshStandardMaterial color={bark} roughness={0.9} />
      </mesh>
      {/* Blossom clusters */}
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[1.2, 12, 10]} />
        <meshStandardMaterial color={blossom1} roughness={0.8} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.6, 2.8, 0.4]}>
        <sphereGeometry args={[0.8, 10, 8]} />
        <meshStandardMaterial color={blossom2} roughness={0.8} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.5, 3.0, -0.3]}>
        <sphereGeometry args={[0.7, 10, 8]} />
        <meshStandardMaterial color={blossom3} roughness={0.8} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.3, 3.6, -0.2]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color={blossom1} roughness={0.8} transparent opacity={0.75} />
      </mesh>
      {/* Falling petals */}
      <SakuraPetalParticles count={40} spread={1.8} height={3} yBase={1.5} />
    </group>
  );
}

/* =============================================
   OFFERING BOX (SAISEN-BAKO)
   ============================================= */
export function OfferingBox3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const wood = '#6b3a2a';
  const woodLight = '#8b5a3a';
  const slat = '#4a2a1a';

  return (
    <group position={position} rotation={rotation}>
      {/* Main box */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1, 0.5, 0.6]} />
        <meshStandardMaterial color={wood} roughness={0.75} />
      </mesh>
      {/* Top slats */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.62, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.65]} />
          <meshStandardMaterial color={slat} roughness={0.7} />
        </mesh>
      ))}
      {/* Legs */}
      {[
        [-0.4, 0.05, -0.22],
        [0.4, 0.05, -0.22],
        [-0.4, 0.05, 0.22],
        [0.4, 0.05, 0.22],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color={woodLight} roughness={0.7} />
        </mesh>
      ))}
      {/* Rim */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.06, 0.04, 0.66]} />
        <meshStandardMaterial color={woodLight} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* =============================================
   FOX STATUE (KITSUNE)
   ============================================= */
export function FoxStatue3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const stone = '#c8c0b5';
  const stoneD = '#a09890';

  return (
    <group position={position} rotation={rotation}>
      {/* Base pedestal */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.5, 0.24, 0.4]} />
        <meshStandardMaterial color={stoneD} roughness={0.85} />
      </mesh>
      {/* Body - seated fox shape */}
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.15, 0.4, 6, 10]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.05, 0.05]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.98, 0.18]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.07, 0.15, 6]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
      {/* Left ear */}
      <mesh position={[-0.1, 1.22, 0.02]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.05, 0.14, 4]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
      {/* Right ear */}
      <mesh position={[0.1, 1.22, 0.02]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.05, 0.14, 4]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.65, -0.22]} rotation={[0.8, 0, 0]}>
        <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* =============================================
   BENCH
   ============================================= */
export function Bench3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const wood = '#7a5230';
  const woodD = '#5a3a20';

  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.4]} />
        <meshStandardMaterial color={wood} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[
        [-0.5, 0.21, -0.12],
        [-0.5, 0.21, 0.12],
        [0.5, 0.21, -0.12],
        [0.5, 0.21, 0.12],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.06, 0.42, 0.06]} />
          <meshStandardMaterial color={woodD} roughness={0.7} />
        </mesh>
      ))}
      {/* Support bar */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.04]} />
        <meshStandardMaterial color={woodD} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* =============================================
   STEPPING STONE
   ============================================= */
export function SteppingStone3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 12]} />
        <meshStandardMaterial color="#908880" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.32, 0.05, 12]} />
        <meshStandardMaterial color="#807870" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* =============================================
   SHRINE BUILDING
   ============================================= */
export function ShrineBuilding3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const wood = '#8b6843';
  const woodD = '#6b4a2d';
  const roofColor = '#2c2c3a';
  const roofAccent = '#3d3545';
  const white = '#f0e8dd';

  return (
    <group position={position} rotation={rotation}>
      {/* Foundation / Platform */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[3, 0.3, 2.5]} />
        <meshStandardMaterial color="#908070" roughness={0.85} />
      </mesh>
      {/* Steps */}
      <mesh position={[0, 0.08, 1.35]}>
        <boxGeometry args={[1.2, 0.15, 0.3]} />
        <meshStandardMaterial color="#989088" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.18, 1.15]}>
        <boxGeometry args={[1.2, 0.15, 0.3]} />
        <meshStandardMaterial color="#908070" roughness={0.85} />
      </mesh>

      {/* Main structure - walls */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2.6, 1.6, 2.1]} />
        <meshStandardMaterial color={white} roughness={0.7} />
      </mesh>
      {/* Wood frame lines */}
      {/* Vertical pillars */}
      {[
        [-1.3, 1.1, 1.06],
        [1.3, 1.1, 1.06],
        [-1.3, 1.1, -1.06],
        [1.3, 1.1, -1.06],
      ].map((pos, i) => (
        <mesh key={`pillar-${i}`} position={pos}>
          <boxGeometry args={[0.12, 1.65, 0.12]} />
          <meshStandardMaterial color={woodD} roughness={0.7} />
        </mesh>
      ))}
      {/* Horizontal beams */}
      <mesh position={[0, 1.9, 1.06]}>
        <boxGeometry args={[2.7, 0.08, 0.13]} />
        <meshStandardMaterial color={woodD} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 1.06]}>
        <boxGeometry args={[2.7, 0.08, 0.13]} />
        <meshStandardMaterial color={woodD} roughness={0.7} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.9, 1.065]}>
        <boxGeometry args={[0.7, 1.1, 0.04]} />
        <meshStandardMaterial color={wood} roughness={0.65} />
      </mesh>

      {/* Main roof */}
      <mesh position={[0, 2.3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.12, 2.8]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>
      {/* Roof slope - front */}
      <mesh position={[0, 2.65, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color={roofAccent} roughness={0.6} />
      </mesh>
      {/* Roof ridge ornament */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.15, 0.15, 2.6]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>
      {/* Chigi (cross-beams on top) */}
      <mesh position={[0, 3.3, -1.2]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color={wood} roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.3, 1.2]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color={wood} roughness={0.7} />
      </mesh>

      {/* Shimenawa (sacred rope) */}
      <mesh position={[0, 1.95, 1.12]}>
        <torusGeometry args={[0.4, 0.04, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#d4c8a0" roughness={0.8} />
      </mesh>

      {/* Interior glow */}
      <pointLight position={[0, 1.0, 0.5]} color="#ffdd88" intensity={1} distance={3} decay={2} />
    </group>
  );
}
