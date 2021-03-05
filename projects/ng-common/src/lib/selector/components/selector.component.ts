import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, EmbeddedViewRef, EventEmitter, forwardRef, Input, OnDestroy, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, ɵConsole } from '@angular/core';
import { SelectorService } from '@dlid/ng-common/src/lib/selector/services/selector.service';
import { DataSource } from '@dlid/ng-common/src/lib/datasource';
import { fromEvent, of, Subscription } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectorData {
    totalCount?: number;
    items?: SelectorOption[];
}

interface InternalSelectorOption {
    isActive?: boolean;
    option: SelectorOption;
}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dlid-selector',
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DlidSelectorComponent),
        multi: true,
    }]
})
export class DlidSelectorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    source?: DataSource<SelectorData>;
    dataSourceSubscription?: Subscription;
    hasArrowContent = true;
    view?: EmbeddedViewRef<any>;
    minPopupWidth?: number;
    items?: InternalSelectorOption[];
    filterTimer: any;
    selectedItems: SelectorOption[] = [];
    query = '';

    // Subscriptions for events to close popup
    private subClickEvent?: Subscription;
    private subResizeEvent?: Subscription;
    private subScrollEvent?: Subscription;
    private subKeydown?: Subscription;

    decreaseFromPopupArea?: number;
    @ViewChild('popupTemplate', {static: true}) popupTemplate?: TemplateRef<any>;
    @ViewChild('button') button?: ElementRef;
    @ViewChild('theWrapper') arrowContent!: ElementRef;
    @Output() changed = new EventEmitter<SelectorOption | SelectorOption[]>();
    @Input() minWidth = 100;
    @Input() clearable = true;
    @Input() searchDelay?: number;
    @Input() placeholder?: string;
    @Input() blockClassName = '';
    @Input() displayBlock = false;
    @Input()
    set dataSource(dataSource: DataSource<SelectorData> | SelectorOption[] | undefined)  {
        this.source?.destroy();

        this.dataSourceSubscription?.unsubscribe();
        if (dataSource) {
            if (Array.isArray(dataSource)) {
                if (typeof this.searchDelay === 'undefined') {
                    this.searchDelay = 10;
                }
                this.bindArray(dataSource);
            } else {
                if (typeof this.searchDelay === 'undefined') {
                    this.searchDelay = 800;
                }
                this.source = dataSource;
            }
            this.dataSourceSubscription = this.source?.data$.subscribe(i => this.onDataUpdate(i),
            e => this.onDataError(e))
        } else {
            this.source = undefined;
        }
        console.log(this.source);
    }

    onChange = (_: any) => {};
    onTouched = () => {};

    private triggerChange(): void {
        this.onChange(this.selectedItems.length === 0 ? undefined : this.selectedItems[0]);
    }

    clearValue(e: Event): void {
      console.warn("CLEAR");
      e.preventDefault();
      e.stopPropagation();
      this.selectedItems = [];
      this.triggerChange();
    }

    writeValue(newValue: any): void {
        let triggerChange = false;
        if (newValue === null) {
            newValue = undefined;
        }

        if (newValue) {
            if (!newValue.value) {
                 newValue = {
                     value: newValue,
                     text: newValue
                 };
                 triggerChange = true;
            }
            if (newValue.value && !newValue.text) {
                newValue.text = newValue.value;
                triggerChange = true;
            }
            if (newValue.value) {
                this.selectedItems.splice(0, this.selectedItems.length);
                this.selectedItems.push(newValue);
                if (triggerChange) {
                    this.triggerChange();
                }
            }
        } else {
            this.selectedItems = [];
        }

        console.log("writeValue", newValue);
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // this.isDisabled = isDisabled;
    }

    private onDataUpdate(response: SelectorData): void {
        this.items = response.items?.map<InternalSelectorOption>(x => {
            return {
                isActive: !!this.selectedItems?.find(s => s.value === x.value),
                option: x
            };
        });
    }

    onItemHover(item: InternalSelectorOption, e: Event): void {
        this.items?.filter(x => x.isActive).forEach(x => x.isActive = false);
        item.isActive = true;
    }

    trackByValue(ix: number, option: InternalSelectorOption): any {
        return option.option.value;
    }

    onSelectItem(item: SelectorOption, e: Event): void {
        if (e.defaultPrevented) {
            console.log("DEFAULT IS PREVENTED");
            return;
        }
        this.selectedItems.pop();
        this.selectedItems.push(item);
        this.close(e);
        this.triggerChange();
    }

    onFilterKeyboardEvent(e: Event): void {

        if (this.justOpened) {
            this.justOpened = false;
            return;
        }
        const value = (e.target as HTMLInputElement).value;
        if (e instanceof KeyboardEvent) {
            if (e.key === 'Enter') {
                const active = this.items?.find(c => c.isActive);
                if (active) {
                    this.onSelectItem(active.option, e);
                }
                return;
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                return;
            } else if (e.key === 'Escape') {
                if (!value && !this.query) {
                    this.close(e);
                    return;
                }
            }
        }
        this.query = value;
        this.onSearch(e);
    }

    onSearch(e: Event) {
        clearTimeout(this.filterTimer);
        this.filterTimer = setTimeout(() => {
            this.source?.refresh({
                query: (e.target as HTMLInputElement).value,
                params: {}
            });
        }, this.searchDelay);
    }

    private onDataError(e: any): void {

    }

    constructor(private selectorService: SelectorService, private cdr: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef, private elm: ElementRef) {
        this.blockClassName = selectorService.defaults.blockClassName;
    }

    /**
     * Let the user set SelectorOption[] and we bind it as a data source here
     */
    private bindArray(options: SelectorOption[]): void {
        // If an array is provided we bind it
        this.source = this.selectorService.bind(request => {
            if (request.query) {
                const query = request.query.toLowerCase();
                return of ({
                    items: options.filter(opt => opt?.text?.toLowerCase().includes(query))
                });
            }
            return of({
                items: options
            });
        });
    }

    private escapeRegex(string: string): string {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    ngAfterViewInit() {
        this.hasArrowContent = this.arrowContent?.nativeElement?.childNodes?.length > 0;
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.source?.destroy();
    }

    stopEvent(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
    }

    writeEvent(e: Event, s: string, prevent: boolean = false): void {
        console.log("Event", s, e.type, e.target, e, e.defaultPrevented ? 'defaultPrevented' : 'notPrevented');
        if (prevent) {
            e.preventDefault();
        }
    }

    onSelectorKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {

        }
    }

    open(e: Event): void {

      console.log("src", e.srcElement);
      console.log("currentTarget", e.currentTarget);
      console.log("target", e.target);
      console.log("wine", window.event);

        if ((e.target as HTMLElement).classList.contains(`${this.blockClassName}__clear`)) {
          return;
        }



        e.stopPropagation();
        e.stopImmediatePropagation();


        let query = '';

        if (e instanceof KeyboardEvent) {
            switch (e.key) {
                case 'Tab':
                    return;
                case 'Delete':
                  if ( this.clearable) {
                    this.clearValue(e);
                  }
                  return;
            }
            if (e.key.length === 1 && e.key !== ' ') {
                query = e.key;
            }
        }

        this.subKeydown = fromEvent<KeyboardEvent>(window, 'keydown').subscribe(e => {
            const ix = this.items?.findIndex(f => f.isActive);
            if (e.key === 'ArrowDown') {
                if (this.items && typeof ix !== 'undefined') {
                    if (ix !== -1) {
                        this.items[ix].isActive = false;
                    }
                    if (ix < this.items.length - 1) {
                        this.items[ix + 1].isActive = true;
                    } else {
                        this.items[0].isActive = true;
                    }
                }
            } else if (e.key === 'ArrowUp') {
                if (this.items && typeof ix !== 'undefined') {
                    if (ix !== -1) {
                        this.items[ix].isActive = false;
                    }
                    if (ix > 0) {
                        this.items[ix - 1].isActive = true;
                    } else {
                        this.items[this.items.length - 1].isActive = true;
                    }
                }
            }

        });

        this.query = query;

        const bodyElement = document.querySelector('body');

        if (this.popupTemplate && bodyElement) {


            this.view = this.viewContainerRef.createEmbeddedView(this.popupTemplate);
            this.view.rootNodes.forEach(rootNode => bodyElement.appendChild(rootNode));

            this.source?.refresh({query: this.query, params: {}});

        // Hide menu when clicking outside
        setTimeout( () => {
                this.subClickEvent = fromEvent<MouseEvent>(document, 'click')
                .pipe(
                filter((event: Event) => {
                    const clickTarget = event.target as HTMLElement;
                    console.log("target", clickTarget, this.isElementInView(clickTarget));
                    return !this.isElementInView(clickTarget);
                }),
                take(1)
                ).subscribe(ea => this.close(ea));
            }, 50);

        // Hide menu when resizing window
        setTimeout( () => {
            this.subResizeEvent = fromEvent<Event>(window, 'resize')
            .pipe(
            take(1)
            ).subscribe(ea => this.close(ea));
            }, 50);

        // Hide menu when scrolling in window
        setTimeout( () => {
            this.subScrollEvent = fromEvent<Event>(window, 'scroll')
            .pipe(
            take(1)
            ).subscribe(ea => this.close(ea));
            }, 50);

            let pos = (this.button?.nativeElement as HTMLElement).getBoundingClientRect();
            this.view.rootNodes[0].style.position = 'absolute';
            this.view.rootNodes[0].style.left = pos.left + 'px';
            this.view.rootNodes[0].style.top = window.pageYOffset  + (pos.top + pos.height - 1) + 'px';
            pos = (this.button?.nativeElement as HTMLElement).getBoundingClientRect();
            this.minPopupWidth = pos.width;

            const finalPosition = (this.view.rootNodes[0] as HTMLElement).getBoundingClientRect();
            const maxHeight = Math.floor(window.innerHeight - finalPosition.top);
            this.view.rootNodes[0].style.maxHeight = `${maxHeight - 20}px`;

            setTimeout( () => {
                this.justOpened = true;
                this.view?.rootNodes[0].querySelector('[type=search]').focus();
                const filterContainer = this.view?.rootNodes[0].querySelector(`.${this.blockClassName}__filter`);
                if (filterContainer) {
                    this.decreaseFromPopupArea = filterContainer.getBoundingClientRect().height;
                }
            })


        }
    }

    justOpened = false;

    close(e: Event): void {
        console.log("CLoSE!");
        this.view?.destroy();
        this.subClickEvent?.unsubscribe();
        this.subResizeEvent?.unsubscribe();
        this.subScrollEvent?.unsubscribe();
        this.subKeydown?.unsubscribe();
        (this.button?.nativeElement as HTMLButtonElement).focus();
    }

    private isElementInView(elm: Element): boolean {
        let current: Element | null = elm;
        do {
            if (this.view?.rootNodes.includes(current)) {
                return true;
            }
            current = current.parentElement;
        } while(current);
        return false;
    }

}

export class SelectorOption {
    text?: string;
    html?: string;
    data?: { [key: string]: any};
    value: any;
}
