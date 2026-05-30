export interface ContactSettings {
  whatsappUrl: string;
  phoneNumber: string;
  messengerUrl: string;
  emailAddress: string;
  widgetEnabled: boolean;
  welcomeMessage: string;
  buttonPosition: "bottom-right" | "bottom-left";
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsappUrl: "https://wa.me/8801700000000",
  phoneNumber: "01700000000",
  messengerUrl: "https://m.me/shilperhaat",
  emailAddress: "info@shilperhaat.com",
  widgetEnabled: true,
  welcomeMessage: "আমাদের সাথে যোগাযোগ করুন",
  buttonPosition: "bottom-right",
};

const STORAGE_KEY = "shilperhaat_contact_settings_v1";

export function loadContactSettings(): ContactSettings {
  if (typeof window === "undefined") return DEFAULT_CONTACT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONTACT_SETTINGS, ...(JSON.parse(stored) as Partial<ContactSettings>) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONTACT_SETTINGS;
}

export function saveContactSettings(settings: ContactSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
