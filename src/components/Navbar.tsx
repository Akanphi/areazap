"use client"
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MessageSquare, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', message: 'Nouveau projet soumis pour révision', time: '2min', read: false, type: 'info' },
    { id: '2', message: 'Budget mensuel atteint à 90%', time: '1h', read: false, type: 'warning' },
    { id: '3', message: 'Rapport mensuel généré avec succès', time: '2h', read: true, type: 'success' },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Recherche:', searchQuery);
    }
  };

  return (
    <nav className="z-1000 flex items-center justify-between p-4 bg-linear-to-br from-slate-100 to-[#F8CACF] shadow-sm border-b border-white/20 backdrop-blur-sm">
      {/* SEARCH SECTION */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des projets, utilisateurs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer">×</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ICONS AND USER SECTION */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button className="md:hidden bg-white/70 backdrop-blur-sm rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/80 transition-colors duration-200">
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Messages */}
        <div className="relative">
          <div className="bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors">
            <Image src="/message.png" alt="Messages" width={20} height={20} />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-white/70 backdrop-blur-sm rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/80 transition-all duration-200 hover:scale-105 relative"
          >
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
              <Image src="/notification.png" alt="" width={20} height={20} />
              <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
            </div>
            {unreadCount > 0 && (
              <span className=" absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown des notifications */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-purple-50/50' : ''
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notification.type === 'info' ? 'bg-blue-500' :
                          notification.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 hover:bg-white/80"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-800">{user?.firstName} {user?.lastName}</span>
              <span className="text-xs text-gray-500">{user?.role}</span>
            </div>
            <div className="relative">
              <Image
                src="/profil.png"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full ring-2 ring-white/50"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Image
                    src="/profil.png"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4" />
                  Mon profil
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </button>
              </div>
              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;