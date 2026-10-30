import { LoadingScreen } from '@/components/LoadingScreens';
import type { PageLoaderProps } from '@/types/ui.interface';

export function PageLoader({
  label = 'Loading...',
  fullScreen = false,
  className,
  theme = 'circular',
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

export default PageLoader;
