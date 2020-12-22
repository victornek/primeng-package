import { ElementRef, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare const INPUTNUMBER_VALUE_ACCESSOR: any;
export declare class InputNumber implements OnInit, ControlValueAccessor {
    el: ElementRef;
    private cd;
    showButtons: boolean;
    format: boolean;
    buttonLayout: string;
    disabled: boolean;
    inputId: string;
    styleClass: string;
    style: any;
    placeholder: string;
    size: number;
    maxlength: number;
    tabindex: string;
    title: string;
    ariaLabel: string;
    ariaRequired: boolean;
    name: string;
    required: boolean;
    autocomplete: string;
    min: number;
    max: number;
    incrementButtonClass: string;
    decrementButtonClass: string;
    incrementButtonIcon: string;
    decrementButtonIcon: string;
    step: number;
    inputStyle: any;
    inputStyleClass: string;
    input: ElementRef;
    onInput: EventEmitter<any>;
    onFocus: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    value: number;
    onModelChange: Function;
    onModelTouched: Function;
    focused: boolean;
    initialized: boolean;
    groupChar: string;
    prefixChar: string;
    suffixChar: string;
    isSpecialChar: boolean;
    timer: any;
    lastValue: string;
    _numeral: any;
    numberFormat: any;
    _decimal: any;
    _group: any;
    _minusSign: any;
    _currency: any;
    _prefix: any;
    _suffix: any;
    _index: any;
    _localeOption: string;
    _localeMatcherOption: string;
    _modeOption: string;
    _currencyOption: string;
    _currencyDisplayOption: string;
    _useGroupingOption: boolean;
    _minFractionDigitsOption: number;
    _maxFractionDigitsOption: number;
    _prefixOption: string;
    _suffixOption: string;
    get locale(): string;
    set locale(localeOption: string);
    get localeMatcher(): string;
    set localeMatcher(localeMatcherOption: string);
    get mode(): string;
    set mode(modeOption: string);
    get currency(): string;
    set currency(currencyOption: string);
    get currencyDisplay(): string;
    set currencyDisplay(currencyDisplayOption: string);
    get useGrouping(): boolean;
    set useGrouping(useGroupingOption: boolean);
    get minFractionDigits(): number;
    set minFractionDigits(minFractionDigitsOption: number);
    get maxFractionDigits(): number;
    set maxFractionDigits(maxFractionDigitsOption: number);
    get prefix(): string;
    set prefix(prefixOption: string);
    get suffix(): string;
    set suffix(suffixOption: string);
    constructor(el: ElementRef, cd: ChangeDetectorRef);
    ngOnInit(): void;
    getOptions(): {
        localeMatcher: string;
        style: string;
        currency: string;
        currencyDisplay: string;
        useGrouping: boolean;
        minimumFractionDigits: number;
        maximumFractionDigits: number;
    };
    constructParser(): void;
    updateConstructParser(): void;
    escapeRegExp(text: any): any;
    getDecimalExpression(): RegExp;
    getGroupingExpression(): RegExp;
    getMinusSignExpression(): RegExp;
    getCurrencyExpression(): RegExp;
    getPrefixExpression(): RegExp;
    getSuffixExpression(): RegExp;
    formatValue(value: any): any;
    parseValue(text: any): any;
    repeat(event: any, interval: any, dir: any): void;
    spin(event: any, dir: any): void;
    onUpButtonMouseDown(event: any): void;
    onUpButtonMouseUp(): void;
    onUpButtonMouseLeave(): void;
    onUpButtonKeyDown(event: any): void;
    onUpButtonKeyUp(): void;
    onDownButtonMouseDown(event: any): void;
    onDownButtonMouseUp(): void;
    onDownButtonMouseLeave(): void;
    onDownButtonKeyUp(): void;
    onDownButtonKeyDown(event: any): void;
    onUserInput(event: any): void;
    onInputKeyDown(event: any): void;
    onInputKeyPress(event: any): void;
    onPaste(event: any): void;
    isMinusSign(char: any): boolean;
    isDecimalSign(char: any): boolean;
    insert(event: any, text: any, sign?: {
        isDecimalSign: boolean;
        isMinusSign: boolean;
    }): void;
    insertText(value: any, text: any, start: any, end: any): any;
    deleteRange(value: any, start: any, end: any): any;
    initCursor(): void;
    onInputClick(): void;
    isNumeralChar(char: any): boolean;
    resetRegex(): void;
    updateValue(event: any, valueStr: any, insertedValueStr: any, operation: any): void;
    handleOnInput(event: any, currentValue: any, newValue: any): void;
    isValueChanged(currentValue: any, newValue: any): boolean;
    validateValue(value: any): any;
    updateInput(value: any, insertedValueStr: any, operation: any): void;
    onInputFocus(event: any): void;
    onInputBlur(event: any): void;
    formattedValue(): any;
    updateModel(event: any, value: any): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    get filled(): boolean;
    clearTimer(): void;
}
export declare class InputNumberModule {
}
