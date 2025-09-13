export const STEPS = [
  "AUTH",
  "FORM",
  "VIDEO",
  "GIFTS",
  "CONFIRM",
  "PLACE",
  "SUMMARY",
] as const;

export type Step = typeof STEPS[number];


