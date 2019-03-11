import jquery from 'jquery';

import Model from './js/Model';
import Controller from './js/Controller';
import View from './js/View';
//Reset CSS, SCSS
import './css/main.scss';
import './css/reset.css';
window.$ = window.jQuery = jquery;
let saveData = localStorage.getItem('saveData');
if (!saveData) {
    localStorage.setItem('saveData', JSON.stringify([]));
    saveData = [];
} else saveData = JSON.parse(saveData);

const model = new Model(saveData);
const view = new View();
const controller = new Controller(model, view);

window.addEventListener('load', () => {
    controller.init();
});
