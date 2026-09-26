/** Strips spaces and dashes so a display number can be used in a tel:/sms: href. */
export const dialable = (phone: string) => phone.replace(/[^\d+]/g, '');
