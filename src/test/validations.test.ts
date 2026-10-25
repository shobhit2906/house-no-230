import { describe, it, expect } from 'vitest';
import {
  indianPhoneRegex,
  isPastDateKolkata,
  ReservationSubmissionSchema,
  MenuItemSchema,
} from '@/lib/validations';

describe('Validation Logic', () => {
  describe('Indian Mobile Phone Regex', () => {
    it('accepts valid 10-digit Indian numbers starting with 6, 7, 8, 9', () => {
      expect(indianPhoneRegex.test('9876543210')).toBe(true);
      expect(indianPhoneRegex.test('8123456789')).toBe(true);
      expect(indianPhoneRegex.test('7000000000')).toBe(true);
      expect(indianPhoneRegex.test('6999999999')).toBe(true);
    });

    it('accepts valid numbers with +91 or 0 prefix', () => {
      expect(indianPhoneRegex.test('+919876543210')).toBe(true);
      expect(indianPhoneRegex.test('+91 9876543210')).toBe(true);
      expect(indianPhoneRegex.test('09876543210')).toBe(true);
    });

    it('rejects numbers starting with invalid digits or wrong lengths', () => {
      expect(indianPhoneRegex.test('1234567890')).toBe(false);
      expect(indianPhoneRegex.test('5555555555')).toBe(false);
      expect(indianPhoneRegex.test('98765')).toBe(false);
      expect(indianPhoneRegex.test('987654321000')).toBe(false);
      expect(indianPhoneRegex.test('abcdefghij')).toBe(false);
    });
  });

  describe('Date Validation (Asia/Kolkata)', () => {
    it('rejects past dates', () => {
      expect(isPastDateKolkata('2020-01-01')).toBe(true);
      expect(isPastDateKolkata('2022-12-31')).toBe(true);
    });

    it('accepts future dates', () => {
      expect(isPastDateKolkata('2030-01-01')).toBe(false);
    });
  });

  describe('ReservationSubmissionSchema', () => {
    it('validates a valid reservation request', () => {
      const validPayload = {
        customerName: 'Ananya Roy',
        phone: '9876543210',
        email: 'ananya@example.com',
        reservationDate: '2030-06-15',
        reservationTime: '19:30',
        guestCount: 4,
        specialRequest: 'Window table preferred',
        consent: true,
      };

      const result = ReservationSubmissionSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('rejects reservation if consent is false', () => {
      const payload = {
        customerName: 'Ananya Roy',
        phone: '9876543210',
        reservationDate: '2030-06-15',
        reservationTime: '19:30',
        guestCount: 4,
        consent: false,
      };

      const result = ReservationSubmissionSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects guest counts over 30 or less than 1', () => {
      const payloadUnder = {
        customerName: 'Ananya Roy',
        phone: '9876543210',
        reservationDate: '2030-06-15',
        reservationTime: '19:30',
        guestCount: 0,
        consent: true,
      };
      expect(ReservationSubmissionSchema.safeParse(payloadUnder).success).toBe(false);

      const payloadOver = {
        customerName: 'Ananya Roy',
        phone: '9876543210',
        reservationDate: '2030-06-15',
        reservationTime: '19:30',
        guestCount: 35,
        consent: true,
      };
      expect(ReservationSubmissionSchema.safeParse(payloadOver).success).toBe(false);
    });
  });

  describe('MenuItemSchema', () => {
    it('allows optional price (null or undefined)', () => {
      const itemWithNullPrice = {
        categoryId: 'cat-123',
        name: 'Crispy Corn',
        price: null,
        isAvailable: true,
        isFeatured: true,
        dietaryType: 'VEGETARIAN',
      };
      expect(MenuItemSchema.safeParse(itemWithNullPrice).success).toBe(true);
    });

    it('allows valid positive price', () => {
      const itemWithPrice = {
        categoryId: 'cat-123',
        name: 'Paneer Tikka',
        price: 340,
        isAvailable: true,
        isFeatured: true,
        dietaryType: 'VEGETARIAN',
      };
      expect(MenuItemSchema.safeParse(itemWithPrice).success).toBe(true);
    });

    it('rejects negative prices', () => {
      const itemWithNegative = {
        categoryId: 'cat-123',
        name: 'Paneer Tikka',
        price: -50,
      };
      expect(MenuItemSchema.safeParse(itemWithNegative).success).toBe(false);
    });
  });
});
