import { useEffect, useRef } from "react";

const DEFAULTS = {
  minDistancePx: 90,
  maxTimeMs: 650,
  maxVerticalRatio: 0.75, // |dy| must be <= |dx| * ratio
};

function isInteractiveTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'a,button,input,textarea,select,summary,[role="button"],[role="link"],[data-swipe-ignore="true"]'
    )
  );
}

export default function useHorizontalSwipeNavigate({
  enabled = true,
  onSwipeLeft,
  onSwipeRight,
  minDistancePx = DEFAULTS.minDistancePx,
  maxTimeMs = DEFAULTS.maxTimeMs,
  maxVerticalRatio = DEFAULTS.maxVerticalRatio,
}) {
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e) => {
      if (document.body.style.overflow === "hidden") return; // modal open
      const t = e.touches?.[0];
      if (!t) return;
      if (isInteractiveTarget(e.target)) return;
      startRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    };

    const onTouchEnd = (e) => {
      if (document.body.style.overflow === "hidden") return;
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;

      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const dt = Date.now() - start.time;

      if (dt > maxTimeMs) return;
      if (Math.abs(dx) < minDistancePx) return;
      if (Math.abs(dy) > Math.abs(dx) * maxVerticalRatio) return;

      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    enabled,
    onSwipeLeft,
    onSwipeRight,
    minDistancePx,
    maxTimeMs,
    maxVerticalRatio,
  ]);
}

