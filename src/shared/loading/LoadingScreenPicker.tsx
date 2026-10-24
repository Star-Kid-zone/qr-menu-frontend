import { cn } from '@/utils/cn';
import LoadingScreen from './LoadingScreen';
import {
  getLoadingScreenGroupHint,
  getLoadingScreenOption,
  groupLoadingScreenOptions,
} from './registry';
import type { LoadingScreenTheme } from './types';
import { LoadingScreenPickerProps } from "@/types/components/LoadingScreens/LoadingScreenPicker.types";

export function LoadingScreenPicker({
  value,
  onChange,
  disabled = false,
  className,
  industryHint,
}: LoadingScreenPickerProps) {
  const groups = groupLoadingScreenOptions();
  const recommendedGroup = getLoadingScreenGroupHint(industryHint);
  const selectedOption = getLoadingScreenOption(value);
  const orderedGroups = recommendedGroup
    ? [
        ...groups.filter((group) => group.group === recommendedGroup),
        ...groups.filter((group) => group.group !== recommendedGroup),
      ]
    : groups;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">
              Current selection
            </p>
            <h4 className="break-words text-lg font-black text-foreground">{selectedOption.label}</h4>
            <p className="max-w-2xl break-words text-sm text-muted-foreground">{selectedOption.description}</p>
            <p className="break-words text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Default fallback stays circular if no loading screen is selected.
            </p>
          </div>

          <div className="flex items-center justify-center rounded-[1.75rem] border border-border bg-background p-5">
            <LoadingScreen
              theme={selectedOption.value}
              label="Preparing your experience"
              className="!min-h-0 py-2"
            />
          </div>
        </div>
      </div>

      <div className="max-h-[72vh] space-y-5 overflow-y-auto pr-1">
        {orderedGroups.map((group) => {
          const isRecommendedGroup = recommendedGroup === group.group;

          return (
            <section key={group.group} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="break-words text-sm font-black text-foreground">{group.group}</h4>
                  <p className="break-words text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    {group.options.length} loading screens
                  </p>
                </div>
                {isRecommendedGroup ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                    Recommended
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.options.map((option) => {
                  const selected = option.value === selectedOption.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange(option.value)}
                      disabled={disabled}
                      className={cn(
                        'group rounded-[1.75rem] border p-4 text-left transition-all duration-200',
                        selected
                          ? 'border-primary bg-primary/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-2 ring-primary/20'
                          : 'border-border bg-background hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm',
                        disabled && 'cursor-not-allowed opacity-60'
                      )}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <p className="break-words text-sm font-black text-foreground">{option.label}</p>
                          <p className="break-words text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {option.group}
                          </p>
                        </div>
                        <span
                          className="h-3 w-3 shrink-0 rounded-full ring-4 ring-offset-2 ring-offset-background"
                          style={{ backgroundColor: option.accent, boxShadow: `0 0 0 1px ${option.accent}` }}
                        />
                      </div>

                      <div className="flex items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/70 bg-card px-3 py-4">
                        <LoadingScreen
                          theme={option.value}
                          label=""
                          className="!min-h-0 py-0"
                        />
                      </div>

                      <p className="mt-4 break-words text-sm text-muted-foreground">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default LoadingScreenPicker;
