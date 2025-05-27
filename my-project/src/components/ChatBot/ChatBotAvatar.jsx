import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D model component
function ChatbotModel({ isSpeaking }) {
  const modelRef = useRef();
  
  // Enhanced animation with speaking effects
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (modelRef.current) {
      // Base rotation animation
      modelRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      
      // Enhanced animations when speaking
      if (isSpeaking) {
        // More pronounced bounce effect
        modelRef.current.position.y = Math.sin(time * 8) * 0.08;
        
        // Subtle pulsing effect (scaling)
        const pulseScale = 1 + Math.sin(time * 12) * 0.03;
        modelRef.current.scale.set(pulseScale, pulseScale, pulseScale);
        
        // Slight side-to-side movement
        modelRef.current.position.x = Math.sin(time * 3) * 0.03;
        
        // Find and animate the mouth if it exists
        modelRef.current.traverse((child) => {
          if (child.userData && child.userData.update) {
            child.userData.update(time);
          }
        });
      } else {
        // Subtle idle animations
        modelRef.current.position.y = Math.sin(time * 1) * 0.02;
        modelRef.current.scale.set(1, 1, 1);
        modelRef.current.position.x = Math.sin(time * 0.5) * 0.01;
      }
    }
  });

  return (
    <group ref={modelRef}>
      {/* Golden sphere representing the chatbot */}
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={new THREE.Color('#D4AF37')} 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.85]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.85]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      
      {/* Mouth - changes based on speaking state with dynamic animation */}
      <group position={[0, -0.2, 0.85]}>
        {isSpeaking ? (
          // Animated mouth when speaking
          <mesh ref={(mesh) => {
            if (mesh) {
              // Animate mouth height based on time
              mesh.userData.update = (time) => {
                const openAmount = 0.05 + Math.abs(Math.sin(time * 15)) * 0.15;
                mesh.scale.y = openAmount * 4;
              };
            }
          }} castShadow>
            <boxGeometry args={[0.5, 0.2, 0.05]} />
            <meshBasicMaterial color="#000" />
          </mesh>
        ) : (
          // Static mouth when not speaking
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.05, 0.05]} />
            <meshBasicMaterial color="#000" />
          </mesh>
        )}
      </group>
    </group>
  );
}

// Main avatar component
const ChatBotAvatar = ({ isSpeaking = false, size = 100 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <ChatbotModel isSpeaking={isSpeaking} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ChatBotAvatar;
