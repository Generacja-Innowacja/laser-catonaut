import { useEffect, useRef } from 'react';

const Game = (): React.ReactElement => {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  }, [canvasRef.current]);

  return <canvas ref={canvasRef} width={512} height={512} />;
};

export default Game;
