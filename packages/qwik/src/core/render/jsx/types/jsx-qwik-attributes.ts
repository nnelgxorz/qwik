/* eslint-disable */

import type { Ref } from '../../../use/use-store.public';
import type { QRL } from '../../../import/qrl.public';
import type { JSXNode } from './jsx-node';

export interface QwikProps extends PreventDefault {
  class?: string | { [className: string]: boolean };
  innerHTML?: string;
  dangerouslySetInnerHTML?: string;
  ref?: Ref<Element>;

  /**
   *
   */
  'q:slot'?: string;

  /**
   * URL against which relative QRLs should be resolved to.
   */
  'q:obj'?: string;
  'q:host'?: string;
  'q:version'?: string;
  'q:container'?: '';
  // [key: `preventDefault:${string}`]: boolean;
  // [key: `preventdefault:${string}`]: boolean;
}

/**
 * @public
 */
export type NativeEventHandler<T = Event> =
  | ((ev: T, element: Element) => any)
  | ((ev: T, element: Element) => any)[];

/**
 * @public
 */
export type QrlEvent<Type = Event> = QRL<NativeEventHandler<Type>>;

/**
 * @public
 */
export type QwikEventMap = {
  Copy: ClipboardEvent;
  CopyCapture: ClipboardEvent;
  Cut: ClipboardEvent;
  CutCapture: ClipboardEvent;
  Paste: ClipboardEvent;
  PasteCapture: ClipboardEvent;
  CompositionEnd: CompositionEvent;
  CompositionEndCapture: CompositionEvent;
  CompositionStart: CompositionEvent;
  CompositionStartCapture: CompositionEvent;
  CompositionUpdate: CompositionEvent;
  CompositionUpdateCapture: CompositionEvent;
  Focus: FocusEvent;
  FocusCapture: FocusEvent;
  Focusin: FocusEvent;
  FocusinCapture: FocusEvent;
  Focusout: FocusEvent;
  FocusoutCapture: FocusEvent;
  Blur: FocusEvent;
  BlurCapture: FocusEvent;
  Change: Event;
  ChangeCapture: Event;
  Input: Event;
  InputCapture: Event;
  Reset: Event;
  ResetCapture: Event;
  Submit: Event;
  SubmitCapture: Event;
  Invalid: Event;
  InvalidCapture: Event;
  Load: Event;
  LoadCapture: Event;
  Error: Event; // also a Media Event
  ErrorCapture: Event; // also a Media Event
  KeyDown: KeyboardEvent;
  KeyDownCapture: KeyboardEvent;
  KeyPress: KeyboardEvent;
  KeyPressCapture: KeyboardEvent;
  KeyUp: KeyboardEvent;
  KeyUpCapture: KeyboardEvent;
  AuxClick: MouseEvent;
  Click: MouseEvent;
  ClickCapture: MouseEvent;
  ContextMenu: MouseEvent;
  ContextMenuCapture: MouseEvent;
  DblClick: MouseEvent;
  DblClickCapture: MouseEvent;
  Drag: DragEvent;
  DragCapture: DragEvent;
  DragEnd: DragEvent;
  DragEndCapture: DragEvent;
  DragEnter: DragEvent;
  DragEnterCapture: DragEvent;
  DragExit: DragEvent;
  DragExitCapture: DragEvent;
  DragLeave: DragEvent;
  DragLeaveCapture: DragEvent;
  DragOver: DragEvent;
  DragOverCapture: DragEvent;
  DragStart: DragEvent;
  DragStartCapture: DragEvent;
  Drop: DragEvent;
  DropCapture: DragEvent;
  MouseDown: MouseEvent;
  MouseDownCapture: MouseEvent;
  MouseEnter: MouseEvent;
  MouseLeave: MouseEvent;
  MouseMove: MouseEvent;
  MouseMoveCapture: MouseEvent;
  MouseOut: MouseEvent;
  MouseOutCapture: MouseEvent;
  MouseOver: MouseEvent;
  MouseOverCapture: MouseEvent;
  MouseUp: MouseEvent;
  MouseUpCapture: MouseEvent;
  TouchCancel: TouchEvent;
  TouchCancelCapture: TouchEvent;
  TouchEnd: TouchEvent;
  TouchEndCapture: TouchEvent;
  TouchMove: TouchEvent;
  TouchMoveCapture: TouchEvent;
  TouchStart: TouchEvent;
  TouchStartCapture: TouchEvent;
  PointerDown: PointerEvent;
  PointerDownCapture: PointerEvent;
  PointerMove: PointerEvent;
  PointerMoveCapture: PointerEvent;
  PointerUp: PointerEvent;
  PointerUpCapture: PointerEvent;
  PointerCancel: PointerEvent;
  PointerCancelCapture: PointerEvent;
  PointerEnter: PointerEvent;
  PointerEnterCapture: PointerEvent;
  PointerLeave: PointerEvent;
  PointerLeaveCapture: PointerEvent;
  PointerOver: PointerEvent;
  PointerOverCapture: PointerEvent;
  PointerOut: PointerEvent;
  PointerOutCapture: PointerEvent;
  GotPointerCapture: PointerEvent;
  GotPointerCaptureCapture: PointerEvent;
  LostPointerCapture: PointerEvent;
  LostPointerCaptureCapture: PointerEvent;
  Scroll: UIEvent;
  ScrollCapture: UIEvent;
  Wheel: WheelEvent;
  WheelCapture: WheelEvent;
  AnimationStart: AnimationEvent;
  AnimationStartCapture: AnimationEvent;
  AnimationEnd: AnimationEvent;
  AnimationEndCapture: AnimationEvent;
  AnimationIteration: AnimationEvent;
  AnimationIterationCapture: AnimationEvent;
  TransitionEnd: TransitionEvent;
  TransitionEndCapture: TransitionEvent;
};
export type on$ = {
  [K in keyof QwikEventMap as `on${K}$`]?: NativeEventHandler<QwikEventMap[K]>;
};
export type onQrl = {
  [K in keyof QwikEventMap as `on${K}Qrl`]?: QRL<(event: QwikEventMap[K], el: Element) => any>;
};
export type Parent = 'host' | 'window' | 'document';
export type onParent$ = {
  [K in keyof QwikEventMap as `${Parent}:on${K}$`]?: NativeEventHandler<QwikEventMap[K]>;
};
export type onParentQrl = {
  [K in keyof QwikEventMap as `${Parent}:on${K}Qrl`]?: QRL<
    (event: QwikEventMap[K], el: Element) => any
  >;
};
export type PreventDefault = {
  [K in keyof QwikEventMap as `prevent${'default' | 'Default'}:${Lowercase<K>}`]?: boolean;
};
export interface onCustom$ {
  [key: `on-${string}$`]: NativeEventHandler
  [key: `window:on-${string}$`]: NativeEventHandler
  [key: `document:on-${string}$`]: NativeEventHandler
  [key: `host:on-${string}$`]: NativeEventHandler
}
export interface onCustomQrl {
  [key: `on-${string}Qrl`]: QrlEvent | QrlEvent[]
  [key: `window:on-${string}Qrl`]: QrlEvent | QrlEvent[]
  [key: `document:on-${string}Qrl`]: QrlEvent | QrlEvent[]
  [key: `host:on-${string}Qrl`]: QrlEvent | QrlEvent[]
}

