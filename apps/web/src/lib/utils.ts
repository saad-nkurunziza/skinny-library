import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const makeGmailLink = (subject: string, body: string) => {
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL!
  )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export function formatKeys(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
}
