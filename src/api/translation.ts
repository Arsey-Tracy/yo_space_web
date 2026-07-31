export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Swahili (Kiswahili)', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'lg', name: 'Luganda', nativeName: 'Oluganda', flag: '🇺🇬' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu (isiZulu)', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa (isiXhosa)', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇦🇴' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇪🇬' },
];

/**
 * Translates text into target African or global language using MyMemory Translation API.
 * Free tier endpoint, no API key required for low-to-medium volume.
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<{ translatedText: string; success: boolean; source: string }> {
  if (!text || !text.trim()) {
    return { translatedText: '', success: true, source: 'cache' };
  }

  if (targetLang === sourceLang) {
    return { translatedText: text, success: true, source: 'identity' };
  }

  try {
    const langPair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translation HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return {
        translatedText: data.responseData.translatedText,
        success: true,
        source: 'mymemory_api',
      };
    }

    return { translatedText: text, success: false, source: 'fallback' };
  } catch (error) {
    console.warn('Translation API error, falling back to original text:', error);
    return { translatedText: text, success: false, source: 'error_fallback' };
  }
}

/**
 * Formats outgoing broadcast messages to include the Organization Name prefix
 * if custom Sender ID is not configured (v1 behavior).
 */
export function formatOrgBroadcast(
  message: string,
  orgName: string,
  senderId?: string | null
): string {
  const trimmed = (message || '').trim();
  if (!trimmed) return '';
  if (senderId && senderId.trim().length > 0) {
    return trimmed;
  }
  const prefix = `[${orgName || 'Organization'}]`;
  if (trimmed.startsWith(prefix)) {
    return trimmed;
  }
  return `${prefix}: ${trimmed}`;
}
