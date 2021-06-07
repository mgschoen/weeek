import { version } from '../../package.json';
import Weeek from './_Weeek';

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

let rootElement = document.querySelector('.weeek');
let weeek = new Weeek(rootElement);
DAYS.forEach((dayTitle) => weeek.addDay(dayTitle));
window.weeek = weeek;

document.getElementById('version').textContent = `v${version}`;
