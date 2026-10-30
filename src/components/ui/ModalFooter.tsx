import { cn } from '@/utils/cn';
import { ModalFooterProps } from "@/types/components/ui/ModalFooter.types";

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col-reverse gap-3 [&>*]:w-full xs:flex-row xs:justify-end xs:[&>*]:w-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}
