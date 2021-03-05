import { NavItem } from './components/navigation/navigation.types';

export function findContent(id: string, haystack?: NavItem[]): NavItem | null {
    haystack = haystack || contents.pages;

    const match = haystack.find(x => x.id === id);
    if (match) {
        return match;
    }

    for(let item of haystack.filter(h => h.children)) {
        const childMatch = findContent(id, item.children);
        if (childMatch) {
            return childMatch;
        }
    }

    return null;
}

/***
 * To make the content searchable most content
 * is in this file
 */
export const contents = {

    pages: ([
        {
            title: 'Home',
            route: {path: ['/'], routerLinkOptions: {exact: true}}
        },
        {
            id: 'components',
            title: 'Components',
            route: '/components',
            children: [
                {
                    id: 'components/selector',
                    title: 'Selector Component',
                    route: '/components/selector',
                    children: [
                        {
                            title: 'Getting started',
                            route: '/components/selector/getting-started',
                            disabled: true
                        },
                        {
                            title: 'Options',
                            route: '/components/selector/inputs',
                            disabled: true
                        },
                        {
                            title: 'Events',
                            route: '/components/selector/events',
                            disabled: true
                        },
                        {
                            id: 'components/selector/examples',
                            title: 'Examples',
                            route: '/components/selector/examples',
                            children: [
                                {title: 'DataBind Array', route: '/components/selector/examples/databind-array'},
                                {title: 'DataBind', route: '/components/selector/examples/databind', disabled: true},
                                {title: 'Custom arrow', route: '/components/selector/examples/custom-arrow', disabled: true},
                                {title: 'Multi select', route: '/components/selector/examples/multiselect', disabled: true}
                            ]
                        }
                    ]
                },
                {
                    id: 'components/datepicker',
                    title: 'Datepicker Component',
                    route: '/components/datepicker',
                    disabled: true
                },
                {
                    id: 'components/validationtext',
                    title: 'Validationtext Component',
                    route: '/components/validationtext',
                    disabled: true
                },
                {
                    id: 'components/contextmenu',
                    title: 'Context Menu Component',
                    route: '/components/contextmenu',
                    disabled: true
                }
            ]
        }
    ]) as NavItem[]
};