'use client';
import { useEffect, useState, useRef } from 'react';

type Noti = { id:number; type:string; message:string; meta:any; read:boolean; created_at:string; };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Noti[]>([]);
  const [count, setCount] = useState(0);
  const lastFetch = useRef(0);

  async function load(force=false) {
    const now = Date.now();
    if (!force && now - lastFetch.current < 4000) return; // debounce 4s
    lastFetch.current = now;
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setItems(data.notifications);
        setCount(data.notifications.filter((n:Noti)=>!n.read).length);
      }
    } catch (err) {
      console.error('Load notifications error', err);
    }
  }

  useEffect(() => {
    load(true);
    const id = setInterval(() => load(), 8000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') load(true); });
    return () => { clearInterval(id); };
  }, []);

  async function markRead(id:number) {
    await fetch(`/api/notifications/${id}`, { method:'PUT' });
    load(true);
  }

  async function markAll() {
    await fetch('/api/notifications', { method:'PUT' });
    load(true);
  }

  return (
    <div className="relative">
      <button aria-label="Notificaciones" aria-haspopup="true" aria-expanded={open} onClick={() => { setOpen(!open); if(!open) load(true); }} className="relative">
        <svg className="w-6 h-6" viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M12 2C9.8 2 8 4 8 6v1.1C6 8.2 4 10.6 4 13v3l-1 1v1h18v-1l-1-1v-3c0-2.4-2-4.8-4-5.9V6c0-2-1.8-4-4-4z"/></svg>
        {count>0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-2 rounded-full" aria-live="polite">{count}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow rounded z-50 max-h-80 overflow-auto" role="menu" aria-label="Notificaciones">
          <div className="p-2 flex justify-between items-center border-b">
            <div className="text-sm font-semibold">Notificaciones</div>
            <button onClick={markAll} className="text-xs text-blue-600">Marcar todas</button>
          </div>
          {items.length === 0 && <div className="p-3 text-sm text-gray-500">No hay notificaciones</div>}
          {items.map(n => (
            <div key={n.id} className={`p-3 border-b ${n.read ? 'opacity-70' : ''}`} role="menuitem">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm">{n.type}</div>
                  <div className="text-sm">{n.message}</div>
                  <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                {!n.read && <button onClick={() => markRead(n.id)} className="ml-2 text-sm text-blue-600">Marcar</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


