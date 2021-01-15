import { NavigationExtras } from '@angular/router';

export interface NavItemRoute { 
    path: string[];
    extras?: NavigationExtras;
    routerLinkOptions?: { exact: boolean } 
}

export interface NavItem {
    id?: string;
    title: string;
    route: NavItemRoute | string;
    children?: NavItem[];
    disabled?: boolean;
} 
  