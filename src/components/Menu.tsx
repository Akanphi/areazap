"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

interface MenuItem {
    icon: string;
    label: string;
    href: string;
    visible: string[];
    isLogout?: boolean;
}

const role = "User";
const menuItems: MenuItem[] = [
    {
        icon: "/dashboard.png",
        label: "Dashboard",
        href: "/dashboard",
        visible: ["Admin", "User"],
    },
    {
        icon: "/users.png",
        label: "Users",
        href: "/users",
        visible: ["Admin"],
    },
    {
        icon: "/zaps.png",
        label: "Area Editor",
        href: "/area-editor",
        visible: ["Admin", "User"],
    },
    {
        icon: "/zaps-manager.png",
        label: "Area Manager",
        href: "/area-manager",
        visible: ["Admin", "User"],
    },
    {
        icon: "/logs.png",
        label: "Logs",
        href: "/logs",
        visible: ["Admin", "User"],
    },
    {
        icon: "/suscription.png",
        label: "Subscription",
        href: "/subscription",
        visible: ["Admin", "User"],
    },
    {
        icon: "/services.png",
        label: "Services",
        href: "/services",
        visible: ["Admin", "User"],
    },
    {
        icon: "/settings.png",
        label: "Settings",
        href: "/settings",
        visible: ["Admin", "User"],
    },
    {
        icon: "/logout.png",
        label: "Logout",
        href: "/",
        visible: ["Admin", "User"],
        isLogout: true,
    },
]

interface MenuProps {
    isMobile?: boolean;
}

export default function Menu({ isMobile = false }: MenuProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // logout();
        router.push('/');
    };

    return (
        <div className="mt-4 space-y-1">
            {menuItems.map(item => {
                if (!item.visible.includes(role)) return null;

                const isActive = pathname === item.href;

                if (item.isLogout) {
                    return (
                        <button
                            key={item.label}
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 group text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 cursor-pointer border border-transparent hover:border-red-200 hover:shadow-md ${isMobile ? 'justify-start' : 'justify-center lg:justify-start'
                                }`}
                        >
                            <div className="shrink-0 p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-all duration-300">
                                <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                            </div>
                            <span className={`font-medium ${isMobile ? 'block' : 'hidden lg:block'}`}>{item.label}</span>
                        </button>
                    )
                }

                return (
                    <Link
                        href={item.href}
                        key={item.label}
                        className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 group border ${isActive
                            ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 text-purple-700 shadow-md border-purple-200'
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 hover:text-gray-900 border-transparent hover:border-purple-100 hover:shadow-sm'
                            } ${isMobile ? 'justify-start' : 'justify-center lg:justify-start'}`}
                    >
                        <div className={`shrink-0 p-2 rounded-lg transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-br from-purple-200 to-pink-200 shadow-sm'
                            : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-purple-100 group-hover:to-pink-100'
                            }`}>
                            <Image
                                src={item.icon}
                                alt={`${item.label} icon`}
                                width={20}
                                height={20}
                                className={`w-5 h-5 object-contain transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                                    }`}
                            />
                        </div>
                        <span className={`font-medium transition-all duration-300 ${isActive ? 'font-semibold' : ''
                            } ${isMobile ? 'block' : 'hidden lg:block'}`}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}