import LocalStorageAdapter from './storage';

let Storage = new LocalStorageAdapter();

function sanitize (text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s/g, '-');
}

function createWeeekdayElement (title) {
    let section = document.createElement('section');
    let headline = document.createElement('h2');
    let textarea = document.createElement('textarea');
    let updateFunction = () => {
        Storage.setField(title, textarea.value);
    }
    section.className = 'weeek-day weeek-day--' + sanitize(title);
    headline.textContent = title;
    textarea.value = Storage.getField(title) || '';
    textarea.addEventListener('keyup', updateFunction);
    textarea.addEventListener('change', updateFunction);

    section.appendChild(headline);
    section.appendChild(textarea);
    return section;
}  

function Weeek (parentElement) {
    this.root = parentElement;
    this.days = {};

    this.addDay = (title => {
        let dayElement = createWeeekdayElement(title);
        this.days[title] = {
            title: title,
            sanitizedTitle: sanitize(title),
            element: dayElement
        };
        this.root.appendChild(dayElement);
    }).bind(this);
}

export default Weeek;