"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    User,
    Mail,
    Camera,
    MapPin,
    Link as LinkIcon,
    Twitter,
    Github,
    Save,
    Calendar,
    Shield,
    CheckCircle2,
    Loader2,
    Clock,
    Lock,
    Smartphone,
    Globe,
    Award,
    TrendingUp,
    Activity
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "Paris, France",
        website: "",
        phone: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                bio: "Passionné(e) par la technologie et l'innovation.",
                location: "Paris, France",
                website: "",
                phone: ""
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSaving(false);
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const stats = [
        { label: "Automatisations", value: "12", icon: Activity, color: "from-blue-500 to-cyan-500" },
        { label: "Services connectés", value: "8", icon: Globe, color: "from-purple-500 to-pink-500" },
        { label: "Temps économisé", value: "24h", icon: Clock, color: "from-orange-500 to-red-500" }
    ];

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-purple-50/30">
            <div className="max-w-7xl mx-auto">
                
                {/* Notification de succès */}
                {showSuccess && (
                    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Succès !</p>
                            <p className="text-xs opacity-90">Profil mis à jour avec succès</p>
                        </div>
                    </div>
                )}

                {/* Header / Cover */}
                <div className="relative h-72 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl overflow-hidden mb-28">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-[-20%] right-[-5%] w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
                            <div className="absolute top-[30%] right-[20%] w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
                        </div>
                    </div>

                    {/* Profile Picture & Info */}
                    <div className="absolute -bottom-20 left-8 md:left-10 flex flex-col md:flex-row md:items-end gap-6">
                        <div className="relative group">
                            <div className="w-44 h-44 rounded-[2.75rem] border-[6px] border-white shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-3">
                                <Image
                                    src="/profil.png"
                                    alt="Profile"
                                    width={176}
                                    height={176}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>
                            <button className="absolute bottom-3 right-3 p-3.5 bg-white text-purple-600 rounded-2xl shadow-xl hover:bg-purple-50 hover:shadow-2xl transition-all transform hover:rotate-12 hover:scale-110 active:scale-95">
                                <Camera className="w-5 h-5" />
                            </button>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                        </div>
                        
                        <div className="mb-6 md:mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                                    {formData.firstName} {formData.lastName}
                                </h1>
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl flex items-center gap-2 border border-white/30 shadow-lg">
                                    <Shield className="w-4 h-4 text-white" />
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                                        {user?.role || "Membre"}
                                    </span>
                                </div>
                                <span className="text-purple-100 text-sm font-semibold opacity-90">
                                    @{user?.firstName?.toLowerCase() || 'user'}
                                </span>
                                <div className="flex items-center gap-1.5 text-purple-100/80 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>Rejoint en Jan 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 md:right-10 flex gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl ${
                                isEditing 
                                ? "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30" 
                                : "bg-white text-gray-900 hover:bg-gray-50 hover:shadow-2xl active:scale-95"
                            }`}
                        >
                            {isEditing ? "Annuler" : "Modifier le profil"}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all group cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-black text-gray-900 mb-1 group-hover:scale-110 transition-transform inline-block">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* About Section */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50 hover:shadow-lg transition-shadow">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                À propos
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-2xl transition-all -ml-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-sm font-semibold text-gray-700 break-all">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-2xl transition-all -ml-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform flex-shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Localisation</p>
                                        <p className="text-sm font-semibold text-gray-700">{formData.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-2xl transition-all -ml-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform flex-shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Membre depuis</p>
                                        <p className="text-sm font-semibold text-gray-700">Janvier 2024</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Social Networks */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50 hover:shadow-lg transition-shadow">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                Réseaux Sociaux
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-600', url: '#' },
                                    { name: 'Github', icon: Github, color: 'from-gray-700 to-gray-900', url: '#' }
                                ].map((social) => (
                                    <button 
                                        key={social.name}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all group border border-transparent hover:border-purple-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                                <social.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors">{social.name}</p>
                                                <p className="text-xs text-gray-400">Non connecté</p>
                                            </div>
                                        </div>
                                        <LinkIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 text-purple-500 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Security Badge */}
                        <section className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-lg text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black">Compte Vérifié</h3>
                                    <p className="text-xs opacity-80">Authentification activée</p>
                                </div>
                            </div>
                            <p className="text-sm opacity-90 leading-relaxed">
                                Votre compte est protégé avec une authentification à deux facteurs.
                            </p>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Personal Information */}
                        <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100/50 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2">Informations Personnelles</h3>
                                    <p className="text-gray-500 text-sm">Gérez vos détails publics et vos paramètres de contact.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" />
                                            Prénom
                                        </label>
                                        <input
                                            disabled={!isEditing}
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all disabled:opacity-50 font-semibold text-gray-700 shadow-sm hover:border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" />
                                            Nom
                                        </label>
                                        <input
                                            disabled={!isEditing}
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all disabled:opacity-50 font-semibold text-gray-700 shadow-sm hover:border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5" />
                                            Site Web
                                        </label>
                                        <input
                                            disabled={!isEditing}
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                                            placeholder="https://votre-site.com"
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all disabled:opacity-50 font-semibold text-gray-700 shadow-sm hover:border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
                                            <Smartphone className="w-3.5 h-3.5" />
                                            Téléphone
                                        </label>
                                        <input
                                            disabled={!isEditing}
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+33 6 12 34 56 78"
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all disabled:opacity-50 font-semibold text-gray-700 shadow-sm hover:border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-500 uppercase ml-1">Biographie</label>
                                    <textarea
                                        disabled={!isEditing}
                                        rows={5}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        placeholder="Parlez-nous de vous..."
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all disabled:opacity-50 font-semibold text-gray-700 resize-none shadow-sm hover:border-gray-200"
                                    ></textarea>
                                    <p className="text-xs text-gray-400 ml-1">{formData.bio.length}/500 caractères</p>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-4 animate-in fade-in slide-in-from-bottom-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                        >
                                            Annuler
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-200 disabled:opacity-70 active:scale-95"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Enregistrement...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    Enregistrer les modifications
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </section>

                        {/* Account Activity */}
                        <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100/50 hover:shadow-lg transition-shadow">
                            <h3 className="text-2xl font-black text-gray-900 mb-8">Activité du compte</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 flex items-center justify-between group hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                                            <div className="relative">
                                                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">Statut</p>
                                            <p className="text-xs text-green-600 font-bold">En ligne actuellement</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 flex items-center justify-between group hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-purple-600">
                                            <Shield className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">Sécurité</p>
                                            <p className="text-xs text-purple-600 font-black uppercase tracking-tight">Vérifié ✓</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 flex items-center justify-between group hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600">
                                            <Lock className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">2FA</p>
                                            <p className="text-xs text-blue-600 font-bold">Activé</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-100 flex items-center justify-between group hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-orange-600">
                                            <Activity className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">Dernière connexion</p>
                                            <p className="text-xs text-orange-600 font-bold">Il y a 2 minutes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}