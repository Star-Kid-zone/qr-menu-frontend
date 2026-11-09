import { PiTrashBold } from "react-icons/pi";
import { cn } from "@/utils/cn";

interface MediaRemoveButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

/**
 * Round remove chip that sits on the top-right corner of a media tile
 * (photo or video). Always visible so it works on touch and keyboard.
 */
export function MediaRemoveButton({ onClick, label, className }: MediaRemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95",
        className
      )}
    >
      <PiTrashBold size={15} aria-hidden />
    </button>
  );
}

export default MediaRemoveButton;
