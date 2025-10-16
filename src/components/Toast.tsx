import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle size={20} />,
    warning: <AlertCircle size={20} />,
    error: <AlertCircle size={20} />
  };

  const colors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
    >
      {icons[type]}
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
        <X size={18} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: 'success' | 'warning' | 'error' }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
