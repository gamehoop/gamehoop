import {
  daysToSeconds,
  hoursToSeconds,
  minutesToSeconds,
  secondsToMilliseconds,
} from '@/utils/datetime';
import { describe, expect, test } from 'vitest';

describe('datetime utils', () => {
  describe('daysToSeconds', () => {
    test('converts days to seconds correctly', () => {
      expect(daysToSeconds(1)).toBe(86400);
      expect(daysToSeconds(0)).toBe(0);
      expect(daysToSeconds(2.5)).toBe(216000);
      expect(daysToSeconds(-1)).toBe(-86400);
    });
  });

  describe('hoursToSeconds', () => {
    test('converts hours to seconds correctly', () => {
      expect(hoursToSeconds(1)).toBe(3600);
      expect(hoursToSeconds(0)).toBe(0);
      expect(hoursToSeconds(2.5)).toBe(9000);
      expect(hoursToSeconds(-1)).toBe(-3600);
    });
  });

  describe('minutesToSeconds', () => {
    test('converts minutes to seconds correctly', () => {
      expect(minutesToSeconds(1)).toBe(60);
      expect(minutesToSeconds(0)).toBe(0);
      expect(minutesToSeconds(2.5)).toBe(150);
      expect(minutesToSeconds(-1)).toBe(-60);
    });
  });

  describe('secondsToMilliseconds', () => {
    test('converts seconds to milliseconds correctly', () => {
      expect(secondsToMilliseconds(1)).toBe(1000);
      expect(secondsToMilliseconds(0)).toBe(0);
      expect(secondsToMilliseconds(2.5)).toBe(2500);
      expect(secondsToMilliseconds(-1)).toBe(-1000);
    });
  });
});
