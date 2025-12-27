export function daysToSeconds(days: number): number {
  return days * 24 * 60 * 60;
}

export function hoursToSeconds(hours: number): number {
  return hours * 60 * 60;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}
