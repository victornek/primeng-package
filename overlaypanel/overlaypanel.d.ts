import { OnDestroy, EventEmitter, Renderer2, ElementRef, ChangeDetectorRef, NgZone, TemplateRef, AfterContentInit, QueryList } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
export declare class OverlayPanel implements AfterContentInit, OnDestroy {
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    private zone;
    dismissable: boolean;
    showCloseIcon: boolean;
    style: any;
    styleClass: string;
    appendTo: any;
    autoZIndex: boolean;
    ariaCloseLabel: string;
    baseZIndex: number;
    focusOnShow: boolean;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    templates: QueryList<any>;
    container: HTMLDivElement;
    overlayVisible: boolean;
    render: boolean;
    isContainerClicked: boolean;
    documentClickListener: any;
    target: any;
    willHide: boolean;
    scrollHandler: any;
    documentResizeListener: any;
    contentTemplate: TemplateRef<any>;
    destroyCallback: Function;
    constructor(el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, zone: NgZone);
    ngAfterContentInit(): void;
    onContainerClick(): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    toggle(event: any, target?: any): void;
    show(event: any, target?: any): void;
    hasTargetChanged(event: any, target: any): boolean;
    appendContainer(): void;
    restoreAppend(): void;
    align(): void;
    onAnimationStart(event: AnimationEvent): void;
    onAnimationEnd(event: AnimationEvent): void;
    focus(): void;
    hide(): void;
    onCloseClick(event: any): void;
    onWindowResize(event: any): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    onContainerDestroy(): void;
    ngOnDestroy(): void;
}
export declare class OverlayPanelModule {
}
