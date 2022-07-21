declare global {
    namespace JSX {
        interface IntrinsicElements extends JSXBase.IntrinsicElements {
            [tagName: string]: any;
        }
    }
}
export declare namespace JSXBase {
    interface IntrinsicElements {
        a: JSXBase.AnchorHTMLAttributes<HTMLAnchorElement>;
        abbr: JSXBase.HTMLAttributes;
        address: JSXBase.HTMLAttributes;
        area: JSXBase.AreaHTMLAttributes<HTMLAreaElement>;
        article: JSXBase.HTMLAttributes;
        aside: JSXBase.HTMLAttributes;
        audio: JSXBase.AudioHTMLAttributes<HTMLAudioElement>;
        b: JSXBase.HTMLAttributes;
        base: JSXBase.BaseHTMLAttributes<HTMLBaseElement>;
        bdi: JSXBase.HTMLAttributes;
        bdo: JSXBase.HTMLAttributes;
        big: JSXBase.HTMLAttributes;
        blockquote: JSXBase.BlockquoteHTMLAttributes<HTMLQuoteElement>;
        body: JSXBase.HTMLAttributes<HTMLBodyElement>;
        br: JSXBase.HTMLAttributes<HTMLBRElement>;
        button: JSXBase.ButtonHTMLAttributes<HTMLButtonElement>;
        canvas: JSXBase.CanvasHTMLAttributes<HTMLCanvasElement>;
        caption: JSXBase.HTMLAttributes<HTMLTableCaptionElement>;
        cite: JSXBase.HTMLAttributes;
        code: JSXBase.HTMLAttributes;
        col: JSXBase.ColHTMLAttributes<HTMLTableColElement>;
        colgroup: JSXBase.ColgroupHTMLAttributes<HTMLTableColElement>;
        data: JSXBase.HTMLAttributes<HTMLDataElement>;
        datalist: JSXBase.HTMLAttributes<HTMLDataListElement>;
        dd: JSXBase.HTMLAttributes;
        del: JSXBase.DelHTMLAttributes<HTMLModElement>;
        details: JSXBase.DetailsHTMLAttributes<HTMLElement>;
        dfn: JSXBase.HTMLAttributes;
        dialog: JSXBase.DialogHTMLAttributes<HTMLDialogElement>;
        div: JSXBase.HTMLAttributes<HTMLDivElement>;
        dl: JSXBase.HTMLAttributes<HTMLDListElement>;
        dt: JSXBase.HTMLAttributes;
        em: JSXBase.HTMLAttributes;
        embed: JSXBase.EmbedHTMLAttributes<HTMLEmbedElement>;
        fieldset: JSXBase.FieldsetHTMLAttributes<HTMLFieldSetElement>;
        figcaption: JSXBase.HTMLAttributes;
        figure: JSXBase.HTMLAttributes;
        footer: JSXBase.HTMLAttributes;
        form: JSXBase.FormHTMLAttributes<HTMLFormElement>;
        h1: JSXBase.HTMLAttributes<HTMLHeadingElement>;
        h2: JSXBase.HTMLAttributes<HTMLHeadingElement>;
        h3: JSXBase.HTMLAttributes<HTMLHeadingElement>;
        h4: JSXBase.HTMLAttributes<HTMLHeadingElement>;
        h5: JSXBase.HTMLAttributes<HTMLHeadingElement>;
        h6: JSXBase.HTMLAttributes<HTMLHeadingElement>;
        head: JSXBase.HTMLAttributes<HTMLHeadElement>;
        header: JSXBase.HTMLAttributes;
        hgroup: JSXBase.HTMLAttributes;
        hr: JSXBase.HTMLAttributes<HTMLHRElement>;
        html: JSXBase.HTMLAttributes<HTMLHtmlElement>;
        i: JSXBase.HTMLAttributes;
        iframe: JSXBase.IframeHTMLAttributes<HTMLIFrameElement>;
        img: JSXBase.ImgHTMLAttributes<HTMLImageElement>;
        input: JSXBase.InputHTMLAttributes<HTMLInputElement>;
        ins: JSXBase.InsHTMLAttributes<HTMLModElement>;
        kbd: JSXBase.HTMLAttributes;
        keygen: JSXBase.KeygenHTMLAttributes<HTMLElement>;
        label: JSXBase.LabelHTMLAttributes<HTMLLabelElement>;
        legend: JSXBase.HTMLAttributes<HTMLLegendElement>;
        li: JSXBase.LiHTMLAttributes<HTMLLIElement>;
        link: JSXBase.LinkHTMLAttributes<HTMLLinkElement>;
        main: JSXBase.HTMLAttributes;
        map: JSXBase.MapHTMLAttributes<HTMLMapElement>;
        mark: JSXBase.HTMLAttributes;
        menu: JSXBase.MenuHTMLAttributes<HTMLMenuElement>;
        menuitem: JSXBase.HTMLAttributes;
        meta: JSXBase.MetaHTMLAttributes<HTMLMetaElement>;
        meter: JSXBase.MeterHTMLAttributes<HTMLMeterElement>;
        nav: JSXBase.HTMLAttributes;
        noscript: JSXBase.HTMLAttributes;
        object: JSXBase.ObjectHTMLAttributes<HTMLObjectElement>;
        ol: JSXBase.OlHTMLAttributes<HTMLOListElement>;
        optgroup: JSXBase.OptgroupHTMLAttributes<HTMLOptGroupElement>;
        option: JSXBase.OptionHTMLAttributes<HTMLOptionElement>;
        output: JSXBase.OutputHTMLAttributes<HTMLOutputElement>;
        p: JSXBase.HTMLAttributes<HTMLParagraphElement>;
        param: JSXBase.ParamHTMLAttributes<HTMLParamElement>;
        picture: JSXBase.HTMLAttributes<HTMLPictureElement>;
        pre: JSXBase.HTMLAttributes<HTMLPreElement>;
        progress: JSXBase.ProgressHTMLAttributes<HTMLProgressElement>;
        q: JSXBase.QuoteHTMLAttributes<HTMLQuoteElement>;
        rp: JSXBase.HTMLAttributes;
        rt: JSXBase.HTMLAttributes;
        ruby: JSXBase.HTMLAttributes;
        s: JSXBase.HTMLAttributes;
        samp: JSXBase.HTMLAttributes;
        script: JSXBase.ScriptHTMLAttributes<HTMLScriptElement>;
        section: JSXBase.HTMLAttributes;
        select: JSXBase.SelectHTMLAttributes<HTMLSelectElement>;
        small: JSXBase.HTMLAttributes;
        source: JSXBase.SourceHTMLAttributes<HTMLSourceElement>;
        span: JSXBase.HTMLAttributes<HTMLSpanElement>;
        strong: JSXBase.HTMLAttributes;
        style: JSXBase.StyleHTMLAttributes<HTMLStyleElement>;
        sub: JSXBase.HTMLAttributes;
        summary: JSXBase.HTMLAttributes;
        sup: JSXBase.HTMLAttributes;
        table: JSXBase.TableHTMLAttributes<HTMLTableElement>;
        tbody: JSXBase.HTMLAttributes<HTMLTableSectionElement>;
        td: JSXBase.TdHTMLAttributes<HTMLTableDataCellElement>;
        textarea: JSXBase.TextareaHTMLAttributes<HTMLTextAreaElement>;
        tfoot: JSXBase.HTMLAttributes<HTMLTableSectionElement>;
        th: JSXBase.ThHTMLAttributes<HTMLTableHeaderCellElement>;
        thead: JSXBase.HTMLAttributes<HTMLTableSectionElement>;
        time: JSXBase.TimeHTMLAttributes<HTMLTimeElement>;
        title: JSXBase.HTMLAttributes<HTMLTitleElement>;
        tr: JSXBase.HTMLAttributes<HTMLTableRowElement>;
        track: JSXBase.TrackHTMLAttributes<HTMLTrackElement>;
        u: JSXBase.HTMLAttributes;
        ul: JSXBase.HTMLAttributes<HTMLUListElement>;
        var: JSXBase.HTMLAttributes;
        video: JSXBase.VideoHTMLAttributes<HTMLVideoElement>;
        wbr: JSXBase.HTMLAttributes;
    }
    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
        download?: any;
        href?: string;
        hrefLang?: string;
        hreflang?: string;
        media?: string;
        rel?: string;
        target?: string;
        referrerPolicy?: ReferrerPolicy;
    }
    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    }
    interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string;
        coords?: string;
        download?: any;
        href?: string;
        hrefLang?: string;
        hreflang?: string;
        media?: string;
        rel?: string;
        shape?: string;
        target?: string;
    }
    interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: string;
        target?: string;
    }
    interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
    }
    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        formAction?: string;
        formaction?: string;
        formEncType?: string;
        formenctype?: string;
        formMethod?: string;
        formmethod?: string;
        formNoValidate?: boolean;
        formnovalidate?: boolean;
        formTarget?: string;
        formtarget?: string;
        name?: string;
        type?: string;
        value?: string | string[] | number;
    }
    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string;
        width?: number | string;
    }
    interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number;
    }
    interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number;
    }
    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean;
        onToggle?: (event: Event) => void;
    }
    interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
        dateTime?: string;
        datetime?: string;
    }
    interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        onClose?: (event: Event) => void;
        open?: boolean;
        returnValue?: string;
    }
    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string;
        src?: string;
        type?: string;
        width?: number | string;
    }
    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        form?: string;
        name?: string;
    }
    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        acceptCharset?: string;
        acceptcharset?: string;
        action?: string;
        autoComplete?: string;
        autocomplete?: string;
        encType?: string;
        enctype?: string;
        method?: string;
        name?: string;
        noValidate?: boolean;
        novalidate?: boolean | string;
        target?: string;
    }
    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: string;
        allowFullScreen?: boolean;
        allowfullScreen?: string | boolean;
        allowTransparency?: boolean;
        allowtransparency?: string | boolean;
        frameBorder?: number | string;
        frameborder?: number | string;
        importance?: 'low' | 'auto' | 'high';
        height?: number | string;
        loading?: 'lazy' | 'auto' | 'eager';
        marginHeight?: number;
        marginheight?: string | number;
        marginWidth?: number;
        marginwidth?: string | number;
        name?: string;
        referrerPolicy?: ReferrerPolicy;
        sandbox?: string;
        scrolling?: string;
        seamless?: boolean;
        src?: string;
        srcDoc?: string;
        srcdoc?: string;
        width?: number | string;
    }
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string;
        decoding?: 'async' | 'auto' | 'sync';
        importance?: 'low' | 'auto' | 'high';
        height?: number | string;
        loading?: 'lazy' | 'auto' | 'eager';
        sizes?: string;
        src?: string;
        srcSet?: string;
        srcset?: string;
        useMap?: string;
        usemap?: string;
        width?: number | string;
    }
    interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
        dateTime?: string;
        datetime?: string;
    }
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: string;
        allowdirs?: boolean;
        alt?: string;
        autoCapitalize?: any;
        autocapitalize?: any;
        autoComplete?: string;
        autocomplete?: string;
        autoFocus?: boolean;
        autofocus?: boolean | string;
        capture?: string;
        checked?: boolean;
        crossOrigin?: string;
        crossorigin?: string;
        defaultChecked?: boolean;
        defaultValue?: string;
        dirName?: string;
        disabled?: boolean;
        files?: any;
        form?: string;
        formAction?: string;
        formaction?: string;
        formEncType?: string;
        formenctype?: string;
        formMethod?: string;
        formmethod?: string;
        formNoValidate?: boolean;
        formnovalidate?: boolean;
        formTarget?: string;
        formtarget?: string;
        height?: number | string;
        indeterminate?: boolean;
        list?: string;
        max?: number | string;
        maxLength?: number;
        maxlength?: number | string;
        min?: number | string;
        minLength?: number;
        minlength?: number | string;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        placeholder?: string;
        readOnly?: boolean;
        readonly?: boolean | string;
        required?: boolean;
        selectionStart?: number | string;
        selectionEnd?: number | string;
        selectionDirection?: string;
        size?: number;
        src?: string;
        step?: number | string;
        type?: string;
        value?: string | string[] | number;
        valueAsDate?: any;
        valueAsNumber?: any;
        webkitdirectory?: boolean;
        webkitEntries?: any;
        width?: number | string;
    }
    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        autofocus?: boolean | string;
        challenge?: string;
        disabled?: boolean;
        form?: string;
        keyType?: string;
        keytype?: string;
        keyParams?: string;
        keyparams?: string;
        name?: string;
    }
    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        htmlFor?: string;
        htmlfor?: string;
    }
    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | string[] | number;
    }
    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string;
        href?: string;
        hrefLang?: string;
        hreflang?: string;
        importance?: 'low' | 'auto' | 'high';
        integrity?: string;
        media?: string;
        rel?: string;
        sizes?: string;
        type?: string;
    }
    interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
    }
    interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string;
    }
    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: boolean;
        autoplay?: boolean | string;
        controls?: boolean;
        crossOrigin?: string;
        crossorigin?: string;
        loop?: boolean;
        mediaGroup?: string;
        mediagroup?: string;
        muted?: boolean;
        preload?: string;
        src?: string;
        onAbort?: (event: Event) => void;
        onCanPlay?: (event: Event) => void;
        onCanPlayThrough?: (event: Event) => void;
        onDurationChange?: (event: Event) => void;
        onEmptied?: (event: Event) => void;
        onEnded?: (event: Event) => void;
        onError?: (event: Event) => void;
        onInterruptBegin?: (event: Event) => void;
        onInterruptEnd?: (event: Event) => void;
        onLoadedData?: (event: Event) => void;
        onLoadedMetaData?: (event: Event) => void;
        onLoadStart?: (event: Event) => void;
        onMozAudioAvailable?: (event: Event) => void;
        onPause?: (event: Event) => void;
        onPlay?: (event: Event) => void;
        onPlaying?: (event: Event) => void;
        onProgress?: (event: Event) => void;
        onRateChange?: (event: Event) => void;
        onSeeked?: (event: Event) => void;
        onSeeking?: (event: Event) => void;
        onStalled?: (event: Event) => void;
        onSuspend?: (event: Event) => void;
        onTimeUpdate?: (event: Event) => void;
        onVolumeChange?: (event: Event) => void;
        onWaiting?: (event: Event) => void;
    }
    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: string;
        charset?: string;
        content?: string;
        httpEquiv?: string;
        httpequiv?: string;
        name?: string;
    }
    interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        high?: number;
        low?: number;
        max?: number | string;
        min?: number | string;
        optimum?: number;
        value?: string | string[] | number;
    }
    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
    }
    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classID?: string;
        classid?: string;
        data?: string;
        form?: string;
        height?: number | string;
        name?: string;
        type?: string;
        useMap?: string;
        usemap?: string;
        width?: number | string;
        wmode?: string;
    }
    interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: boolean;
        start?: number;
    }
    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        label?: string;
    }
    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        label?: string;
        selected?: boolean;
        value?: string | string[] | number;
    }
    interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        htmlFor?: string;
        htmlfor?: string;
        name?: string;
    }
    interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
        value?: string | string[] | number;
    }
    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: number | string;
        value?: string | string[] | number;
    }
    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: boolean;
        charSet?: string;
        charset?: string;
        crossOrigin?: string;
        crossorigin?: string;
        defer?: boolean;
        importance?: 'low' | 'auto' | 'high';
        integrity?: string;
        nonce?: string;
        src?: string;
        type?: string;
    }
    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        multiple?: boolean;
        name?: string;
        required?: boolean;
        size?: number;
        autoComplete?: string;
        autocomplete?: string;
    }
    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        type?: string;
    }
    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string;
        nonce?: string;
        scoped?: boolean;
        type?: string;
    }
    interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        cellPadding?: number | string;
        cellpadding?: number | string;
        cellSpacing?: number | string;
        cellspacing?: number | string;
        summary?: string;
    }
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        autofocus?: boolean | string;
        cols?: number;
        disabled?: boolean;
        form?: string;
        maxLength?: number;
        maxlength?: number | string;
        minLength?: number;
        minlength?: number | string;
        name?: string;
        placeholder?: string;
        readOnly?: boolean;
        readonly?: boolean | string;
        required?: boolean;
        rows?: number;
        value?: string | string[] | number;
        wrap?: string;
    }
    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
    }
    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        abbr?: string;
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
        rowspan?: number | string;
        scope?: string;
    }
    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: string;
    }
    interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean;
        kind?: string;
        label?: string;
        src?: string;
        srcLang?: string;
        srclang?: string;
    }
    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string;
        playsInline?: boolean;
        playsinline?: boolean | string;
        poster?: string;
        width?: number | string;
    }
    interface DOMAttributes<T> {
        slot?: string;
        part?: string;
        exportparts?: string;
        onCopy?: (event: ClipboardEvent) => void;
        onCopyCapture?: (event: ClipboardEvent) => void;
        onCut?: (event: ClipboardEvent) => void;
        onCutCapture?: (event: ClipboardEvent) => void;
        onPaste?: (event: ClipboardEvent) => void;
        onPasteCapture?: (event: ClipboardEvent) => void;
        onCompositionEnd?: (event: CompositionEvent) => void;
        onCompositionEndCapture?: (event: CompositionEvent) => void;
        onCompositionStart?: (event: CompositionEvent) => void;
        onCompositionStartCapture?: (event: CompositionEvent) => void;
        onCompositionUpdate?: (event: CompositionEvent) => void;
        onCompositionUpdateCapture?: (event: CompositionEvent) => void;
        onFocus?: (event: FocusEvent) => void;
        onFocusCapture?: (event: FocusEvent) => void;
        onFocusin?: (event: FocusEvent) => void;
        onFocusinCapture?: (event: FocusEvent) => void;
        onFocusout?: (event: FocusEvent) => void;
        onFocusoutCapture?: (event: FocusEvent) => void;
        onBlur?: (event: FocusEvent) => void;
        onBlurCapture?: (event: FocusEvent) => void;
        onChange?: (event: Event) => void;
        onChangeCapture?: (event: Event) => void;
        onInput?: (event: Event) => void;
        onInputCapture?: (event: Event) => void;
        onReset?: (event: Event) => void;
        onResetCapture?: (event: Event) => void;
        onSubmit?: (event: Event) => void;
        onSubmitCapture?: (event: Event) => void;
        onInvalid?: (event: Event) => void;
        onInvalidCapture?: (event: Event) => void;
        onLoad?: (event: Event) => void;
        onLoadCapture?: (event: Event) => void;
        onError?: (event: Event) => void;
        onErrorCapture?: (event: Event) => void;
        onKeyDown?: (event: KeyboardEvent) => void;
        onKeyDownCapture?: (event: KeyboardEvent) => void;
        onKeyPress?: (event: KeyboardEvent) => void;
        onKeyPressCapture?: (event: KeyboardEvent) => void;
        onKeyUp?: (event: KeyboardEvent) => void;
        onKeyUpCapture?: (event: KeyboardEvent) => void;
        onAuxClick?: (event: MouseEvent) => void;
        onClick?: (event: MouseEvent) => void;
        onClickCapture?: (event: MouseEvent) => void;
        onContextMenu?: (event: MouseEvent) => void;
        onContextMenuCapture?: (event: MouseEvent) => void;
        onDblClick?: (event: MouseEvent) => void;
        onDblClickCapture?: (event: MouseEvent) => void;
        onDrag?: (event: DragEvent) => void;
        onDragCapture?: (event: DragEvent) => void;
        onDragEnd?: (event: DragEvent) => void;
        onDragEndCapture?: (event: DragEvent) => void;
        onDragEnter?: (event: DragEvent) => void;
        onDragEnterCapture?: (event: DragEvent) => void;
        onDragExit?: (event: DragEvent) => void;
        onDragExitCapture?: (event: DragEvent) => void;
        onDragLeave?: (event: DragEvent) => void;
        onDragLeaveCapture?: (event: DragEvent) => void;
        onDragOver?: (event: DragEvent) => void;
        onDragOverCapture?: (event: DragEvent) => void;
        onDragStart?: (event: DragEvent) => void;
        onDragStartCapture?: (event: DragEvent) => void;
        onDrop?: (event: DragEvent) => void;
        onDropCapture?: (event: DragEvent) => void;
        onMouseDown?: (event: MouseEvent) => void;
        onMouseDownCapture?: (event: MouseEvent) => void;
        onMouseEnter?: (event: MouseEvent) => void;
        onMouseLeave?: (event: MouseEvent) => void;
        onMouseMove?: (event: MouseEvent) => void;
        onMouseMoveCapture?: (event: MouseEvent) => void;
        onMouseOut?: (event: MouseEvent) => void;
        onMouseOutCapture?: (event: MouseEvent) => void;
        onMouseOver?: (event: MouseEvent) => void;
        onMouseOverCapture?: (event: MouseEvent) => void;
        onMouseUp?: (event: MouseEvent) => void;
        onMouseUpCapture?: (event: MouseEvent) => void;
        onTouchCancel?: (event: TouchEvent) => void;
        onTouchCancelCapture?: (event: TouchEvent) => void;
        onTouchEnd?: (event: TouchEvent) => void;
        onTouchEndCapture?: (event: TouchEvent) => void;
        onTouchMove?: (event: TouchEvent) => void;
        onTouchMoveCapture?: (event: TouchEvent) => void;
        onTouchStart?: (event: TouchEvent) => void;
        onTouchStartCapture?: (event: TouchEvent) => void;
        onPointerDown?: (event: PointerEvent) => void;
        onPointerDownCapture?: (event: PointerEvent) => void;
        onPointerMove?: (event: PointerEvent) => void;
        onPointerMoveCapture?: (event: PointerEvent) => void;
        onPointerUp?: (event: PointerEvent) => void;
        onPointerUpCapture?: (event: PointerEvent) => void;
        onPointerCancel?: (event: PointerEvent) => void;
        onPointerCancelCapture?: (event: PointerEvent) => void;
        onPointerEnter?: (event: PointerEvent) => void;
        onPointerEnterCapture?: (event: PointerEvent) => void;
        onPointerLeave?: (event: PointerEvent) => void;
        onPointerLeaveCapture?: (event: PointerEvent) => void;
        onPointerOver?: (event: PointerEvent) => void;
        onPointerOverCapture?: (event: PointerEvent) => void;
        onPointerOut?: (event: PointerEvent) => void;
        onPointerOutCapture?: (event: PointerEvent) => void;
        onGotPointerCapture?: (event: PointerEvent) => void;
        onGotPointerCaptureCapture?: (event: PointerEvent) => void;
        onLostPointerCapture?: (event: PointerEvent) => void;
        onLostPointerCaptureCapture?: (event: PointerEvent) => void;
        onScroll?: (event: UIEvent) => void;
        onScrollCapture?: (event: UIEvent) => void;
        onWheel?: (event: WheelEvent) => void;
        onWheelCapture?: (event: WheelEvent) => void;
        onAnimationStart?: (event: AnimationEvent) => void;
        onAnimationStartCapture?: (event: AnimationEvent) => void;
        onAnimationEnd?: (event: AnimationEvent) => void;
        onAnimationEndCapture?: (event: AnimationEvent) => void;
        onAnimationIteration?: (event: AnimationEvent) => void;
        onAnimationIterationCapture?: (event: AnimationEvent) => void;
        onTransitionEnd?: (event: TransitionEvent) => void;
        onTransitionEndCapture?: (event: TransitionEvent) => void;
    }
    interface HTMLAttributes<T = HTMLElement> extends DOMAttributes<T> {
        innerHTML?: string;
        accessKey?: string;
        class?: string | {
            [className: string]: boolean;
        };
        contentEditable?: boolean | string;
        contenteditable?: boolean | string;
        contextMenu?: string;
        contextmenu?: string;
        dir?: string;
        draggable?: boolean;
        hidden?: boolean;
        id?: string;
        lang?: string;
        spellcheck?: 'true' | 'false' | any;
        style?: {
            [key: string]: string | undefined;
        };
        tabIndex?: number;
        tabindex?: number | string;
        title?: string;
        inputMode?: string;
        inputmode?: string;
        enterKeyHint?: string;
        enterkeyhint?: string;
        is?: string;
        radioGroup?: string;
        radiogroup?: string;
        role?: string;
        about?: string;
        datatype?: string;
        inlist?: any;
        prefix?: string;
        property?: string;
        resource?: string;
        typeof?: string;
        vocab?: string;
        autoCapitalize?: any;
        autocapitalize?: any;
        autoCorrect?: string;
        autocorrect?: string;
        autoSave?: string;
        autosave?: string;
        color?: string;
        itemProp?: string;
        itemprop?: string;
        itemScope?: boolean;
        itemscope?: boolean;
        itemType?: string;
        itemtype?: string;
        itemID?: string;
        itemid?: string;
        itemRef?: string;
        itemref?: string;
        results?: number;
        security?: string;
        unselectable?: boolean;
    }
}
