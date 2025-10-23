import { useLang } from './state/useLang';
export const strings = {
  en: {
    signIn: 'Sign in',
    register: 'Register',
    bookService: 'Book a Service',
    myBookings: 'My Bookings',
    clientHome: 'Your space',
    Welcome: 'Welcome',
    'sign out': 'Sign out',
    'admin Dashboard': 'Admin Dashboard',
    Appointments: 'Appointments',
    Services: 'Services',
    Availability: 'Availability',
    Settings: 'Settings',
    'Sign Out': 'Sign out',
  },
  he: {
    signIn: 'התחברות',
    register: 'הרשמה',
    bookService: 'קבע תור',
    myBookings: 'התורים שלי',
    clientHome: 'אזור אישי',
    Welcome: 'ברוך הבא',
    'sign out': 'התנתק',
    'admin Dashboard': 'לוח בקרה למנהל',
    Appointments: 'תורים',
    Services: 'שירותים',
    Availability: 'זמינות',
    Settings: 'הגדרות',
    'Sign Out': 'התנתק',
  },
};
export type Lang = keyof typeof strings;
export let lang: Lang = 'en';
export const setLang = (l: Lang) => (lang = l);
export const t = (k: keyof typeof strings['en']) => {
  const { lang } = useLang.getState();
  return strings[lang][k];
};
