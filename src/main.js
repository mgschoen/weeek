import { version } from '../package.json';
import Weeek from './js/Weeek';
import { DAYS } from './js/constants';

let root = document.querySelector('.weeek');
window.weeek = new Weeek(root);

for (let day of DAYS) {
    window.weeek.addDay(day);
}

document.getElementById('version').textContent = `v${version}`;
