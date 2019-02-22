class Controller {
    constructor(model, view) {
        // this.model = model;
        // console.log(this);
        this.view = view;
        this.model = model;
        this.init = this.init.bind(this);
        this.setState = this.setState.bind(this);
        console.log(model, view, this);
    }
    init() {
        const { state } = this.model;
        const self = this;
        this.view.render(state);
        this.view.addActions({
            flagChange
        });
        function flagChange(flag) {
            self.setState('flag', flag);
        }
    }
    setState(key, val) {
        const { setState, state } = this.model;
        const initState = { ...state, [key]: val };
        setState(initState);
        this.view.render(this.model.state);
    }
}

export default Controller;
