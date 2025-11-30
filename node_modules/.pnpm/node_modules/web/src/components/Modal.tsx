import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, memory, onClose }: { open: boolean; memory: any; onClose: () => void; }) {
  return (
    <AnimatePresence>
      {open && memory && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, background: "rgba(0,0,0,0.35)" }}>
          <motion.div className="modal-card" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            style={{ width: "min(92%,720px)", maxHeight: "86vh", overflow: "auto", background: "#fff", borderRadius: 14, padding: 12, position: "relative" }}>
            <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}>✕</button>
            {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title ?? ""} style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 380 }} />}
            <div style={{ padding: 12 }}>
              <h3 style={{ margin: 0 }}>{memory.title ?? `День ${memory.day}`}</h3>
              <p style={{ marginTop: 8, color: "var(--muted)" }}>{memory.text}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
