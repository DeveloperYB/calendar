// State container
function HeadingState() {
    var self = this;
    this.state = new HelloState(self);
    this.changeState = function() {
        self.state.next();
    };
    this.getValue = function() {
        return self.state.value;
    };
}

// State
function HelloState(container) {
    var self = this;
    this.container = container;
    this.value = 'Hello';
    container.state = this;

    // Implementing interface
    this.next = function() {
        return new WorldState(self.container);
    };
}

// State
function WorldState(container) {
    var self = this;
    this.container = container;
    this.value = 'World';
    container.state = this;

    // Implementing interface
    this.next = function() {
        return new HelloState(self.container);
    };
}

function Model() {
    var self = this;
    var state = new HeadingState();
    var heading = state.getValue();

    // Observer pattern
    this.observers = [];
    this.registerObserver = function(observer) {
        self.observers.push(observer);
    };
    this.notifyAll = function() {
        self.observers.forEach(function(observer) {
            observer.update(self);
        });
    };

    this.changeHeading = function() {
        console.log('change heading');
        state.changeState();
        self.heading = state.getValue();
    };

    Object.defineProperty(this, 'heading', {
        get: function() {
            return heading;
        },
        set: function(value) {
            heading = value;
            this.notifyAll();
        }
    });
}

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

function Controller(model) {
    var self = this;
    this.model = model;

    this.handleEvent = function(e) {
        e.stopPropagation();
        switch (e.type) {
            case 'click':
                self.clickHandler(e.target);
                break;
            default:
                console.log(e.target);
        }
    };

    this.getModelHeading = function() {
        return self.model.heading;
    };

    this.clickHandler = function(target) {
        self.model.changeHeading();
    };
}

function main() {
    var model = new Model();
    var controller = new Controller(model);
    var view = new View(controller);
}
