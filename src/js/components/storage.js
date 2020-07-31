import Constants from '../constants';
const { LOCALSTORAGE_KEYS } = Constants;

const instance = Symbol('INSTANCE');
const singletonEnforcer = Symbol('SINGELTONENFORCER');

class Storage {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Instantiation failed: Use BreakingNewsData.instance instead of new.');
        }

        const localStorageContent = window.localStorage.getItem(LOCALSTORAGE_KEYS.content);
        this.content = JSON.parse(localStorageContent);
        
        if (!this.content) {
            this.content = {};
            window.localStorage.setItem(LOCALSTORAGE_KEYS.content, JSON.stringify(this.content));
        }
        
        const localStorageStash = window.localStorage.getItem(LOCALSTORAGE_KEYS.stash);
        this.stash = JSON.parse(localStorageStash);
        
        if (!this.stash) {
            this.stash = {};
            window.localStorage.setItem(LOCALSTORAGE_KEYS.stash, JSON.stringify(this.stash));
        }
    }

    static get instance() {
        if (!this[instance]) {
            this[instance] = new Storage(singletonEnforcer);
        }
        return this[instance];
    }

    getContent(field) {
        return this.content[field];
    }

    setContent(field, value) {
        this.content[field] = value;
        window.localStorage.setItem(LOCALSTORAGE_KEYS.content, JSON.stringify(this.content));
    }

    getStash(field) {
        return this.stash[field];
    }

    setStash(field, value) {
        this.stash[field] = value;
        window.localStorage.setItem(LOCALSTORAGE_KEYS.stash, JSON.stringify(this.stash));
    }
}

export default Storage;