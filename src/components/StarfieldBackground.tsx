import { useRef, useEffect } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; z: number }[] = [];
    const numStars = 800;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
        });
      }
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = '#0a0a0f'; // Dark background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= 1;

        if (star.z <= 0) {
          star.z = canvas.width;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + canvas.width / 2;
        const py = star.y * k + canvas.height / 2;

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = (1 - star.z / canvas.width) * 4;
          const shade = parseInt((1 - star.z / canvas.width) * 255 as any);
          ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
          ctx.fillRect(px, py, size, size);
        }
      }

      requestAnimationFrame(draw);
    };

    setup();
    window.addEventListener('resize', setup);
    requestAnimationFrame(draw);

    return () => window.removeEventListener('resize', setup);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -10 }} />;
};

export default StarfieldBackground;
