import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Source - https://stackoverflow.com/a
// Posted by Steve Harrison, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
