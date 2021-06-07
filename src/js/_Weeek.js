import Weeekday from './_Weeekday';

export default class Weeek {
    constructor(parentElement) {
        this.root = parentElement;
        this.days = {};
    }
    
    addDay(title) {
        let dayInstance = new Weeekday(title);
        this.days[title] = dayInstance;
        this.root.appendChild(dayInstance.node);
    }
};
