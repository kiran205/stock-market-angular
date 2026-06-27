export interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
}

export interface NavSection {
  readonly label: string;
  readonly icon: string;
  readonly items: readonly NavItem[];
}
