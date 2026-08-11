import confetti from 'canvas-confetti';

export function triggerConfetti(particleCount = 120) {
  confetti({
    particleCount,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#7c3aed', '#f472b6', '#ffffff']
  });
}
