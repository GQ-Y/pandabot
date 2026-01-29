import type { Language, TranslationDict } from './types.js';
import { zh } from './zh.js';
import { en } from './en.js';

let currentLang: Language = 'zh'; // 默认中文

function resolvePath(dict: TranslationDict, key: string): string {
  const parts = key.split('.');
  let current: string | TranslationDict = dict;
  
  for (const part of parts) {
    if (typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return key; // 返回 key 作为后备
    }
  }
  
  return typeof current === 'string' ? current : key;
}

export function t(key: string): string {
  const dict = currentLang === 'zh' ? zh : en;
  return resolvePath(dict, key);
}

export function setLanguage(lang: Language): void {
  currentLang = lang;
  try {
    localStorage.setItem('panda-ui-lang', lang);
  } catch {
    // ignore localStorage errors
  }
}

export function getLanguage(): Language {
  try {
    const saved = localStorage.getItem('panda-ui-lang');
    if (saved === 'zh' || saved === 'en') {
      return saved;
    }
  } catch {
    // ignore localStorage errors
  }
  return 'zh'; // 默认中文
}

// 初始化语言
currentLang = getLanguage();
