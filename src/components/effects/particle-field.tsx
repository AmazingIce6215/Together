"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed WebGL dot-matrix particle field.
 *   • Dot particles on a sparse grid, gray on black
 *   • Slow breathing pulse driven by sin(time)
 *   • Pointer-reactive drift (parallax)
 *   • DPR clamped to 1.5 to keep mobile battery happy
 *   • Honors prefers-reduced-motion (renders static)
 *   • DOM fallback if WebGL context can't be created
 *
 * The effect sits behind page content at z-0; no pointer-events.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supported, setSupported] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      (canvas.getContext("webgl", { antialias: true, alpha: true }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setSupported(false);
      return;
    }

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let start = performance.now();

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    // Vertex shader: per-instance position offset via uniforms, point size = uSize.
    const vert = `
      attribute vec2 aGrid;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uSize;
      uniform vec2 uResolution;
      varying float vAlpha;

      void main() {
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 pos = aGrid;

        // Breathing pulse: each dot oscillates in size and alpha
        float t = uTime * 0.4;
        float phase = sin(t + length(aGrid) * 1.2);
        float pulse = 0.5 + 0.5 * phase;

        // Pointer parallax: shift dot positions subtly toward pointer
        vec2 drift = uPointer * 0.04;
        pos += drift * (0.3 + 0.7 * pulse);

        // Wrap to NDC
        pos = (pos / aspect) * 2.0 - 1.0;
        pos.y = -pos.y;

        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = uSize * (0.6 + 0.6 * pulse);

        vAlpha = 0.18 + 0.55 * pulse;
      }
    `;

    const frag = `
      precision mediump float;
      varying float vAlpha;
      uniform vec3 uColor;

      void main() {
        // Render a soft circular point
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        float edge = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, vAlpha * edge);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // Don't blow up the page on shader compile error — fall back to DOM dots.
        setSupported(false);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setSupported(false);
      return;
    }
    gl.useProgram(program);

    // Build a sparse dot grid: ~28 cols × N rows based on viewport, plus a few
    // scattered extra dots for organic feel.
    const buildGrid = () => {
      const cols = 28;
      const targetCellH = 44; // px between rows
      const rows = Math.max(8, Math.ceil(window.innerHeight / targetCellH));
      const aspect = window.innerWidth / window.innerHeight;
      const data: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) / cols * aspect;
          const y = (r + 0.5) / rows;
          // Sparse skip: drop ~30% of dots to keep the field breathing
          if (Math.random() < 0.3) continue;
          data.push(x, y);
        }
      }
      return new Float32Array(data);
    };

    let grid = buildGrid();
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);

    const aGrid = gl.getAttribLocation(program, "aGrid");
    gl.enableVertexAttribArray(aGrid);
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uSize = gl.getUniformLocation(program, "uSize");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uColor = gl.getUniformLocation(program, "uColor");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const onResize = () => {
      resize();
      grid = buildGrid();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
    };
    window.removeEventListener("resize", resize);
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      // Ease pointer toward target for smooth parallax
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTime, t);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uSize, reduced ? 2.4 : 3.2);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform3f(uColor, 0.78, 0.8, 0.82);

      gl.drawArrays(gl.POINTS, 0, grid.length / 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduced]);

  if (!supported) {
    // CSS-only fallback: a static dot grid via radial-gradient. Same vibe, no motion.
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(199, 204, 209, 0.18) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          backgroundPosition: "center top",
          opacity: 0.6,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
