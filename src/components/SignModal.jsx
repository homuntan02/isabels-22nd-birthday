// ./components/SignModal.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SignModal({ open, onClose, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      const prev = document.activeElement;
      panelRef.current.focus();
      return () => prev && prev.focus?.();
    }
  }, [open]);

  if (!open) return null;

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          outline: "none",
          width: "min(100vw, 1000px)",
          maxHeight: "78vh",
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          position: "relative",
          display: "grid",
          gap: 12,
          overflow: "auto",
        }}
      >
        {/* Close button (X) */} <button className="close-btn" onClick={(onClose)}>✕</button>

        {children}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