/**
 * @public
 */
export interface QwikEvents extends on$, onParent$, onCustom$ {
  // Clipboard Events
  // onCopy$?: NativeEventHandler<ClipboardEvent>;
  // onCopyCapture$?: NativeEventHandler<ClipboardEvent>;
  // onCut$?: NativeEventHandler<ClipboardEvent>;
  // onCutCapture$?: NativeEventHandler<ClipboardEvent>;
  // onPaste$?: NativeEventHandler<ClipboardEvent>;
  // onPasteCapture$?: NativeEventHandler<ClipboardEvent>;
  // onCompositionEnd$?: NativeEventHandler<CompositionEvent>;
  // onCompositionEndCapture$?: NativeEventHandler<CompositionEvent>;
  // onCompositionStart$?: NativeEventHandler<CompositionEvent>;
  // onCompositionStartCapture$?: NativeEventHandler<CompositionEvent>;
  // onCompositionUpdate$?: NativeEventHandler<CompositionEvent>;
  // onCompositionUpdateCapture$?: NativeEventHandler<CompositionEvent>;
  // onFocus$?: NativeEventHandler<FocusEvent>;
  // onFocusCapture$?: NativeEventHandler<FocusEvent>;
  // onFocusin$?: NativeEventHandler<FocusEvent>;
  // onFocusinCapture$?: NativeEventHandler<FocusEvent>;
  // onFocusout$?: NativeEventHandler<FocusEvent>;
  // onFocusoutCapture$?: NativeEventHandler<FocusEvent>;
  // onBlur$?: NativeEventHandler<FocusEvent>;
  // onBlurCapture$?: NativeEventHandler<FocusEvent>;
  // onChange$?: NativeEventHandler<Event>;
  // onChangeCapture$?: NativeEventHandler<Event>;
  // onInput$?: NativeEventHandler<Event>;
  // onInputCapture$?: NativeEventHandler<Event>;
  // onReset$?: NativeEventHandler<Event>;
  // onResetCapture$?: NativeEventHandler<Event>;
  // onSubmit$?: NativeEventHandler<Event>;
  // onSubmitCapture$?: NativeEventHandler<Event>;
  // onInvalid$?: NativeEventHandler<Event>;
  // onInvalidCapture$?: NativeEventHandler<Event>;
  // onLoad$?: NativeEventHandler<Event>;
  // onLoadCapture$?: NativeEventHandler<Event>;
  // onError$?: NativeEventHandler<Event>; // also a Media Event
  // onErrorCapture$?: NativeEventHandler<Event>; // also a Media Event
  // onKeyDown$?: NativeEventHandler<KeyboardEvent>;
  // onKeyDownCapture$?: NativeEventHandler<KeyboardEvent>;
  // onKeyPress$?: NativeEventHandler<KeyboardEvent>;
  // onKeyPressCapture$?: NativeEventHandler<KeyboardEvent>;
  // onKeyUp$?: NativeEventHandler<KeyboardEvent>;
  // onKeyUpCapture$?: NativeEventHandler<KeyboardEvent>;
  // onAuxClick$?: NativeEventHandler<MouseEvent>;
  // onClick$?: NativeEventHandler<MouseEvent>;
  // onClickCapture$?: NativeEventHandler<MouseEvent>;
  // onContextMenu$?: NativeEventHandler<MouseEvent>;
  // onContextMenuCapture$?: NativeEventHandler<MouseEvent>;
  // onDblClick$?: NativeEventHandler<MouseEvent>;
  // onDblClickCapture$?: NativeEventHandler<MouseEvent>;
  // onDrag$?: NativeEventHandler<DragEvent>;
  // onDragCapture$?: NativeEventHandler<DragEvent>;
  // onDragEnd$?: NativeEventHandler<DragEvent>;
  // onDragEndCapture$?: NativeEventHandler<DragEvent>;
  // onDragEnter$?: NativeEventHandler<DragEvent>;
  // onDragEnterCapture$?: NativeEventHandler<DragEvent>;
  // onDragExit$?: NativeEventHandler<DragEvent>;
  // onDragExitCapture$?: NativeEventHandler<DragEvent>;
  // onDragLeave$?: NativeEventHandler<DragEvent>;
  // onDragLeaveCapture$?: NativeEventHandler<DragEvent>;
  // onDragOver$?: NativeEventHandler<DragEvent>;
  // onDragOverCapture$?: NativeEventHandler<DragEvent>;
  // onDragStart$?: NativeEventHandler<DragEvent>;
  // onDragStartCapture$?: NativeEventHandler<DragEvent>;
  // onDrop$?: NativeEventHandler<DragEvent>;
  // onDropCapture$?: NativeEventHandler<DragEvent>;
  // onMouseDown$?: NativeEventHandler<MouseEvent>;
  // onMouseDownCapture$?: NativeEventHandler<MouseEvent>;
  // onMouseEnter$?: NativeEventHandler<MouseEvent>;
  // onMouseLeave$?: NativeEventHandler<MouseEvent>;
  // onMouseMove$?: NativeEventHandler<MouseEvent>;
  // onMouseMoveCapture$?: NativeEventHandler<MouseEvent>;
  // onMouseOut$?: NativeEventHandler<MouseEvent>;
  // onMouseOutCapture$?: NativeEventHandler<MouseEvent>;
  // onMouseOver$?: NativeEventHandler<MouseEvent>;
  // onMouseOverCapture$?: NativeEventHandler<MouseEvent>;
  // onMouseUp$?: NativeEventHandler<MouseEvent>;
  // onMouseUpCapture$?: NativeEventHandler<MouseEvent>;
  // onTouchCancel$?: NativeEventHandler<TouchEvent>;
  // onTouchCancelCapture$?: NativeEventHandler<TouchEvent>;
  // onTouchEnd$?: NativeEventHandler<TouchEvent>;
  // onTouchEndCapture$?: NativeEventHandler<TouchEvent>;
  // onTouchMove$?: NativeEventHandler<TouchEvent>;
  // onTouchMoveCapture$?: NativeEventHandler<TouchEvent>;
  // onTouchStart$?: NativeEventHandler<TouchEvent>;
  // onTouchStartCapture$?: NativeEventHandler<TouchEvent>;
  // onPointerDown$?: NativeEventHandler<PointerEvent>;
  // onPointerDownCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerMove$?: NativeEventHandler<PointerEvent>;
  // onPointerMoveCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerUp$?: NativeEventHandler<PointerEvent>;
  // onPointerUpCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerCancel$?: NativeEventHandler<PointerEvent>;
  // onPointerCancelCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerEnter$?: NativeEventHandler<PointerEvent>;
  // onPointerEnterCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerLeave$?: NativeEventHandler<PointerEvent>;
  // onPointerLeaveCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerOver$?: NativeEventHandler<PointerEvent>;
  // onPointerOverCapture$?: NativeEventHandler<PointerEvent>;
  // onPointerOut$?: NativeEventHandler<PointerEvent>;
  // onPointerOutCapture$?: NativeEventHandler<PointerEvent>;
  // onGotPointerCapture$?: NativeEventHandler<PointerEvent>;
  // onGotPointerCaptureCapture$?: NativeEventHandler<PointerEvent>;
  // onLostPointerCapture$?: NativeEventHandler<PointerEvent>;
  // onLostPointerCaptureCapture$?: NativeEventHandler<PointerEvent>;
  // onScroll$?: NativeEventHandler<UIEvent>;
  // onScrollCapture$?: NativeEventHandler<UIEvent>;
  // onWheel$?: NativeEventHandler<WheelEvent>;
  // onWheelCapture$?: NativeEventHandler<WheelEvent>;
  // onAnimationStart$?: NativeEventHandler<AnimationEvent>;
  // onAnimationStartCapture$?: NativeEventHandler<AnimationEvent>;
  // onAnimationEnd$?: NativeEventHandler<AnimationEvent>;
  // onAnimationEndCapture$?: NativeEventHandler<AnimationEvent>;
  // onAnimationIteration$?: NativeEventHandler<AnimationEvent>;
  // onAnimationIterationCapture$?: NativeEventHandler<AnimationEvent>;
  // onTransitionEnd$?: NativeEventHandler<TransitionEvent>;
  // onTransitionEndCapture$?: NativeEventHandler<TransitionEvent>;

