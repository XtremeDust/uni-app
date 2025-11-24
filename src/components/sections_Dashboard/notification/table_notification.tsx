'use client'
import React, { useState, useEffect } from 'react'
import { Button, Card } from '@/types/ui_components'
import Image from 'next/image'

interface Notification {
    id: string;
    type: string;
    data: {
        titulo: string;
        mensaje: string;
        icono: string;
        color: string;
    };
    read_at: string | null;
    created_at: string;
}

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const getStyles = (color: string) => {
        switch (color) {
            case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600' };
            case 'green': return { bg: 'bg-green-100', text: 'text-green-600' };
            case 'yellow': return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
            case 'red': return { bg: 'bg-red-100', text: 'text-red-600' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
    };

    const renderIcon = (icon: string) => {
        if (icon === 'user-group') return <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>;
        if (icon === 'money') return <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>;
        if (icon === 'warning') return <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>;
        if (icon === 'gavel') return <path d="M14 13l-9.5 9.5a2.5 2.5 0 0 1-3.536-3.536L10.5 9.5"></path>;
        return <circle cx="12" cy="12" r="10"></circle>;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const fetchNotifications = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('token');
        try {
             await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando notificaciones...</div>;

    return (
        <div className="Case2 overflow-y-auto text-black p-4">
            <section className="max-w-5xl mx-auto bg-white  rounded-lg shadow col-span-2 space-y-1">
                
                <div className="flex justify-between items-center mb-6 p-6">
                    <h3 className="text-2xl font-bold text-black">Centro de Notificaciones</h3>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleMarkAllRead}
                            className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                            Marcar todo como leído
                        </button>
                        <Button className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {notifications.map((notif) => {
                                const styles = getStyles(notif.data.color);
                                const isUnread = notif.read_at === null;

                                return (
                                    <div 
                                        key={notif.id} 
                                        className={`relative p-5 flex gap-4 group transition-all duration-200 hover:bg-gray-50
                                            ${isUnread ? 'bg-blue-50/30' : 'bg-white'}`
                                        }
                                    >
                                        {isUnread && (
                                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-600 rounded-r-full"></div>
                                        )}
                                        
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.bg} ${styles.text}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                {renderIcon(notif.data.icono)}
                                            </svg>
                                        </div>

                                        <div className="flex-grow pt-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className={`text-base leading-tight truncate pr-4 ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                                    {notif.data.titulo}
                                                </h4>
                                                
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    {isUnread && (
                                                        <button onClick={() => handleMarkRead(notif.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Marcar como leído">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(notif.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Eliminar">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm mt-1 leading-relaxed ${isUnread ? 'text-gray-800' : 'text-gray-500'}`}>
                                                {notif.data.mensaje}
                                            </p>
                                            
                                            <p className="text-xs text-gray-400 mt-2 font-medium">
                                                {formatDate(notif.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-300"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            <p className="text-lg font-medium text-gray-500">Todo al día</p>
                            <p className="text-sm">No tienes notificaciones nuevas</p>
                        </div>
                    )}

                    {notifications.length > 0 && (
                        <div className="bg-gray-50 p-0 text-center border-t border-gray-100">
                            <button className="text-sm font-semibold hover:bg-unimar/5 p-4 cursor-pointer w-full text-blue-600 hover:text-blue-700 transition-all">
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>  
    )
}