import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import '../../scss/quill.scss';
import Util from '../util';
import LocalStorageAdapter from './LocalStorageAdapter';
import { PLACEHOLDER_LABEL } from '../constants';

let editorConfig = {
    modules: { toolbar: false },
    placeholder: PLACEHOLDER_LABEL,
    theme: 'bubble'
};

let template = `
<section class="weeek-day weeek-day--{{sanitizedTitle}}">
    <header>
        <h2>{{title}}</h2>
        <button data-weeek-day-el="button">
            <svg data-weeek-day-el="icon-delete" height="30" width="30">
                <circle cx="15" cy="15" r="13" mask="url(#cross)" style="fill:currentColor;"/>
            </svg>
            <svg data-weeek-day-el="icon-undo" height="30" width="30" style="display:none;">
                <circle cx="15" cy="15" r="13" stroke="black" stroke-width="2" fill="none"/>
            </svg>
            </button>
            </header>
    <div class="weeek-day__editor">
        <div class="weeek-day__editor-root"></div>
    </div>
</section>`;

export default class Weeekday {
    constructor(title) {
        // instance variables
        this.title = title;
        this.sanitizedTitle = Util.sanitize(title);
        this.editor = null;
        this.storage = LocalStorageAdapter.instance;
        this.node = null;
        this.button = null;
        this.iconDelete = null;
        this.iconUndo = null;
        this._state = 'STATE_INITIAL';

        this.renderUI();
        this.initEditor();
    }

    renderUI() {
        let html = template;
        const placeholders = template.match(/{{\w+}}/g);
        placeholders.forEach(placeholder => {
            const key = placeholder.match(/\w+/)[0];
            html = html.replace(placeholder, this[key]);
        });
        const virtualParent = document.createElement('div');
        virtualParent.insertAdjacentHTML('afterbegin', html);
        this.node = virtualParent.firstElementChild;
        this.button = this.node.querySelector('[data-weeek-day-el="button"]');
        this.iconDelete = this.node.querySelector('[data-weeek-day-el="icon-delete"]');
        this.iconUndo = this.node.querySelector('[data-weeek-day-el="icon-undo"]');
    }

    initEditor() {
        const editorRoot = this.node.querySelector('.weeek-day__editor-root');
        this.editor = new Quill(editorRoot, editorConfig);
        let storedContent = this.storage.getContent(this.title) || [{insert:'\n'}];
        this.editor.setContents(storedContent);
        this.editor.on('text-change', this.onEditorTextChange.bind(this));
    }

    onEditorTextChange() {
        let content = this.editor.getContents();
        this.storage.setContent(this.title, content);
    }

    get state() {
        if (!this._state) {
            this._state = 'STATE_INITIAL';
        }
        return this._state;
    }

    set state(value) {
        const allowedStates = [ 'STATE_INITIAL', 'STATE_DELETABLE', 'STATE_STASHED' ];
        if (!allowedStates.includes(value)) {
            console.warn(`"${value}" is an invalid value for state`);
            return null;
        }
        switch(value) {
            case 'STATE_DELETABLE':
                this.button.disabled = false;
                this.iconDelete.style.display = 'block';
                this.iconUndo.style.display = 'none';
                break;
            case 'STATE_STASHED':
                this.button.disabled = false;
                this.iconDelete.style.display = 'none';
                this.iconUndo.style.display = 'block';
                break;
            case 'STATE_INITIAL':
            default:
                this.button.disabled = true;
                this.iconDelete.style.display = 'block';
                this.iconUndo.style.display = 'none';
        }
        this._state = value;
        return this._state;
    }
};
