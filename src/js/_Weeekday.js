import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import '../scss/quill.scss';
import LocalStorageAdapter from './_LocalStorageAdapter';

const STATE_INITIAL = 'STATE_INITIAL';
const STATE_DELETABLE = 'STATE_DELETABLE';
const STATE_STASHED = 'STATE_STASHED';

const EDITOR_CONFIG = {
    modules: { toolbar: false },
    placeholder: 'You\'re free today!',
    theme: 'bubble'
};
const DELTA_EMPTY = [{insert:'\n'}];

const TEMPLATE = `
<section class="weeek-day weeek-day--{{sanitizedTitle}}">
    <header>
        <h2>{{title}}</h2>
        <button class="weeek-day__button">
            <svg class="weeek-day__icon-delete" height="30" width="30">
                <circle cx="15" cy="15" r="10" mask="url(#cross)" style="fill:currentColor;"/>
            </svg>
            <svg class="weeek-day__icon-undo" height="30" width="30" style="display:none;">
                <circle cx="15" cy="15" r="7" stroke="black" stroke-width="2" fill="none" mask="url(#circle-cutout)"/>
                <polygon points="16,6 16,13 23,7" fill="black"/>
            </svg>
            </button>
            </header>
    <div class="weeek-day__editor">
        <div class="weeek-day__editor-root"></div>
    </div>
</section>`;

const TEMPLATE_SVG_MASKS = `
<svg width="0" height="0" class="weeek__svg-masks">
    <mask id="cross">
        <rect x="0" y="0" width="30" height="30" fill="white" />
        <line x1="12" y1="12" x2="18" y2="18" stroke="black" stroke-width="3" stroke-linecap="round" />
        <line x1="12" y1="18" x2="18" y2="12" stroke="black" stroke-width="3" stroke-linecap="round" />
    </mask>
    <mask id="circle-cutout">
        <rect x="0" y="0" width="30" height="30" fill="white" />
        <polygon points="4,0 15,15 30,0" fill="black" style="transform:rotateX(15deg);"/>
    </mask>
</svg>
`;

export default class Weeekday {
    constructor(title) {
        // instance variables
        this.title = title;
        this.sanitizedTitle = title
            .trim()
            .toLowerCase()
            .replace(/\s/g, '-');
        this.editor = null;
        this.storage = LocalStorageAdapter.instance;
        this.stash = this.storage.getStash(this.title) || null;
        this.node = null;
        this.button = null;
        this.iconDelete = null;
        this.iconUndo = null;
        this._state = STATE_INITIAL;

        this.boundOnEditorTextChange = () => this.onEditorTextChange();
        this.boundOnButtonClicked = () => this.onButtonClicked();

        this.renderSvgMasks();
        this.renderUI();
        this.initEditor();
        this.determineState();
    }

    renderSvgMasks() {
        if (!document.querySelector('.weeek__svg-masks')) {
            document.body.insertAdjacentHTML('beforeend', TEMPLATE_SVG_MASKS);
        }
    }

    renderUI() {
        // render template
        let html = TEMPLATE;
        const placeholders = TEMPLATE.match(/{{\w+}}/g);
        placeholders.forEach(placeholder => {
            const key = placeholder.match(/\w+/)[0];
            html = html.replace(placeholder, this[key]);
        });
        const virtualParent = document.createElement('div');
        virtualParent.insertAdjacentHTML('afterbegin', html);

        // assign properties
        this.node = virtualParent.firstElementChild;
        this.button = this.node.querySelector('.weeek-day__button');
        this.iconDelete = this.node.querySelector('.weeek-day__icon-delete');
        this.iconUndo = this.node.querySelector('.weeek-day__icon-undo');

        // add event listeners
        this.button.addEventListener('click', this.boundOnButtonClicked);
    }

    initEditor() {
        const editorRoot = this.node.querySelector('.weeek-day__editor-root');
        this.editor = new Quill(editorRoot, EDITOR_CONFIG);
        let storedContent = this.storage.getContent(this.title) || DELTA_EMPTY;
        this.editor.setContents(storedContent);
        this.editor.on('text-change', this.boundOnEditorTextChange);
    }

    determineState() {
        const content = this.editor.getContents();
        const isEmpty = content.ops
            && Array.isArray(content.ops)
            && content.ops.length === 1
            && content.ops[0].insert
            && content.ops[0].insert === '\n'
            && !content.ops[0].attributes;

        if (!isEmpty) {
            if (this.state === STATE_STASHED) {
                this.forgetStash();
            }
            this.state = STATE_DELETABLE;
        } else if (this.stash) {
            this.state = STATE_STASHED;
        } else {
            this.state = STATE_INITIAL;
        }
    }

    stashAndDeleteContent() {
        this.stash = this.editor.getContents();
        this.storage.setStash(this.title, this.stash);
        this.editor.setContents(DELTA_EMPTY);
    }

    restoreStash() {
        this.editor.setContents(this.stash);
        this.forgetStash();
    }

    forgetStash() {
        this.stash = null;
        this.storage.setStash(this.title, null);
    }

    onEditorTextChange() {
        const content = this.editor.getContents();
        this.storage.setContent(this.title, content);
        this.determineState();
    }

    onButtonClicked() {
        const state = this.state;
        if (state === STATE_DELETABLE) {
            this.stashAndDeleteContent();
        } else if (state === STATE_STASHED) {
            this.restoreStash();
        } 
    }

    get state() {
        if (!this._state) {
            this._state = STATE_INITIAL;
        }
        return this._state;
    }

    set state(value) {
        const allowedStates = [ STATE_INITIAL, STATE_DELETABLE, STATE_STASHED ];
        if (!allowedStates.includes(value)) {
            console.warn(`"${value}" is an invalid value for state`);
            return null;
        }
        switch(value) {
            case STATE_DELETABLE:
                this.button.disabled = false;
                this.iconDelete.style.display = 'block';
                this.iconUndo.style.display = 'none';
                break;
            case STATE_STASHED:
                this.button.disabled = false;
                this.iconDelete.style.display = 'none';
                this.iconUndo.style.display = 'block';
                break;
            case STATE_INITIAL:
            default:
                this.button.disabled = true;
                this.iconDelete.style.display = 'block';
                this.iconUndo.style.display = 'none';
        }
        this._state = value;
        return this._state;
    }
};
