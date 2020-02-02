import Weeek from './js/weeek';
import Constants from './js/constants';

let root = document.querySelector('.weeek');
let app = new Weeek(root);

for (let day of Constants.DAYS) {
    app.addDay(day);
}
