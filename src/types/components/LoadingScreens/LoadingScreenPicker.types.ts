import type { LoadingScreenTheme } from '@/components/LoadingScreens/types';

export interface LoadingScreenPickerProps {
    value: string;
    onChange: (value: LoadingScreenTheme) => void;
    disabled?: boolean;
    className?: string;
    industryHint?: string | null;
}
