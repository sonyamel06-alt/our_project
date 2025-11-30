import React from "react";
import "./calendar.css";

const TELEGRAM = (window as any).Telegram?.WebApp;

type DayInfo = { day: number; hasMemory: boolean };

export default function CalendarGrid({ days, onOpen }: { days: DayInfo[]; onOpen: (d: number) => void; }) {
  const today = new Date().getDate();
  const DAYS = days.length ? days : Array.from({ length: 25 }).map((_, i) => ({ day: i + 1, hasMemory: false }));

  const handleClick = (day: number) => {
    if (day > today) {
      if (TELEGRAM?.showPopup) {
        TELEGRAM.showPopup({ title: "Ещё рано 🌙", message: "Этот день ещё не наступил — загляни позже 💛", buttons: [{ id: "ok", type: "ok" }] });
      } else {
        alert("Этот день ещё не наступил — загляни позже 💛");
      }
      return;
    }
    onOpen(day);
  };

  return (
    <div className="grid" role="grid" aria-label="Advent calendar">
      {DAYS.map(d => {
        const isFuture = d.day > today;
        return (
          <button
            key={d.day}
            className={`cell ${d.hasMemory ? "filled" : ""} ${isFuture ? "locked" : ""}`}
            onClick={() => handleClick(d.day)}
            aria-disabled={isFuture}
          >
            <div className="cell-number">{d.day}</div>
            {isFuture && <div className="lock">🔒</div>}
          </button>
        );
      })}
    </div>
  );
}
