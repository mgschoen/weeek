import { version } from '../package.json';
import Weeek from './js/Weeek';
import Constants from './js/constants';

let root = document.querySelector('.weeek');
window.weeek = new Weeek(root);

for (let day of Constants.DAYS) {
    window.weeek.addDay(day);
}

document.getElementById('version').textContent = `v${version}`;
