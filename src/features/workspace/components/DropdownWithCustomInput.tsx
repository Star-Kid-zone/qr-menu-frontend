"use client";
import { Input, Select } from "@/components/ui";
import { CUSTOM_OPTION_VALUE } from "@/constants/workspace.constants";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownWithCustomInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly DropdownOption[];
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  selectClassName?: string;
  inputClassName?: string;
}

/**
 * A <Select> of curated presets with a trailing "Custom…" option that reveals
 * a free-text <Input> for values that don't match any preset.
 */
export function DropdownWithCustomInput({
  id,
  value,
  onChange,
  options,
  disabled,
  placeholder,
  invalid,
  selectClassName,
  inputClassName,
}: DropdownWithCustomInputProps) {
  const matchesPreset = options.some(
    (opt) => opt.value !== CUSTOM_OPTION_VALUE && opt.value === value,
  );
  const isCustom = !matchesPreset;
  const selectValue = isCustom ? CUSTOM_OPTION_VALUE : value;

  return (
    <div className="space-y-2">
      <Select
        id={id}
        disabled={disabled}
        invalid={invalid}
        className={selectClassName}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          onChange(next === CUSTOM_OPTION_VALUE ? "" : next);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      {isCustom && (
        <Input
          id={id ? `${id}-custom` : undefined}
          aria-label={id ? `${id} custom value` : "Custom value"}
          disabled={disabled}
          invalid={invalid}
          placeholder={placeholder}
          className={inputClassName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
