"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

const PEACH = "#ffc4a8";
const PEACH_GLOW = "#ff8a65";
const PEACH_DEEP = "#e8917a";

function Cheek({
  position,
  phase,
  scale = 1,
}: {
  position: [number, number, number];
  phase: number;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const bounce = ((1 - Math.cos((t + phase) * 5)) / 2) * 0.55;
    const wobbleX = Math.sin(t * 3.2 + phase) * 0.06;
    const wobbleZ = Math.cos(t * 2.8 + phase) * 0.05;

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + bounce;
      groupRef.current.rotation.z = wobbleX;
      groupRef.current.rotation.x = wobbleZ;
    }
    if (meshRef.current) {
      const squash = 1 + Math.sin(t * 6 + phase) * 0.07;
      meshRef.current.scale.set(scale * squash, scale * (1.05 - squash * 0.08), scale * 1.02);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} castShadow receiveShadow scale={[1.15, 1.05, 0.92]}>
        <sphereGeometry args={[0.72, 64, 64]} />
        <MeshDistortMaterial
          color={PEACH}
          emissive={PEACH_GLOW}
          emissiveIntensity={0.42}
          roughness={0.38}
          metalness={0.08}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          distort={0.28}
          speed={3.2}
        />
      </mesh>
      <mesh position={[0.38, 0.05, 0.12]} scale={[0.35, 0.55, 0.3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={PEACH_DEEP}
          emissive={PEACH_GLOW}
          emissiveIntensity={0.15}
          roughness={0.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function BouncingButtocks() {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <group position={[0, -0.15, 0]}>
        <Cheek position={[-0.82, 0, 0]} phase={0} scale={1} />
        <Cheek position={[0.82, 0, 0]} phase={Math.PI * 0.55} scale={1.02} />
        <mesh position={[0, -0.55, 0.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.6, 2.2]} />
          <shadowMaterial transparent opacity={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 140;
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 14;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pts;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ffcba4"
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlowRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2;
      ring1.current.rotation.z = t * 0.6;
      ring1.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 2.2;
      ring2.current.rotation.z = -t * 0.45;
    }
  });

  return (
    <group position={[0, -0.8, -0.5]}>
      <mesh ref={ring1}>
        <torusGeometry args={[2.4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ff9e80" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.1, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ff7043" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function Lights() {
  const pink = useRef<THREE.PointLight>(null);
  const peach = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1.2 + Math.sin(t * 4) * 0.35;
    if (pink.current) pink.current.intensity = pulse;
    if (peach.current) peach.current.intensity = 1.4 + Math.cos(t * 3.5) * 0.3;
  });

  return (
    <>
      <ambientLight intensity={0.35} color="#ffe0d0" />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.1}
        color="#fff5ee"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight ref={peach} position={[-3, 2, 3]} intensity={1.4} color="#ffab91" />
      <pointLight ref={pink} position={[3, 1, 2]} intensity={1.2} color="#f48fb1" />
      <pointLight position={[0, -2, -3]} intensity={0.6} color="#ff7043" />
    </>
  );
}

export function ButtScene() {
  return (
    <>
      <color attach="background" args={["#08040a"]} />
      <fog attach="fog" args={["#08040a", 6, 18]} />
      <Lights />
      <ParticleField />
      <GlowRings />
      <Sparkles
        count={80}
        scale={[10, 6, 6]}
        size={2.5}
        speed={0.35}
        color="#ffd4b8"
        opacity={0.55}
      />
      <BouncingButtocks />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#120810"
          metalness={0.85}
          roughness={0.25}
          emissive="#1a0810"
          emissiveIntensity={0.15}
        />
      </mesh>
    </>
  );
}