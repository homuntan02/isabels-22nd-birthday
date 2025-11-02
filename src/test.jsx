import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SignModal({ open, onClose, children }) {
  const panelRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus the panel when opened (basic focus trap starter)
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
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            border: "none",
            background: "transparent",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );

  // Use a portal so the modal is independent of parent stacking contexts
  return createPortal(overlay, document.body);
}
