import { Component, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NavItem, NavItemRoute } from './navigation.types';

interface ExtendedNavItem extends NavItem {
    normalizedRoute: NavItemRoute;
}

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent {

    navigationItems?: ExtendedNavItem[];
    icons = {
      expanded: faChevronDown,
      collapsed: faChevronRight
    };

    @Input()
    set items(items: NavItem[]) {
        this.navigationItems = items?.map(item => {
            const normalizedItem = item as ExtendedNavItem;
            if (typeof item.route === 'string') {
                normalizedItem.normalizedRoute = { path: [item.route] }
            } else {
                normalizedItem.normalizedRoute = item.route;
            }
            if (!normalizedItem.normalizedRoute.routerLinkOptions) {
                normalizedItem.normalizedRoute.routerLinkOptions = {exact: false};
            }
            return normalizedItem;
        });
    }
    @Input() depth = 0;

}

