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

function Weeekday (title) {

    // instance variables
    this.title = title;
    this.sanitizedTitle = Util.sanitize(title);
    this.node = null;
    this.editor = null;
    this.storage = LocalStorageAdapter.instance;

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
    let storedContent = this.storage.getContent(title) || [{insert:'\n'}];
    this.editor.setContents(storedContent);
    this.editor.on('text-change', () => {
        let content = this.editor.getContents();
        this.storage.setContent(title, content);
    })
}

export default Weeekday;