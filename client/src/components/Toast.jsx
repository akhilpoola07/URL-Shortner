import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const icons = {
        success: <CheckCircle2 size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };

    return (
        <div className="toast-container">
            <div className={`toast ${type}`}>
                {icons[type]}
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: 'auto' }}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
