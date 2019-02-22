import Model from './js/Model';
import Controller from './js/Controller';
import View from './js/View';
import jquery from 'jquery';
import moment from 'moment';
//Reset CSS, SCSS
import './css/main.scss';
import './css/reset.css';
window.$ = window.jQuery = jquery;
window.moment = moment;

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

window.addEventListener('load', () => {
    controller.init();
});
// console.log('1', model.state);
// console.log('2', model.setState({ ...model.state, value: { test: 13241 } }));

// const appRender = () => {
//     var model = new Model();
//     var controller = new Controller(model);
//     var view = new View(controller);
// };
