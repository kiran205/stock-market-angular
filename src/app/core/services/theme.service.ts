import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'stock-analytics-pro.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly theme = signal<AppTheme>('dark');

  readonly currentTheme = computed(() => this.theme());
  readonly isDark = computed(() => this.theme() === 'dark');

  initialize(): void {
    const persistedTheme = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    this.setTheme(persistedTheme === 'light' ? 'light' : 'dark');
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.document.documentElement.dataset['theme'] = theme;
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0B1220' : '#F8FAFC'
    );
  }
}
