import { useEffect } from "react";
import Lenis from "lenis";

function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      lerp: 0.08,
    });

    window.__smartAgroLenis = lenis;

    let frameId = null;

    const raf = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      delete window.__smartAgroLenis;
      lenis.destroy();
    };
  }, []);

  return children;
}

export default SmoothScrollProvider;
