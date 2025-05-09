import { Canvas } from '@react-three/fiber';
import { Background3D } from './Background3D';
import { Suspense } from 'react';

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Background3D />
        </Suspense>
      </Canvas>
    </div>
  );
} 