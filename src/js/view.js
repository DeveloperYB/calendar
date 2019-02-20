function View(controller) {
    this.controller = controller;
    this.heading = document.getElementById('heading');
    this.heading.innerText = controller.getModelHeading();
    this.heading.addEventListener('click', controller);

    this.update = function(data) {
        this.heading.innerText = data.heading;
    };

    this.controller.model.registerObserver(this);
}

export default class Controller {
    constructor(model) {
        this.model = model;
    }
}
