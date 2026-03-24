import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const logo = `${import.meta.env.BASE_URL}logo.png`;
  const [exiting, setExiting] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 18 particles with random colors and trajectories
    const colors = ['#a78bfa', '#f472b6', '#60a5fa', '#fb923c', '#34d399', '#f87171'];
    const p = [];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 80 + Math.random() * 60; // 80-140px
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 2;
      p.push({ id: i, color: colors[Math.floor(Math.random() * colors.length)], tx, ty, delay, duration });
    }
    setParticles(p);

    // After 3 seconds, trigger the exit animation
    const timer = setTimeout(() => setExiting(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Animation Container */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            
            {/* Orbiting Rings */}
            <div 
              className="absolute w-[200px] h-[200px] rounded-full" 
              style={{
                borderTop: '2px solid rgba(124,58,237,0.6)',
                borderRight: '2px solid rgba(124,58,237,0.2)',
                animation: 'spin 4s linear infinite'
              }}
            />
            <div 
              className="absolute w-[230px] h-[230px] rounded-full" 
              style={{
                borderBottom: '2px solid rgba(244,114,182,0.5)',
                borderLeft: '2px solid rgba(244,114,182,0.15)',
                animation: 'spin 6s linear infinite reverse'
              }}
            />
            <div 
              className="absolute w-[260px] h-[260px] rounded-full" 
              style={{
                borderTop: '2px solid rgba(59,130,246,0.4)',
                borderRight: '2px solid rgba(59,130,246,0.1)',
                animation: 'spin 8s linear infinite'
              }}
            />

            {/* Orbiting Dots */}
            <div className="absolute w-2 h-2 rounded-full" style={{ background: '#a78bfa', animation: 'orbit 3s linear infinite' }} />
            <div className="absolute w-2 h-2 rounded-full" style={{ background: '#f472b6', animation: 'orbit 5s linear infinite', animationDelay: '-1.5s' }} />
            <div className="absolute w-2 h-2 rounded-full" style={{ background: '#60a5fa', animation: 'orbit 4s linear infinite', animationDelay: '-2s' }} />
            <div className="absolute w-2 h-2 rounded-full" style={{ background: '#fb923c', animation: 'orbit 6s linear infinite', animationDelay: '-3s' }} />

            {/* Particles Burst */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                style={{
                  background: p.color,
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animation: `particle ${p.duration}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                  opacity: 0,
                  transformOrigin: 'center center'
                }}
              />
            ))}

            {/* Logo Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="relative z-10 flex items-center justify-center w-full h-full"
            >
              <img
                src={logo}
                alt="Connect Logo"
                className="w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                style={{
                  animation: 'float 2s ease-in-out infinite, glowShift 3s ease-in-out infinite'
                }}
              />
            </motion.div>
          </div>

          {/* Text Animation Section */}
          <div className="mt-8 flex flex-col items-center pointer-events-none">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="font-mono font-semibold"
              style={{
                fontSize: '28px',
                letterSpacing: '3px',
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'titlePulse 3s ease-in-out infinite'
              }}
            >
              CONNECT
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="font-mono mt-2"
              style={{
                fontSize: '11px',
                color: '#6b6b8a',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              Mentorship Platform
            </motion.span>
          </div>

          {/* Loading Bar */}
          <div className="absolute bottom-12 w-[200px] h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
              className="h-full bg-gradient-brand rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
