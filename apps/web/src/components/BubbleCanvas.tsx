import { useEffect, useRef } from "react";

interface BubbleCanvasProps {
  skills: string[];
}

class Bubble {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  image: HTMLImageElement;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    dx: number,
    dy: number,
    radius: number,
    skillImagePath: string,
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.image = new Image();
    this.image.src = skillImagePath;
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.radius * 2,
      this.radius * 2,
    );
  }

  update() {
    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

const BubbleCanvas = ({ skills }: BubbleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles: Bubble[] = [];

    let radius: number;
    const width = window.innerWidth;

    if (width > 800) {
      radius = 150;
    } else if (width > 500) {
      radius = 100;
    } else {
      radius = 50;
    }

    for (let i = 0; i < skills.length; i++) {
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 4;
      const dy = (Math.random() - 0.5) * 4;
      bubbles.push(new Bubble(ctx, canvas, x, y, dx, dy, radius, skills[i]));
    }

    let animationId: number;

    function animate() {
      if (!canvas || !ctx) return;
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [skills]);

  return <canvas ref={canvasRef} style={{ width: "100%" }} />;
};

export default BubbleCanvas;