  // 'document:onLoad$'?: (event: Event, el: Element) => any;
  // 'document:onLoadQrl'?: QRL<(event: Event, el: Element) => any>;

  // 'document:onScroll$'?: (event: Event, el: Element) => any;
  // 'document:onScrollQrl'?: QRL<(event: Event, el: Element) => any>;

  // 'document:onVisible$'?: (event: Event, el: Element) => any;
  // 'document:onVisible'?: QRL<(event: Event, el: Element) => any>;

  // 'document:onVisibilityChange$'?: (event: Event, el: Element) => any;
  // 'document:onVisibilityChangeQrl'?: QRL<(event: Event, el: Element) => any>;

  // [key: `on${string}$`]: NativeEventHandler<any> | undefined;
  // [key: `document:on${string}$`]: NativeEventHandler<any> | undefined;
  // [key: `window:on${string}$`]: NativeEventHandler<any> | undefined;
}

interface CSSProperties {
  [key: string]: string | number;
}

/**
 * @public
 */
export type JSXTagName = keyof HTMLElementTagNameMap | Omit<string, keyof HTMLElementTagNameMap>;

/**
 * @public
 */
export interface ComponentBaseProps extends onParent$, onParentQrl, PreventDefault {
  class?: string | { [className: string]: boolean };
  className?: string | undefined;
  style?: CSSProperties | string | undefined;
  key?: string | number;
  id?: string | undefined;
  ref?: Ref<Element>;

  'q:slot'?: string;

  'host:tagName'?: JSXTagName;
  [key: `host:${string}`]: any;
  children?: JSXChildren;

  // [key: `host:on${string}$`]: NativeEventHandler;
  // [key: `host:on${string}Qrl`]: QrlEvent | QrlEvent[];

  // [key: `document:on${string}$`]: NativeEventHandler | undefined;
  // [key: `document:on${string}Qrl`]: QrlEvent | QrlEvent[] | undefined;

  // [key: `window:on${string}$`]: NativeEventHandler | undefined;
  // [key: `window:on${string}Qrl`]: QrlEvent | QrlEvent[] | undefined;

  // [key: `preventDefault:${string}`]: boolean;
  // [key: `preventdefault:${string}`]: boolean;
}
export interface QwikAttributes extends QwikProps, QwikEvents {}

export type JSXChildren =
  | string
  | number
  | boolean
  | null
  | undefined
  | Function
  | RegExp
  | JSXChildren[]
  | Promise<JSXChildren>
  | JSXNode<any>;

/**
 * @public
 */
export interface DOMAttributes<T> extends QwikProps, QwikEvents {
  children?: JSXChildren;
  key?: string | number;
}
