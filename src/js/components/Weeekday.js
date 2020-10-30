import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import '../../scss/quill.scss';
import Util from '../util';
import Constants from '../constants';
import LocalStorageAdapter from './LocalStorageAdapter';

let editorConfig = {
    modules: { toolbar: false },
    placeholder: Constants.PLACEHOLDER_LABEL,
    theme: 'bubble'
};

let template = `
<section class="weeek-day weeek-day--{{sanitizedTitle}}">
    <header>
        <h2>{{title}}</h2>
        <button>
            <svg height="30" width="30">
                <mask id="cross">
                    <rect x="0" y="0" width="30" height="30" fill="white" />
                    <line x1="11" y1="11" x2="19" y2="19" stroke="black" stroke-width="3" stroke-linecap="round" />
                    <line x1="11" y1="19" x2="19" y2="11" stroke="black" stroke-width="3" stroke-linecap="round" />
                </mask>
                <circle cx="15" cy="15" r="13" fill="black" mask="url(#cross)"/>
            </svg>
        </button>
    </header>
    <div class="weeek-day__editor">
        <div class="weeek-day__editor-root"></div>
    </div>
</section>`;

function Weeekday (title) {

    // instance variables
    this.title = title;
    this.sanitizedTitle = Util.sanitize(title);
    this.node = null;
    this.editor = null;
    this.storage = LocalStorageAdapter.instance;

    // render UI
    let html = template;
    const placeholders = template.match(/{{\w+}}/g);
    placeholders.forEach(placeholder => {
        const key = placeholder.match(/\w+/)[0];
        html = html.replace(placeholder, this[key]);
    });
    const virtualParent = document.createElement('div');
    virtualParent.insertAdjacentHTML('afterbegin', html);
    this.node = virtualParent.firstElementChild;

    // init editor
    const editorRoot = this.node.querySelector('.weeek-day__editor-root');
    this.editor = new Quill(editorRoot, editorConfig);
    let storedContent = this.storage.getContent(title) || [{insert:'\n'}];
    this.editor.setContents(storedContent);
    this.editor.on('text-change', () => {
        let content = this.editor.getContents();
        this.storage.setContent(title, content);
    });
}

export default Weeekday;
