import { useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-cyan-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 animate-slide-in-right z-50`}>
      <span className="text-2xl font-bold">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}

export default Toast;
