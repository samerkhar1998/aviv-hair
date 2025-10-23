import { create } from 'zustand';
import { Lang } from '../i18n';

type LangStore = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export const useLang = create<LangStore>((set) => ({
  lang: 'en',
  setLang: (l) => set({ lang: l }),
}));