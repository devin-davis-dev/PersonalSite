import { useEffect, useRef } from "react";

const BubbleCanvas = ({ skills }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles = [];

    let radius; // The radius of the bubbles
    const width = window.innerWidth;

    // Set the radius based on the screen size
    if (width > 800) {
      radius = 150; // Desktop
    } else if (width > 500) {
      radius = 100; // Tablet
    } else {
      radius = 50; // Mobile
    }

    for (let i = 0; i < skills.length; i++) {
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 4;
      const dy = (Math.random() - 0.5) * 4;
      bubbles.push(new Bubble(x, y, dx, dy, radius, skills[i]));
    }

    function Bubble(x, y, dx, dy, radius, skillImagePath) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;

      // Load the image
      this.image = new Image();
      this.image.src = skillImagePath; // replace this with the path to your image

      this.draw = function () {
        ctx.drawImage(
          this.image,
          this.x,
          this.y,
          this.radius * 2,
          this.radius * 2,
        );
      };

      this.update = function () {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
      };
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
      }
    }

    animate();
  }, [skills]);

  return <canvas ref={canvasRef} style={{ width: "100%" }} />;
};

export default BubbleCanvas;
