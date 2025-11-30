import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendarGrid from "./components/CalendarGrid";
import Modal from "./components/Modal";
import Toast from "./components/Toast";

type DayInfo = { day: number; hasMemory: boolean };

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:4000/api";
const TELEGRAM = (window as any).Telegram?.WebApp;

export default function App() {
  const [days, setDays] = useState<DayInfo[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [memory, setMemory] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    TELEGRAM?.ready?.();
    try { TELEGRAM?.expand?.(); } catch {}
    TELEGRAM?.setBackgroundColor?.("#f7f3f7");

    axios.get(`${API_BASE}/memories/calendar`).then(r => setDays(r.data));

    const first = localStorage.getItem("mini.advent.firstVisit");
    if (!first) {
      // первый приветственный popup — используем Telegram.showPopup если есть
      if (TELEGRAM?.showPopup) {
        TELEGRAM.showPopup({
          title: "Привет ❤️",
          message: "Открой любой доступный день — там наше воспоминание",
          buttons: [{ id: "ok", type: "ok" }]
        });
      } else {
        setToast("Привет! Открой любой доступный день — там наше воспоминание");
      }
      localStorage.setItem("mini.advent.firstVisit", "1");
    } else {
      // при последующих заходах — комплимент
      axios.get(`${API_BASE}/compliment`).then(r => {
        if (TELEGRAM?.showPopup) {
          TELEGRAM.showPopup({ title: "Комплимент 💫", message: r.data.text, buttons: [{ id: "ok", type: "ok" }] });
        } else {
          setToast(r.data.text);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!selectedDay) {
      setMemory(null);
      return;
    }
    axios.get(`${API_BASE}/memories/${selectedDay}`)
      .then(r => {
        const mem = r.data;
        // image full url
        const imageUrl = mem.imagePath ? `${API_BASE.replace(/\/api\/?$/, "")}${mem.imagePath}` : null;
        setMemory({ ...mem, imageUrl });
      })
      .catch(() => {
        setMemory({ title: "Пусто", text: "Здесь пока нет воспоминания", imageUrl: null });
      });
  }, [selectedDay]);

  return (
    <div className="app-root">
      <header className="header">
        <h1>Мини-адвент</h1>
        <p className="subtitle">Маленькие воспоминания по дням — только для тебя</p>
      </header>

      <main>
        <CalendarGrid days={days} onOpen={d => setSelectedDay(d)} />
      </main>

      <Modal open={!!memory} memory={memory} onClose={() => setSelectedDay(null)} />

      {toast && <Toast text={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
