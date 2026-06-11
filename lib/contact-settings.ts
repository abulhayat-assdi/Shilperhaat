export interface ContactSettings {
  whatsappUrl: string;
  phoneNumber: string;
  messengerUrl: string;
  emailAddress: string;
  widgetEnabled: boolean;
  welcomeMessage: string;
  buttonPosition: "bottom-right" | "bottom-left";
}

// Used as fallback until the admin saves real values (stored in the
// site_content DB table under the "contact-widget" key).
export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsappUrl: "https://wa.me/8801700000000",
  phoneNumber: "01700000000",
  messengerUrl: "https://m.me/shilperhaat",
  emailAddress: "info@shilperhaat.com",
  widgetEnabled: true,
  welcomeMessage: "আমাদের সাথে যোগাযোগ করুন",
  buttonPosition: "bottom-right",
};

export async function fetchContactSettings(): Promise<ContactSettings> {
  try {
    const res = await fetch("/api/site-content/contact-widget");
    const json = await res.json();
    if (json.value) {
      return { ...DEFAULT_CONTACT_SETTINGS, ...(json.value as Partial<ContactSettings>) };
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_CONTACT_SETTINGS;
}

export async function saveContactSettings(settings: ContactSettings): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/site-content/contact-widget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: settings }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
