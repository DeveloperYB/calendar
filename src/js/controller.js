export default class Controller {
    constructor(model) {
        this.model = model;
        this.handleEvent = this.handleEvent.bind(this);
        this.getModelHeading = this.getModelHeading.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }
    handleEvent(e) {
        e.stopPropagation();
        switch (e.type) {
            case 'click':
                this.clickHandler(e.target);
                break;
            default:
                console.log(e.target);
        }
    }
    getModelHeading() {
        return this.model.heading;
    }
    clickHandler(target) {
        this.model.changeHeading();
    }
}
