import Constants from '../constants';
const { LOCALSTORAGE_KEYS } = Constants;

const instance = Symbol('INSTANCE');
const singletonEnforcer = Symbol('SINGELTONENFORCER');

class Storage {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Instantiation failed: Use BreakingNewsData.instance instead of new.');
        }

        let localStorageContent = window.localStorage.getItem(LOCALSTORAGE_KEYS.content);
        this.content = JSON.parse(localStorageContent);

        if (!this.content) {
            this.content = {};
            window.localStorage.setItem(
                LOCALSTORAGE_KEYS.content,
                JSON.stringify(this.content)
            );
        }
    }

    static get instance() {
        if (!this[instance]) {
            this[instance] = new Storage(singletonEnforcer);
        }
        return this[instance];
    }

    getField(key) {
        return this.content[key];
    }

    setField(key, value) {
        this.content[key] = fieldContent;
        window.localStorage.setItem(
            LOCALSTORAGE_KEYS.content,
            JSON.stringify(this.content)
        );
    }
}

export default Storage;