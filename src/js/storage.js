import Constants from './constants';

function Storage () {
    let localStorageContent = 
        window.localStorage.getItem(Constants.LOCALSTORAGE_KEY);
    this.content = JSON.parse(localStorageContent);
    if (!this.content) {
        this.content = {};
        window.localStorage.setItem(
            Constants.LOCALSTORAGE_KEY,
            JSON.stringify(this.content)
        );
    }

    this.getField = key => {
        return this.content[key];
    }

    this.setField = (key, fieldContent) => {
        this.content[key] = fieldContent;
        window.localStorage.setItem(
            Constants.LOCALSTORAGE_KEY,
            JSON.stringify(this.content)
        );
    }
}

export default Storage;