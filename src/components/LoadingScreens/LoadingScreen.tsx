import { cn } from '@/utils/cn';
import { Spinner } from '@/components/ui/Spinner';
import { RestaurantLoaderIcon } from '@/components/ui/RestaurantLoaderIcon';
import { getLoadingScreenOption, normalizeLoadingScreenTheme } from './registry';
import { LoadingScreenProps } from "@/types/public/LoadingScreens/LoadingScreen.types";

function AnimatedStage({ theme }: { theme: string | null }) {
  const normalized = normalizeLoadingScreenTheme(theme);

  if (normalized === 'circular') {
    return <Spinner size="lg" />;
  }

  const base = getLoadingScreenOption(normalized);
  const accent = base.accent;

  const renderRestaurant = (variant: string) => {
    switch (variant) {
      case 'restaurant-flame':
        return (
          <div className="relative h-24 w-24">
            <div
              className="absolute inset-4 rounded-full blur-xl opacity-60 animate-pulse"
              style={{ background: accent }}
            />
            <div
              className="absolute inset-0 rounded-[2rem] animate-[spin_2.8s_linear_infinite]"
              style={{
                border: `3px solid ${accent}30`,
                borderTopColor: accent,
                borderBottomColor: '#ffffff',
              }}
            />
            <div
              className="absolute inset-7 rounded-t-full rounded-b-[30%] animate-bounce"
              style={{ background: `linear-gradient(180deg, ${accent}, #fff7ed)` }}
            />
          </div>
        );
      case 'restaurant-steam':
        return (
          <div className="relative flex h-24 w-24 items-end justify-center gap-2">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className="block w-3 rounded-full opacity-80"
                style={{
                  height: `${36 - idx * 6}px`,
                  background: accent,
                  animation: `steam-rise 1.4s ease-in-out ${idx * 0.18}s infinite`,
                }}
              />
            ))}
          </div>
        );
      case 'restaurant-plate':
        return <RestaurantLoaderIcon size="lg" accentColor={accent} />;
      case 'restaurant-bento':
        return (
          <div className="grid h-24 w-24 grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <span
                key={idx}
                className="rounded-2xl animate-pulse"
                style={{ background: idx % 2 === 0 ? accent : '#ffffff', animationDelay: `${idx * 120}ms` }}
              />
            ))}
          </div>
        );
      case 'restaurant-pizza':
        return (
          <div className="relative h-24 w-24">
            <div
              className="absolute inset-0 rounded-full animate-[spin_2.4s_linear_infinite]"
              style={{ border: `4px solid ${accent}22`, borderTopColor: accent, borderRadius: '9999px' }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rotate-12"
              style={{ background: `linear-gradient(135deg, ${accent}, #fef3c7)` }}
            />
          </div>
        );
      case 'restaurant-burger':
        return (
          <div className="relative h-24 w-24">
            <div
              className="absolute inset-x-4 top-3 h-3 rounded-full animate-bounce"
              style={{ background: accent }}
            />
            <div
              className="absolute inset-x-3 top-10 h-4 rounded-full animate-pulse"
              style={{ background: '#fff7ed' }}
            />
            <div
              className="absolute inset-x-4 bottom-4 h-3 rounded-full animate-bounce"
              style={{ background: accent }}
            />
          </div>
        );
      case 'restaurant-sushi':
        return (
          <div className="relative h-24 w-24 overflow-hidden rounded-[2rem] border border-white/30">
            <div
              className="absolute inset-y-0 left-0 w-1/2 animate-[slide-x_1.7s_ease-in-out_infinite]"
              style={{ background: accent }}
            />
            <div className="absolute inset-0 rounded-[2rem] border-[3px] border-white/70" />
          </div>
        );
      case 'restaurant-bakery':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-x-6 bottom-5 h-6 rounded-full" style={{ background: accent }} />
            <div className="absolute left-1/2 top-4 h-10 w-10 -translate-x-1/2 rounded-full animate-bounce" style={{ background: '#fff7ed' }} />
          </div>
        );
      case 'restaurant-noodle':
        return (
          <div className="relative h-24 w-24">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="absolute inset-x-2 rounded-full animate-[wave_1.6s_ease-in-out_infinite]"
                style={{
                  top: `${18 + idx * 16}px`,
                  height: '8px',
                  background: accent,
                  animationDelay: `${idx * 180}ms`,
                }}
              />
            ))}
          </div>
        );
      case 'restaurant-grill':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-4 rounded-full" style={{ background: `${accent}25` }} />
            <div className="absolute inset-6 rounded-full animate-ping" style={{ background: accent }} />
            <div className="absolute inset-x-6 bottom-5 h-2 rounded-full" style={{ background: '#fff7ed' }} />
          </div>
        );
      case 'restaurant-cocktail':
        return (
          <div className="relative h-24 w-24">
            <div
              className="absolute inset-4 rounded-full animate-[spin_3.5s_linear_infinite]"
              style={{ border: `4px solid ${accent}30`, borderTopColor: accent }}
            />
            <div className="absolute inset-8 rounded-md rotate-45" style={{ background: '#fff7ed' }} />
          </div>
        );
      case 'restaurant-tandoor':
        return (
          <div className="relative h-24 w-24">
            <div
              className="absolute inset-5 rounded-full blur-xl opacity-70 animate-pulse"
              style={{ background: accent }}
            />
            <div className="absolute inset-x-7 top-6 h-10 rounded-t-full rounded-b-[30%]" style={{ background: accent }} />
          </div>
        );
      case 'restaurant-bubble-tea':
        return (
          <div className="relative h-24 w-24">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span
                key={idx}
                className="absolute rounded-full animate-bounce"
                style={{
                  width: `${8 + idx * 2}px`,
                  height: `${8 + idx * 2}px`,
                  left: `${10 + idx * 10}px`,
                  bottom: `${10 + idx * 2}px`,
                  background: accent,
                  animationDelay: `${idx * 110}ms`,
                }}
              />
            ))}
          </div>
        );
      case 'restaurant-seafood':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-x-3 bottom-5 h-8 rounded-full" style={{ background: accent }} />
            <div className="absolute inset-x-2 top-3 h-2 rounded-full animate-[wave_2s_ease-in-out_infinite]" style={{ background: '#fff7ed' }} />
          </div>
        );
      case 'restaurant-dessert':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-6 rounded-full animate-pulse" style={{ background: accent }} />
            <div className="absolute inset-10 rounded-full border-4 border-white/70" />
          </div>
        );
      case 'restaurant-curry':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-4 rounded-[2rem] animate-[spin_3.8s_linear_infinite]" style={{ border: `4px solid ${accent}30`, borderTopColor: accent }} />
            <div className="absolute inset-x-7 top-7 h-8 rounded-full" style={{ background: '#fff7ed' }} />
          </div>
        );
      case 'restaurant-asian':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-6 rounded-full border-4 border-white/70" />
            <div className="absolute inset-8 rounded-full animate-[slide-x_1.8s_ease-in-out_infinite]" style={{ background: accent }} />
          </div>
        );
      case 'restaurant-mediterranean':
        return (
          <div className="relative h-24 w-24">
            <div className="absolute inset-4 rounded-full animate-spin" style={{ border: `4px dashed ${accent}`, opacity: 0.8 }} />
            <div className="absolute inset-[38%] rounded-full bg-white/90" />
          </div>
        );
      default:
        return <Spinner size="lg" />;
    }
  };

  if (normalized.startsWith('restaurant-')) {
    return renderRestaurant(normalized);
  }

  switch (normalized) {
    case 'universal-orbit':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-[3px] border-dashed" style={{ borderColor: `${accent}50` }} />
          <div className="absolute inset-4 rounded-full animate-[spin_2.2s_linear_infinite]" style={{ border: `3px solid ${accent}30`, borderTopColor: accent }} />
        </div>
      );
    case 'universal-wave':
      return (
        <div className="flex h-20 items-end gap-2">
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className="block w-3 rounded-full"
              style={{ height: `${20 + idx * 10}px`, background: accent, animation: `wave 1s ease-in-out ${idx * 120}ms infinite` }}
            />
          ))}
        </div>
      );
    case 'universal-grid':
      return (
        <div className="grid h-24 w-24 grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <span key={idx} className="rounded-xl animate-pulse" style={{ background: idx % 2 ? '#ffffff' : accent, animationDelay: `${idx * 120}ms` }} />
          ))}
        </div>
      );
    case 'universal-pulse':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-4 rounded-full animate-ping" style={{ background: `${accent}35` }} />
          <div className="absolute inset-8 rounded-full" style={{ background: accent }} />
        </div>
      );
    case 'retail-bag':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-5 rounded-2xl" style={{ background: accent }} />
          <div className="absolute left-1/2 top-3 h-5 w-8 -translate-x-1/2 rounded-t-full border-4 border-white/80 border-b-0" />
        </div>
      );
    case 'wellness-leaf':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-6 rounded-[100%_0_100%_0] rotate-45 animate-pulse" style={{ background: accent }} />
        </div>
      );
    case 'tech-orbit':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-[3px] border-dashed" style={{ borderColor: `${accent}55` }} />
          <div className="absolute inset-4 rounded-full animate-[spin_2.8s_linear_infinite]" style={{ border: `3px solid ${accent}25`, borderTopColor: accent }} />
        </div>
      );
    case 'hospitality-bell':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-6 rounded-t-full rounded-b-2xl animate-bounce" style={{ background: accent }} />
          <div className="absolute left-1/2 top-3 h-4 w-10 -translate-x-1/2 rounded-full border-4 border-white/80 border-b-0" />
        </div>
      );
    case 'salon-mirror':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-4 rounded-[2rem] border-[3px] animate-pulse" style={{ borderColor: accent }} />
          <div className="absolute inset-8 rounded-full bg-white/90" />
        </div>
      );
    case 'clinic-cross':
      return (
        <div className="relative h-24 w-24">
          <div className="absolute inset-7 rounded-md" style={{ background: accent }} />
          <div className="absolute inset-x-7 top-4 h-4 rounded-md" style={{ background: accent }} />
        </div>
      );
    default:
      return <Spinner size="lg" />;
  }
}

export default function LoadingScreen({
  theme = 'circular',
  label,
  fullScreen = false,
  className,
  surfaceClassName,
  textClassName,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center overflow-x-hidden px-4',
        fullScreen ? 'min-h-dvh' : 'min-h-[40vh]',
        className,
        surfaceClassName
      )}
    >
      <div className="flex max-w-full flex-col items-center gap-4">
        <AnimatedStage theme={theme} />
        {label ? (
          <p
            className={cn(
              'max-w-full break-words text-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground',
              textClassName
            )}
          >
            {label}
          </p>
        ) : null}
      </div>
      <style>{`
        @keyframes steam-rise {
          0%, 100% { transform: translateY(4px); opacity: .35; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes slide-x {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(18px); }
        }
        @keyframes wave {
          0%,100% { transform: scaleY(.7); opacity: .7; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export { LoadingScreen };
