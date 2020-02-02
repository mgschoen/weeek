import Weeek from './js/weeek';
import Constants from './js/constants';

let root = document.querySelector('.weeek');
window.weeek = new Weeek(root);

for (let day of Constants.DAYS) {
    window.weeek.addDay(day);
}
