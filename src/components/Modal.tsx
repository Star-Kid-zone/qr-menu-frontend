'use client';

import React, { useEffect, useId, useRef } from 'react';
import { PiX } from "react-icons/pi";
import { ModalProps } from "@/types/ui/Modal.types";

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
        className="fixed inset-0 bg-foreground/40"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative inset-x-4 w-[calc(100%-2rem)] sm:inset-x-0 sm:w-full ${maxWidth} bg-card rounded-lg border border-border shadow-lg overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-start justify-between gap-4 px-4 pt-4 pb-3 sm:px-6 sm:pt-6">
          <h2 id={titleId} className="text-h2 text-foreground break-words">
            {title}
          </h2>
          {showCloseButton && (
            <button
              ref={closeButtonRef}
              onClick={onClose}
              type="button"
              aria-label={`Close ${title}`}
              className="-mr-2 -mt-1 shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <PiX className="size-5" aria-hidden />
            </button>
          )}
        </div>

        <div className="px-4 pb-6 sm:px-6 overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-4 py-3 sm:px-6 border-t border-border flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
