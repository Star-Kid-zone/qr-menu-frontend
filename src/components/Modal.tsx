'use client';

import React, { useEffect, useId, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import { ModalProps } from "@/types/components/Modal.types";

export type { ModalProps };

let openModalCount = 0;
let previousBodyOverflow: string | null = null;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  footer,
  showCloseButton = true,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const focusFirstElement = () => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter(
      (element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden')
    );

    const target = focusableElements[0] ?? dialog;
    target.focus({ preventScroll: true });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    let frame = 0;

    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      if (openModalCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      openModalCount += 1;
      window.addEventListener('keydown', handleEscape);

      frame = window.requestAnimationFrame(() => {
        if (showCloseButton && closeButtonRef.current) {
          closeButtonRef.current.focus({ preventScroll: true });
          return;
        }

        focusFirstElement();
      });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleEscape);
      if (isOpen) {
        openModalCount = Math.max(openModalCount - 1, 0);
        if (openModalCount === 0) {
          document.body.style.overflow = previousBodyOverflow || 'unset';
          previousBodyOverflow = null;
        }
      }

      const previous = previousActiveElementRef.current;
      if (previous && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, showCloseButton]);

  if (!isOpen) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter(
      (element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden')
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative inset-x-4 w-[calc(100%-2rem)] sm:inset-x-0 sm:w-full ${maxWidth} bg-card rounded-[1.5rem] sm:rounded-[2rem] border border-border shadow-2xl shadow-foreground/5 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-6 border-b border-border bg-muted/20">
          <h2 id={titleId} className="text-lg sm:text-2xl font-black text-foreground tracking-tight break-words">
            {title}
          </h2>
          {showCloseButton && (
            <button
              ref={closeButtonRef}
              onClick={onClose}
              type="button"
              aria-label={`Close ${title}`}
              className="shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all active:scale-95"
            >
              <HiX className="size-6" />
            </button>
          )}
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-4 py-4 sm:px-8 sm:py-6 border-t border-border bg-muted/20 flex flex-col-reverse gap-3 xs:flex-row xs:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
