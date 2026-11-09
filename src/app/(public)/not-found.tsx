import { PiForkKnife } from "react-icons/pi";

/**
 * Shown to guests when a QR code or link points at a restaurant that doesn't
 * exist (or has moved). Written for diners, not for the restaurant owner.
 */
export default function GuestNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="max-w-sm text-center">
        <PiForkKnife aria-hidden className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-h2 text-foreground">We couldn&apos;t find this restaurant</h1>
        <p className="mt-2 text-body text-muted-foreground">
          The QR code or link may be out of date. Ask a member of staff for the current menu.
        </p>
      </div>
    </main>
  );
}
