import Weeekday from './components/weeekday';

function Weeek (parentElement) {
    this.root = parentElement;
    this.days = {};

    this.addDay = (title => {
        let dayInstance = new Weeekday(title);
        this.days[title] = dayInstance;
        this.root.appendChild(dayInstance.node);
    }).bind(this);
}

export default Weeek;