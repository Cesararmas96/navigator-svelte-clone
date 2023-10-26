
import { themeMode } from '$lib/stores/preferences'
import { get } from 'svelte/store';

export const isUrl = (url: string): boolean => {
  const patternUrl =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

  return patternUrl.test(url)
}

export const isDarkMode = (): boolean => {
  return get(themeMode) === 'dark'
}

export const capitalizeWord = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const generateUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export const deepClone = (obj: any) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

export const generateUniqueSlug = (str: string, widgets: any[]): string => {
  let baseSlug = str
      .trim()  
      .toLowerCase()  
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, '');

  let uniqueSlug = baseSlug;
  let suffix = 1;

  while (widgets.some(e => e.widget_slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${suffix}`;
      suffix++;
  }

  return uniqueSlug;
}