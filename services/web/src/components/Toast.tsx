import React, { useEffect } from "react";

export default function Toast({ text, onClose }: { text: string; onClose: () => void; }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="toast" role="status" aria-live="polite">{text}</div>
  );
}
