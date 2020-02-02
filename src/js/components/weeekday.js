import Util from '../util';
import LocalStorageAdapter from './storage';

let Storage = new LocalStorageAdapter();

function Weeekday (title) {

    this.title = title;
    this.sanitizedTitle = Util.sanitize(title);
    this.node = null;
    this.editor = null;

    let section = document.createElement('section');
    let headline = document.createElement('h2');
    let editorRoot = document.createElement('textarea');
    let updateFunction = () => {
        Storage.setField(title, editorRoot.value);
    }
    section.className = 'weeek-day weeek-day--' + Util.sanitize(title);
    headline.textContent = title;
    editorRoot.className = 'weeek-day__editor';
    editorRoot.value = Storage.getField(title) || '';
    editorRoot.addEventListener('keyup', updateFunction);
    editorRoot.addEventListener('change', updateFunction);

    section.appendChild(headline);
    section.appendChild(editorRoot);
    this.node = section;
}

export default Weeekday;