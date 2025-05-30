import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FloatingParticles = () => {
  const containerRef = useRef();
  
  useEffect(() => {
    const particles = [];
    const colors = [
      'bg-blue-200/20',
      'bg-indigo-200/20',
      'bg-purple-200/20',
      'bg-blue-300/15',
      'bg-indigo-300/15'
    ];

    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 15 + 5;
      const blur = Math.random() * 5 + 2;
      
      particle.className = `absolute rounded-full ${colors[Math.floor(Math.random() * colors.length)]} blur-sm`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.filter = `blur(${blur}px)`;
      
      if (containerRef.current) {
        containerRef.current.appendChild(particle);
        particles.push(particle);
      }

      // Animate each particle with more organic movement
      gsap.to(particle, {
        x: `${Math.random() * 200 - 100}px`,
        y: `${Math.random() * 200 - 100}px`,
        rotation: Math.random() * 360,
        duration: Math.random() * 20 + 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5
      });
    }
    
    return () => {
      particles.forEach(p => {
        if (p && containerRef.current) {
          containerRef.current.removeChild(p);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    />
  );
};

export default FloatingParticles;