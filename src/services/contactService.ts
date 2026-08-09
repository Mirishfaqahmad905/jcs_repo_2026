import { ContactInfo } from '../types';

const API_BASE = '/api';

/**
 * Fetch public contact info from Express backend JSON store
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/contact`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('[ContactService] Error fetching contact info:', err);
    return null;
  }
}

/**
 * Helper to check if WhatsApp is enabled and valid
 */
export function isWhatsAppEnabled(contact: ContactInfo | null): boolean {
  if (!contact) return false;
  const wa = contact.whatsapp;
  if (!wa) return false;
  return wa.enabled !== false && Boolean(wa.number);
}

/**
 * Helper to check if Email is enabled and valid
 */
export function isEmailEnabled(contact: ContactInfo | null): boolean {
  if (!contact) return false;
  const em = contact.email;
  if (!em) return false;
  return em.enabled !== false && Boolean(em.address);
}

/**
 * Helper to check if Phone is enabled and valid
 */
export function isPhoneEnabled(contact: ContactInfo | null): boolean {
  if (!contact) return false;
  const ph = contact.phone;
  if (!ph) return false;
  return ph.enabled !== false && Boolean(ph.number);
}
