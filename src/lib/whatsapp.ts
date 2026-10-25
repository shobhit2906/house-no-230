export function cleanWhatsAppNumber(phone: string): string {
  // Strip non-digit characters
  const digits = phone.replace(/[^0-9]/g, '');
  // If starts with 0 and has 11 digits, strip 0 and prepend 91
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  // If 10 digits (typical Indian number), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function buildWhatsAppLink({
  phone = '+91 89898 88988',
  type = 'general',
  context,
}: {
  phone?: string;
  type?: 'general' | 'reservation' | 'event' | 'feedback_followup';
  context?: {
    reference?: string;
    customerName?: string;
    date?: string;
    time?: string;
    guests?: number;
    eventType?: string;
  };
}): string {
  const cleanPhone = cleanWhatsAppNumber(phone);

  let message = 'Hello House No. 230, I would like to connect with your team.';

  if (type === 'reservation') {
    if (context?.reference) {
      message = `Hello House No. 230, I am inquiring regarding table reservation reference ${context.reference} for ${context.date || 'upcoming date'} under the name of ${context.customerName || 'Guest'}.`;
    } else {
      message = 'Hello House No. 230, I would like to inquire about booking a table for dining.';
    }
  } else if (type === 'event') {
    if (context?.reference) {
      message = `Hello House No. 230 Events Desk, inquiring regarding event inquiry ${context.reference} (${context.eventType || 'Celebration'}) on ${context.date || 'preferred date'}.`;
    } else {
      message = 'Hello House No. 230, I would like to inquire about hosting a celebration / private dining event at your venue.';
    }
  } else if (type === 'feedback_followup') {
    message = `Hello ${context?.customerName || 'Guest'}, this is the management at House No. 230 following up on your recent dining experience.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
