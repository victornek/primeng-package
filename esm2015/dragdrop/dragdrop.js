import { NgModule, Directive, ElementRef, HostListener, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
export class Draggable {
    constructor(el, zone) {
        this.el = el;
        this.zone = zone;
        this.onDragStart = new EventEmitter();
        this.onDragEnd = new EventEmitter();
        this.onDrag = new EventEmitter();
    }
    get pDraggableDisabled() {
        return this._pDraggableDisabled;
    }
    set pDraggableDisabled(_pDraggableDisabled) {
        this._pDraggableDisabled = _pDraggableDisabled;
        if (this._pDraggableDisabled) {
            this.unbindMouseListeners();
        }
        else {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }
    ngAfterViewInit() {
        if (!this.pDraggableDisabled) {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }
    bindDragListener() {
        if (!this.dragListener) {
            this.zone.runOutsideAngular(() => {
                this.dragListener = this.drag.bind(this);
                this.el.nativeElement.addEventListener('drag', this.dragListener);
            });
        }
    }
    unbindDragListener() {
        if (this.dragListener) {
            this.zone.runOutsideAngular(() => {
                this.el.nativeElement.removeEventListener('drag', this.dragListener);
                this.dragListener = null;
            });
        }
    }
    bindMouseListeners() {
        if (!this.mouseDownListener && !this.mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.mousedown.bind(this);
                this.mouseUpListener = this.mouseup.bind(this);
                this.el.nativeElement.addEventListener('mousedown', this.mouseDownListener);
                this.el.nativeElement.addEventListener('mouseup', this.mouseUpListener);
            });
        }
    }
    unbindMouseListeners() {
        if (this.mouseDownListener && this.mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                this.el.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
                this.el.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
                this.mouseDownListener = null;
                this.mouseUpListener = null;
            });
        }
    }
    drag(event) {
        this.onDrag.emit(event);
    }
    dragStart(event) {
        if (this.allowDrag() && !this.pDraggableDisabled) {
            if (this.dragEffect) {
                event.dataTransfer.effectAllowed = this.dragEffect;
            }
            event.dataTransfer.setData('text', this.scope);
            this.onDragStart.emit(event);
            this.bindDragListener();
        }
        else {
            event.preventDefault();
        }
    }
    dragEnd(event) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    }
    mousedown(event) {
        this.handle = event.target;
    }
    mouseup(event) {
        this.handle = null;
    }
    allowDrag() {
        if (this.dragHandle && this.handle)
            return DomHandler.matches(this.handle, this.dragHandle);
        else
            return true;
    }
    ngOnDestroy() {
        this.unbindDragListener();
        this.unbindMouseListeners();
    }
}
Draggable.decorators = [
    { type: Directive, args: [{
                selector: '[pDraggable]'
            },] }
];
Draggable.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
Draggable.propDecorators = {
    scope: [{ type: Input, args: ['pDraggable',] }],
    dragEffect: [{ type: Input }],
    dragHandle: [{ type: Input }],
    onDragStart: [{ type: Output }],
    onDragEnd: [{ type: Output }],
    onDrag: [{ type: Output }],
    pDraggableDisabled: [{ type: Input }],
    dragStart: [{ type: HostListener, args: ['dragstart', ['$event'],] }],
    dragEnd: [{ type: HostListener, args: ['dragend', ['$event'],] }]
};
export class Droppable {
    constructor(el, zone) {
        this.el = el;
        this.zone = zone;
        this.onDragEnter = new EventEmitter();
        this.onDragLeave = new EventEmitter();
        this.onDrop = new EventEmitter();
    }
    ngAfterViewInit() {
        if (!this.pDroppableDisabled) {
            this.bindDragOverListener();
        }
    }
    bindDragOverListener() {
        if (!this.dragOverListener) {
            this.zone.runOutsideAngular(() => {
                this.dragOverListener = this.dragOver.bind(this);
                this.el.nativeElement.addEventListener('dragover', this.dragOverListener);
            });
        }
    }
    unbindDragOverListener() {
        if (this.dragOverListener) {
            this.zone.runOutsideAngular(() => {
                this.el.nativeElement.removeEventListener('dragover', this.dragOverListener);
                this.dragOverListener = null;
            });
        }
    }
    dragOver(event) {
        event.preventDefault();
    }
    drop(event) {
        if (this.allowDrop(event)) {
            DomHandler.removeClass(this.el.nativeElement, 'p-draggable-enter');
            event.preventDefault();
            this.onDrop.emit(event);
        }
    }
    dragEnter(event) {
        event.preventDefault();
        if (this.dropEffect) {
            event.dataTransfer.dropEffect = this.dropEffect;
        }
        DomHandler.addClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragEnter.emit(event);
    }
    dragLeave(event) {
        event.preventDefault();
        DomHandler.removeClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragLeave.emit(event);
    }
    allowDrop(event) {
        let dragScope = event.dataTransfer.getData('text');
        if (typeof (this.scope) == "string" && dragScope == this.scope) {
            return true;
        }
        else if (this.scope instanceof Array) {
            for (let j = 0; j < this.scope.length; j++) {
                if (dragScope == this.scope[j]) {
                    return true;
                }
            }
        }
        return false;
    }
    ngOnDestroy() {
        this.unbindDragOverListener();
    }
}
Droppable.decorators = [
    { type: Directive, args: [{
                selector: '[pDroppable]'
            },] }
];
Droppable.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
Droppable.propDecorators = {
    scope: [{ type: Input, args: ['pDroppable',] }],
    pDroppableDisabled: [{ type: Input }],
    dropEffect: [{ type: Input }],
    onDragEnter: [{ type: Output }],
    onDragLeave: [{ type: Output }],
    onDrop: [{ type: Output }],
    drop: [{ type: HostListener, args: ['drop', ['$event'],] }],
    dragEnter: [{ type: HostListener, args: ['dragenter', ['$event'],] }],
    dragLeave: [{ type: HostListener, args: ['dragleave', ['$event'],] }]
};
export class DragDropModule {
}
DragDropModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [Draggable, Droppable],
                declarations: [Draggable, Droppable]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2Ryb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZHJhZ2Ryb3AvZHJhZ2Ryb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQXlCLFVBQVUsRUFBQyxZQUFZLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xJLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBS3ZDLE1BQU0sT0FBTyxTQUFTO0lBd0JsQixZQUFtQixFQUFjLEVBQVMsSUFBWTtRQUFuQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQWhCNUMsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwRCxjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbEQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBWUEsQ0FBQztJQUUxRCxJQUFhLGtCQUFrQjtRQUMzQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsSUFBSSxrQkFBa0IsQ0FBQyxtQkFBMkI7UUFDOUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBRS9DLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzFCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQy9CO2FBQ0k7WUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUVELGVBQWU7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFD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QUFRLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDNUQsT0FBTyxJQUFJLENBQUM7U0FDZjthQUNJLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxLQUFLLEVBQUU7WUFDbEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM1QixPQUFPLElBQUksQ0FBQztpQkFDZjthQUNKO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2xDLENBQUM7OztZQS9GSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGNBQWM7YUFDM0I7OztZQWxKa0QsVUFBVTtZQUF3QyxNQUFNOzs7b0JBcUp0RyxLQUFLLFNBQUMsWUFBWTtpQ0FFbEIsS0FBSzt5QkFFTCxLQUFLOzBCQUVMLE1BQU07MEJBRU4sTUFBTTtxQkFFTixNQUFNO21CQWtDTixZQUFZLFNBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQVMvQixZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQVlwQyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDOztBQWlDekMsTUFBTSxPQUFPLGNBQWM7OztZQUwxQixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDO2dCQUM5QixZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDO2FBQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxEaXJlY3RpdmUsT25EZXN0cm95LEFmdGVyVmlld0luaXQsRWxlbWVudFJlZixIb3N0TGlzdGVuZXIsSW5wdXQsT3V0cHV0LEV2ZW50RW1pdHRlcixOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3BEcmFnZ2FibGVdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICAgIFxyXG4gICAgQElucHV0KCdwRHJhZ2dhYmxlJykgc2NvcGU6IHN0cmluZztcclxuICAgICAgICBcclxuICAgIEBJbnB1dCgpIGRyYWdFZmZlY3Q6IHN0cmluZztcclxuICAgIFxyXG4gICAgQElucHV0KCkgZHJhZ0hhbmRsZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBAT3V0cHV0KCkgb25EcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgXHJcbiAgICBAT3V0cHV0KCkgb25EcmFnRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIFxyXG4gICAgQE91dHB1dCgpIG9uRHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBcclxuICAgIGhhbmRsZTogYW55O1xyXG5cclxuICAgIGRyYWdMaXN0ZW5lcjogYW55O1xyXG5cclxuICAgIG1vdXNlRG93bkxpc3RlbmVyOiBhbnk7XHJcblxyXG4gICAgbW91c2VVcExpc3RlbmVyOiBhbnk7XHJcblxyXG4gICAgX3BEcmFnZ2FibGVEaXNhYmxlZDogYm9vbGVhbjtcclxuICAgICAgICBcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSkge31cclxuXHJcbiAgICBASW5wdXQoKSBnZXQgcERyYWdnYWJsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wRHJhZ2dhYmxlRGlzYWJsZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQgcERyYWdnYWJsZURpc2FibGVkKF9wRHJhZ2dhYmxlRGlzYWJsZWQ6Ym9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3BEcmFnZ2FibGVEaXNhYmxlZCA9IF9wRHJhZ2dhYmxlRGlzYWJsZWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX3BEcmFnZ2FibGVEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVuYmluZE1vdXNlTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5iaW5kTW91c2VMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMucERyYWdnYWJsZURpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRNb3VzZUxpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiaW5kRHJhZ0xpc3RlbmVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kcmFnTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyID0gdGhpcy5kcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIHRoaXMuZHJhZ0xpc3RlbmVyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVuYmluZERyYWdMaXN0ZW5lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnJywgdGhpcy5kcmFnTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmluZE1vdXNlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5tb3VzZURvd25MaXN0ZW5lciAmJiAhdGhpcy5tb3VzZVVwTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLm1vdXNlZG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVVwTGlzdGVuZXIgPSB0aGlzLm1vdXNldXAuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bkxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZVVwTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdW5iaW5kTW91c2VMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW91c2VEb3duTGlzdGVuZXIgJiYgdGhpcy5tb3VzZVVwTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bkxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZVVwTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlVXBMaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmFnKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5vbkRyYWcuZW1pdChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSkgXHJcbiAgICBkcmFnU3RhcnQoZXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5hbGxvd0RyYWcoKSAmJiAhdGhpcy5wRHJhZ2dhYmxlRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ0VmZmVjdCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSB0aGlzLmRyYWdFZmZlY3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQnLCB0aGlzLnNjb3BlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMub25EcmFnU3RhcnQuZW1pdChldmVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJpbmREcmFnTGlzdGVuZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbmQnLCBbJyRldmVudCddKSBcclxuICAgIGRyYWdFbmQoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLm9uRHJhZ0VuZC5lbWl0KGV2ZW50KTtcclxuICAgICAgICB0aGlzLnVuYmluZERyYWdMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3VzZWRvd24oZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZSA9IGV2ZW50LnRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZXVwKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGUgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhbGxvd0RyYWcoKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdIYW5kbGUgJiYgdGhpcy5oYW5kbGUpXHJcbiAgICAgICAgICAgIHJldHVybiBEb21IYW5kbGVyLm1hdGNoZXModGhpcy5oYW5kbGUsIHRoaXMuZHJhZ0hhbmRsZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLnVuYmluZERyYWdMaXN0ZW5lcigpO1xyXG4gICAgICAgIHRoaXMudW5iaW5kTW91c2VMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3BEcm9wcGFibGVdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRHJvcHBhYmxlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICAgIFxyXG4gICAgQElucHV0KCdwRHJvcHBhYmxlJykgc2NvcGU6IHN0cmluZ3xzdHJpbmdbXTtcclxuXHJcbiAgICBASW5wdXQoKSBwRHJvcHBhYmxlRGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgXHJcbiAgICBASW5wdXQoKSBkcm9wRWZmZWN0OiBzdHJpbmc7XHJcbiAgICAgICAgXHJcbiAgICBAT3V0cHV0KCkgb25EcmFnRW50ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgXHJcbiAgICBAT3V0cHV0KCkgb25EcmFnTGVhdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgXHJcbiAgICBAT3V0cHV0KCkgb25Ecm9wOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7fVxyXG5cclxuICAgIGRyYWdPdmVyTGlzdGVuZXI6IGFueTtcclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBEcm9wcGFibGVEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmJpbmREcmFnT3Zlckxpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJpbmREcmFnT3Zlckxpc3RlbmVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kcmFnT3Zlckxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIgPSB0aGlzLmRyYWdPdmVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCB0aGlzLmRyYWdPdmVyTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdW5iaW5kRHJhZ092ZXJMaXN0ZW5lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnT3Zlckxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCB0aGlzLmRyYWdPdmVyTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnT3Zlckxpc3RlbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYWdPdmVyKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcclxuICAgIGRyb3AoZXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1kcmFnZ2FibGUtZW50ZXInKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkRyb3AuZW1pdChldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInLCBbJyRldmVudCddKSBcclxuICAgIGRyYWdFbnRlcihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuZHJvcEVmZmVjdCkge1xyXG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IHRoaXMuZHJvcEVmZmVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1kcmFnZ2FibGUtZW50ZXInKTtcclxuICAgICAgICB0aGlzLm9uRHJhZ0VudGVyLmVtaXQoZXZlbnQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKSBcclxuICAgIGRyYWdMZWF2ZShldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3AtZHJhZ2dhYmxlLWVudGVyJyk7XHJcbiAgICAgICAgdGhpcy5vbkRyYWdMZWF2ZS5lbWl0KGV2ZW50KTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIGFsbG93RHJvcChldmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBkcmFnU2NvcGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMuc2NvcGUpID09IFwic3RyaW5nXCIgJiYgZHJhZ1Njb3BlID09IHRoaXMuc2NvcGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2NvcGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5zY29wZS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRyYWdTY29wZSA9PSB0aGlzLnNjb3BlW2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMudW5iaW5kRHJhZ092ZXJMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgICBleHBvcnRzOiBbRHJhZ2dhYmxlLERyb3BwYWJsZV0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtEcmFnZ2FibGUsRHJvcHBhYmxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRHJhZ0Ryb3BNb2R1bGUgeyB9Il19