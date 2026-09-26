import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [email] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      toast.error('Kode OTP harus berisi 6 digit angka');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, code);
      toast.success('Email berhasil diverifikasi! Akun Anda kini aktif.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Kode OTP tidak valid atau telah kadaluwarsa.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    try {
      await resendOtp(email);
      toast.success('Kode OTP baru telah dikirim ke email Anda.');
      setTimer(60);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengirim ulang kode OTP.';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-slate-700/60 text-center">
        <div className="inline-flex p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
          <KeyRound className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Verifikasi Alamat Email</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Kami telah mengirimkan 6-digit kode OTP verifikasi ke alamat email:
        </p>
        <div className="mt-2 inline-block px-3 py-1 rounded-lg glass-card border border-emerald-500/30 text-emerald-300 font-semibold text-xs">
          {email || 'email@anda.com'}
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          {/* OTP Input Boxes */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 text-center text-xl font-bold rounded-xl glass-input border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full gradient-btn py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verifikasi Kode OTP</span>
              </>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Tidak menerima kode?</span>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resendLoading}
            className="flex items-center gap-1.5 font-bold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {timer > 0 ? `Kirim Ulang (${timer}s)` : 'Kirim Ulang Kode'}
          </button>
        </div>
      </div>
    </div>
  );
};
