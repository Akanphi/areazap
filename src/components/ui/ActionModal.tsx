import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { ActionModalProps } from '../../types/api';

const ActionModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  onConfirm,
  confirmText = "Continuer"
}: ActionModalProps) => {

  // Bloquer le scroll quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
          bg: "bg-emerald-50",
          accent: "border-emerald-100"
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
          bg: "bg-amber-50",
          accent: "border-amber-100"
        };
      case 'loading':
        return {
          icon: <Loader2 className="w-8 h-8 text-[#1DD3C3] animate-spin" />,
          bg: "bg-[#1DD3C3]/5",
          accent: "border-[#1DD3C3]/20"
        };
      default:
        return {
          icon: <Info className="w-8 h-8 text-blue-500" />,
          bg: "bg-blue-50",
          accent: "border-blue-100"
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay avec flou */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          {/* Icon Header */}
          <div className={`w-20 h-20 rounded-[2rem] ${styles.bg} border-4 border-white shadow-sm flex items-center justify-center mb-8 mx-auto`}>
            {styles.icon}
          </div>

          {/* Content */}
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
              {title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm || onClose}
              className="w-full py-4 bg-[#1DD3C3] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#1DD3C3]/20 hover:bg-[#00E5CC] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              {confirmText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 bg-white text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:text-slate-600 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="h-2 w-full bg-[#1DD3C3] opacity-10" />
      </div>
    </div>
  );
};

export default ActionModal;