"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyEmail, sendConfirmation } from "@/api/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "input" | "success" | "error">("pending");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const purpose = searchParams.get("purpose") as 'Confirm_account' | 'Reset_password' || 'Confirm_account';
  const tokenFromUrl = searchParams.get("token");

  useEffect(() => {
    if (tokenFromUrl && purpose === 'Confirm_account') {
      verify(tokenFromUrl, purpose);
    } else {
      setStatus("input");
    }
  }, [searchParams, tokenFromUrl, purpose]);

  const verify = async (token: string, actionPurpose: 'Confirm_account' | 'Reset_password', pwd?: string, pwdConfirm?: string) => {
    setIsLoading(true);
    setStatus("pending");
    console.log("Starting verification:", { token, actionPurpose, pwd: pwd ? "SET" : "NOT SET" });
    try {
      const response = await verifyEmail({
        token,
        purpose: actionPurpose,
        password: pwd,
        password_confirmation: pwdConfirm,
      });
      console.log("Verification successful:", response);

      setStatus("success");
      setMessage(actionPurpose === 'Reset_password' ? "Mot de passe réinitialisé avec succès." : "Compte confirmé avec succès.");

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      console.error("Verification failed:", err.response?.data || err.message);
      setStatus("error");

      if (err.response?.status === 401) {
        setMessage("Token invalide, expiré ou déjà utilisé.");
      } else if (err.response?.status === 400) {
        const detail = err.response?.data?.detail || "Requête invalide. Veuillez vérifier vos informations.";
        setMessage(detail);
      } else if (err.response?.status === 429) {
        setMessage("Trop de tentatives. Veuillez réessayer dans quelques minutes.");
      } else if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Une erreur inattendue est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResendCode = async () => {
    const email = searchParams.get("email");
    console.log(email);
    if (!email) {
      setResendMessage({ type: 'error', text: "Email manquant. Veuillez vous reconnecter." });
      return;
    }

    setResendLoading(true);
    setResendMessage(null);
    try {
      await sendConfirmation(email.toLocaleLowerCase());
      setResendMessage({ type: 'success', text: "Un nouveau code a été envoyé." });
    } catch (err: any) {
      if (err.response?.status === 429) {
        setResendMessage({ type: 'error', text: "Trop de tentatives. Veuillez réessayer dans 5 minutes." });
      } else {
        setResendMessage({ type: 'error', text: "Erreur lors de l'envoi du code." });
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenFromUrl || code.join("");

    if (purpose === 'Reset_password') {
      verify(token, "Reset_password", password, passwordConfirmation);
    } else {
      if (token.length === 6 || tokenFromUrl) {
        verify(token, "Confirm_account");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center animate-in fade-in duration-500">
      {status === "pending" && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100">
              <Loader2 className="w-8 h-8 text-[#1DD3C3] animate-spin" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Vérification en cours...</p>
        </div>
      )}

      {status === "input" && (
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {purpose === 'Reset_password' ? "Réinitialiser le mot de passe" : "Vérifiez votre email"}
            </h2>
            <p className="text-gray-600">
              {purpose === 'Reset_password'
                ? "Veuillez entrer le code reçu et votre nouveau mot de passe."
                : "Entrez le code à 6 chiffres reçu par email."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!tokenFromUrl && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 block text-left">Code de vérification</label>
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-[#1DD3C3] focus:ring-0 transition-all outline-none text-gray-900"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {purpose === 'Reset_password' && (
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-[#1DD3C3] focus:ring-0 transition-all outline-none text-gray-900"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-[#1DD3C3] focus:ring-0 transition-all outline-none text-gray-900"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!tokenFromUrl && code.join("").length !== 6) || (purpose === 'Reset_password' && (!password || password !== passwordConfirmation))}
              className="w-full py-4 bg-[#1DD3C3] hover:bg-[#00E5CC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-[#1DD3C3]/20"
            >
              {isLoading ? "Traitement..." : (purpose === 'Reset_password' ? "Réinitialiser" : "Vérifier")}
            </button>
          </form>

          {purpose === 'Confirm_account' && (
            <div className="pt-4 border-t border-stone-100">
              <p className="text-sm text-gray-500 mb-2">Vous n'avez pas reçu de code ?</p>
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-[#1DD3C3] hover:text-[#00E5CC] font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {resendLoading ? "Envoi en cours..." : "Renvoyer le code"}
              </button>
              {resendMessage && (
                <p className={`mt-2 text-xs font-medium ${resendMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {resendMessage.text}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Succès !</h2>
            <p className="text-gray-600">{message}</p>
          </div>
          <p className="text-sm text-gray-400">Redirection vers la page de connexion...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
            <XCircle className="text-red-500 w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Erreur</h2>
            <p className="text-gray-600">{message}</p>
          </div>
          <button
            onClick={() => setStatus("input")}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Suspense fallback={<Loader2 className="w-10 h-10 text-[#1DD3C3] animate-spin" />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
