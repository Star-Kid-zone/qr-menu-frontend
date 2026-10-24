import type { InputHTMLAttributes } from 'react';
import { HiSearch } from 'react-icons/hi';
import { cn } from '@/utils/cn';
import { Input } from '../ui/input';
import { SearchInputProps } from "@/types/components/ui/SearchInput.types";

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className={cn('group relative w-full max-w-md', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <HiSearch className="size-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
      </div>
      <Input type="search" className="pl-12" {...props} />
    </div>
  );
}
