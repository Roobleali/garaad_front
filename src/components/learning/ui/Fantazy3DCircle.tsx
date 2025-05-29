// Fantasy3DCircle.tsx
import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Fantasy3DCircleProps {
  color: string;
  isActive: boolean;
  isHovered: boolean;
}

const Fantasy3DCircle = memo(
  ({ color, isActive, isHovered }: Fantasy3DCircleProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const shouldAnimate = isActive || isHovered;

    // Reusable materials
    const ringMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          metalness: 0.8,
          roughness: 0.2,
          emissive: color,
          transparent: true,
          opacity: 0.9,
        }),
      [color]
    );

    const outerRingMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          metalness: 0.9,
          roughness: 0.1,
          emissive: color,
          transparent: true,
          opacity: 0.6,
        }),
      [color]
    );

    // Geometry instances
    const ringGeometry = useMemo(
      () => new THREE.RingGeometry(0.4, 0.5, 24),
      []
    );
    const outerRingGeometry = useMemo(
      () => new THREE.RingGeometry(0.55, 0.65, 32),
      []
    );
    const circleGeometry = useMemo(
      () => new THREE.CircleGeometry(0.35, 16),
      []
    );
    const coneGeometry = useMemo(
      () => new THREE.ConeGeometry(0.025, 0.1, 4),
      []
    );

    // Particle positions
    const particlePositions = useMemo(() => {
      const positions = new Float32Array(24 * 3);
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const radius = 0.6 + Math.random() * 0.15;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      }
      return positions;
    }, []);

    useFrame((state) => {
      const group = groupRef.current;
      if (!group || !shouldAnimate) return;

      const elapsedTime = state.clock.elapsedTime;

      // Animate the entire group instead of individual elements
      group.rotation.z = elapsedTime * 0.2;
      group.scale.setScalar(isHovered || isActive ? 1.1 : 1);
    });

    // Static cone positions
    const conePositions = useMemo(() => {
      const positions = [];
      for (let i = 0; i < 6; i++) {
        // Reduced from 8 to 6
        const angle = (i / 6) * Math.PI * 2;
        positions.push([Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0]);
      }
      return positions;
    }, []);

    return (
      <group ref={groupRef}>
        <mesh geometry={ringGeometry} material={ringMaterial} />
        <mesh geometry={outerRingGeometry} material={outerRingMaterial} />

        <mesh geometry={circleGeometry}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isActive ? 0.3 : isHovered ? 0.2 : 0.1}
          />
        </mesh>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.015}
            color={color}
            transparent
            opacity={isActive ? 0.8 : isHovered ? 0.6 : 0.4}
            sizeAttenuation={false}
          />
        </points>

        {conePositions.map((pos, i) => (
          <mesh
            key={i}
            position={pos as [number, number, number]}
            rotation={[0, 0, (i / 6) * Math.PI * 2]}
            geometry={coneGeometry}
          >
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.1}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    );
  }
);

Fantasy3DCircle.displayName = "Fantasy3DCircle";
export default Fantasy3DCircle;
