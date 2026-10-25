import { describe, it, expect } from 'vitest';
import {
  isValidReservationTransition,
  EventLeadSubmissionSchema,
  CustomerFeedbackSubmissionSchema,
  LoyaltyCustomerOptInSchema,
  LoyaltyTransactionSchema,
} from '@/lib/validations';
import { buildWhatsAppLink, cleanWhatsAppNumber } from '@/lib/whatsapp';

describe('Business Integration & Revenue Growth Extensions', () => {
  describe('Reservation State Machine Transitions', () => {
    it('allows valid transitions from PENDING', () => {
      expect(isValidReservationTransition('PENDING', 'CONFIRMED').valid).toBe(true);
      expect(isValidReservationTransition('PENDING', 'REJECTED').valid).toBe(true);
      expect(isValidReservationTransition('PENDING', 'CANCELLED').valid).toBe(true);
      expect(isValidReservationTransition('PENDING', 'PENDING').valid).toBe(true);
    });

    it('allows valid transitions from CONFIRMED', () => {
      expect(isValidReservationTransition('CONFIRMED', 'COMPLETED').valid).toBe(true);
      expect(isValidReservationTransition('CONFIRMED', 'CANCELLED').valid).toBe(true);
    });

    it('rejects invalid transitions from COMPLETED or REJECTED to CONFIRMED', () => {
      // Completed is terminal
      const completedTransition = isValidReservationTransition('COMPLETED', 'CONFIRMED');
      expect(completedTransition.valid).toBe(false);
      expect(completedTransition.reason).toBeDefined();

      // Rejected cannot jump directly to Confirmed
      const rejectedTransition = isValidReservationTransition('REJECTED', 'CONFIRMED');
      expect(rejectedTransition.valid).toBe(false);
    });
  });

  describe('Celebration & Event Lead Schema', () => {
    it('validates a correct celebration inquiry payload', () => {
      const validEvent = {
        customerName: 'Pooja Verma',
        phone: '9131245032',
        email: 'pooja@example.com',
        eventType: 'BIRTHDAY',
        eventDate: '2030-10-15',
        guestCount: 25,
        estimatedBudget: '₹40,000 – ₹50,000',
        decorRequirements: 'Subtle candlelight floral decor',
        notes: 'Needs cake cutting corner',
        consent: true,
      };

      const result = EventLeadSubmissionSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
    });

    it('rejects event submission if guest count is under minimum or consent is false', () => {
      const invalidEvent = {
        customerName: 'Pooja',
        phone: '9131245032',
        eventType: 'BIRTHDAY',
        eventDate: '2030-10-15',
        guestCount: 2, // Less than minimum 5
        consent: false,
      };

      const result = EventLeadSubmissionSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
    });
  });

  describe('Customer Feedback Schema', () => {
    it('validates customer feedback rating within 1 to 5', () => {
      const valid = CustomerFeedbackSubmissionSchema.safeParse({
        rating: 5,
        category: 'FOOD',
        comments: 'The truffle paneer kulcha was sensational!',
        customerName: 'Rahul Mehta',
        customerPhone: '9876543210',
        contactConsent: true,
      });
      expect(valid.success).toBe(true);
    });

    it('rejects feedback with out-of-range rating', () => {
      const invalid = CustomerFeedbackSubmissionSchema.safeParse({
        rating: 6, // max is 5
        category: 'SERVICE',
        comments: 'Great service overall.',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('Loyalty Program & Ledger Schema', () => {
    it('validates customer opt-in payload', () => {
      const valid = LoyaltyCustomerOptInSchema.safeParse({
        name: 'Kabir Singhania',
        phone: '+91 89898 88988',
        email: 'kabir@example.com',
      });
      expect(valid.success).toBe(true);
    });

    it('validates staff loyalty transaction entry', () => {
      const valid = LoyaltyTransactionSchema.safeParse({
        customerId: 'cm-patron-1',
        points: 50,
        actionType: 'VISIT_STAMP',
        description: 'Dinner visit stamp',
      });
      expect(valid.success).toBe(true);
    });

    it('rejects zero points transaction', () => {
      const invalid = LoyaltyTransactionSchema.safeParse({
        customerId: 'cm-patron-1',
        points: 0,
        actionType: 'MANUAL_ADJUSTMENT',
        description: 'Zero test',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('WhatsApp Link & Phone Utilities', () => {
    it('normalizes Indian phone numbers correctly', () => {
      expect(cleanWhatsAppNumber('+91 89898 88988')).toBe('918989888988');
      expect(cleanWhatsAppNumber('08989888988')).toBe('918989888988');
      expect(cleanWhatsAppNumber('8989888988')).toBe('918989888988');
    });

    it('properly encodes WhatsApp URL parameters', () => {
      const link = buildWhatsAppLink({
        phone: '+91 89898 88988',
        type: 'reservation',
        context: {
          reference: 'RES230-SAMPLE',
          customerName: 'Deepak Sharma',
          date: '2030-05-20',
        },
      });

      expect(link.startsWith('https://wa.me/918989888988?text=')).toBe(true);
      expect(link).toContain('RES230-SAMPLE');
      expect(link).not.toContain(' '); // Query string must be percent-encoded
    });
  });
});
