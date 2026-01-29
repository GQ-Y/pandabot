export type Language = 'zh' | 'en';

export interface TranslationDict {
  [key: string]: string | TranslationDict;
}
