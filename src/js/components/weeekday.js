import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Util from '../util';
import Constants from '../constants';
import LocalStorageAdapter from './storage';

let Storage = new LocalStorageAdapter();
let editorConfig = {
    modules: { toolbar: false },
    placeholder: Constants.PLACEHOLDER_LABEL,
    theme: 'bubble'
};

function Weeekday (title) {

    // instance variables
    this.title = title;
    this.sanitizedTitle = Util.sanitize(title);
    this.node = null;
    this.editor = null;

    // build UI elements
    let section = document.createElement('section');
    let headline = document.createElement('h2');
    let editor = document.createElement('div');
    let editorRoot = document.createElement('div');
    section.className = 'weeek-day weeek-day--' + Util.sanitize(title);
    headline.textContent = title;
    editor.className = 'weeek-day__editor';
    editorRoot.className = 'weeek-day__editor-root';

    // assemble UI
    section.appendChild(headline);
    editor.appendChild(editorRoot);
    section.appendChild(editor);
    this.node = section;

    // init editor
    this.editor = new Quill(editorRoot, editorConfig);
    let storedContent = Storage.getField(title) || [{insert:'\n'}];
    this.editor.setContents(storedContent);
    this.editor.on('text-change', () => {
        let content = this.editor.getContents();
        Storage.setField(title, content);
    })
}

export default Weeekday;