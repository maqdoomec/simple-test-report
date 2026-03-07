import { useEffect, type FC } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    removeToast: (id: string) => void;
}

const ToastContainer: FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} removeToast={removeToast} />
            ))}
        </div>
    );
};

const ToastItem: FC<{ toast: ToastMessage; removeToast: (id: string) => void }> = ({ toast, removeToast }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    const getStyle = () => {
        switch (toast.type) {
            case 'success':
                return 'border-l-4 border-status-pass';
            case 'error':
                return 'border-l-4 border-status-fail';
            case 'info':
            default:
                return 'border-l-4 border-status-info';
        }
    };

    return (
        <div
            className={`bg-bg-card text-text-main px-4 py-3 rounded shadow-lg flex items-center gap-3 pointer-events-auto animate-slide-in min-w-[250px] ${getStyle()}`}
        >
            <div className="flex-1 text-sm">{toast.message}</div>
            <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-main focus:outline-none bg-transparent pt-[2px]"
            >
                ×
            </button>
        </div>
    );
};

export default ToastContainer;