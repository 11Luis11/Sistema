'use client';
import { useEffect, useState } from 'react';

type Noti = { id:number; type:string; message:string; meta:any; read:boolean; created_at:string; };

export default function NotificationBell() {
const [open, setOpen] = useState(false);
const [items, setItems] = useState<Noti[]>([]);
const [count, setCount] = useState(0);

async function load() {
    try {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    if (data.success) {
        setItems(data.notifications);
        setCount(data.notifications.filter((n:Noti) => !n.read).length);
    }
    } catch (err) {
    console.error('Load notifications error', err);
    }
}

useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
}, []);

return (
    <div className="relative">
    <button aria-label="Notificaciones" onClick={() => { setOpen(!open); if(!open) load(); }} className="relative">
        <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M12 2C9.8 2 8 4 8 6v1.1C6 8.2 4 10.6 4 13v3l-1 1v1h18v-1l-1-1v-3c0-2.4-2-4.8-4-5.9V6c0-2-1.8-4-4-4z"/></svg>
        {count>0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">{count}</span>}
    </button>

    {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow rounded z-50 max-h-80 overflow-auto">
        {items.length === 0 && <div className="p-3 text-sm text-gray-500">No hay notificaciones</div>}
        {items.map(n => (
            <div key={n.id} className={`p-3 border-b ${n.read ? 'opacity-70' : ''}`}>
            <div className="font-semibold">{n.type}</div>
            <div className="text-sm">{n.message}</div>
            <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
            </div>
        ))}
        </div>
    )}
    </div>
);
}