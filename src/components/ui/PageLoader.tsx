import { LoadingScreen } from '@/components/LoadingScreens';
import type { PageLoaderProps } from '@/types/ui/ui.types';

export function PageLoader({
  label = 'Loading...',
  fullScreen = false,
  className,
  theme = 'restaurant-plate',
  surfaceClassName,
  textClassName,
}: PageLoaderProps) {
  return (
    <LoadingScreen
      theme={theme}
      label={label}
      fullScreen={fullScreen}
      className={className}
      surfaceClassName={surfaceClassName}
      textClassName={textClassName}
    />
  );
}

