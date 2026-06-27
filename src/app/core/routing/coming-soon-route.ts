import { Routes } from '@angular/router';

export function comingSoonRoute(path: string, title: string, description: string, icon: string): Routes[number] {
  return {
    path,
    loadComponent: () => import('@features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPageComponent),
    title: `${title} | Stock Analytics Pro`,
    data: { title, description, icon }
  };
}
