import { twMerge } from "tailwind-merge";

type ClassValue = string | number | null | boolean | undefined | ClassValue[];

function flattenClasses(inputs: ClassValue[]): string[] {
  const result: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      result.push(...flattenClasses(input));
    } else {
      result.push(String(input));
    }
  }
  return result;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(flattenClasses(inputs).join(" "));
}
