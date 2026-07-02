"use client";

import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 mx-auto w-full max-w-lg rounded-xl bg-white shadow-xl',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="text-sm text-neutral-500">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children && <div className="px-6 py-4">{children}</div>}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
