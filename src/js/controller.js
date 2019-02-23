class Controller {
    constructor(model, view) {
        // this.model = model;
        // console.log(this);
        this.view = view;
        this.model = model;
        this.init = this.init.bind(this);
        this.setState = model.setState;
        //controll model
        this.changeDate = this.changeDate.bind(this);
        this.flagChange = this.flagChange.bind(this);
        this.changeNow = this.changeNow.bind(this);
        this.setTimeInput = this.setTimeInput.bind(this);
        this.ucdMemoModal = this.ucdMemoModal.bind(this);
        this.goTimeWrap = this.goTimeWrap.bind(this);
        this.changeArrFromEachFlag = this.changeArrFromEachFlag.bind(this);
        this.view.controllerAct = {
            changeDate: this.changeDate,
            flagChange: this.flagChange,
            changeNow: this.changeNow,
            setTimeInput: this.setTimeInput,
            ucdMemoModal: this.ucdMemoModal,
            goTimeWrap: this.goTimeWrap
        };
    }
    init() {
        const { render, dateInputsChk, addActions } = this.view;
        dateInputsChk(this.model.state);
        this.changeArrFromEachFlag();
        render(this.model.state);
        addActions(); //액션 함수 뷰에 추가
    }
    goTimeWrap() {
        const { render, dateInputsChk } = this.view;
        dateInputsChk(this.model.state);
        const chkTimeArr = arr => {
            let valArr = [...arr];
            let chk = true;
            for (let a = 0; a < 3; a++) {
                if (arr[a] === '') {
                    chk = false;
                    break;
                }
            }
            if (chk) valArr[1] = valArr[1] - 1;
            if (chk && moment(valArr).format('x') === 'Invalid date') {
                chk = false;
            }
            return chk;
        };
        if (chkTimeArr(this.model.state.selDate)) {
            let newNowArr = this.model.state.selDate;
            this.setState(
                'now',
                moment([newNowArr[0], newNowArr[1] - 1, newNowArr[2]])
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
            );
            this.changeArrFromEachFlag();
            render(this.model.state);
        } else {
            alert('시간이 정확하지 않습니다.');
        }
    }
    ucdMemoModal(flag, key, value) {
        const { render } = this.view;
        const newData = JSON.parse(JSON.stringify(this.model.state.saveData));
        if (flag === 'create' || flag === 'update') {
            newData[key] = value;
        } else if (flag === 'delete' && newData[key]) {
            delete newData[key];
        }
        this.setState('saveData', newData);
        //init
        this.changeArrFromEachFlag();
        render(this.model.state);
    }
    setTimeInput(key, idx, val) {
        const { render, dateInputsChk } = this.view;
        if (idx !== false) {
            const newTimeArr = [...this.model.state[key]];
            newTimeArr[idx] = val;
            this.setState(key, newTimeArr);
        } else {
            console.log(key, val);
            this.setState(key, val);
        }
        //init
        dateInputsChk(this.model.state);
    }
    changeDate(flag) {
        const { render } = this.view;
        let cloneNow = this.model.state.now.clone();
        if (flag === 'today') {
            cloneNow = this.model.state.today;
        } else if (flag === 'after') {
            cloneNow = cloneNow.add(1, this.model.state.flag);
        } else if (flag === 'before') {
            cloneNow = cloneNow.add(-1, this.model.state.flag);
        }
        this.setState('now', cloneNow);
        //init
        this.changeArrFromEachFlag();
        render(this.model.state);
    }
    changeNow(time) {
        const { render } = this.view;
        if (!this.model.state.now.isSame(time)) {
            this.setState('now', time);
            //init
            this.changeArrFromEachFlag();
            render(this.model.state);
        }
    }
    flagChange(flag) {
        const { render } = this.view;
        // console.log('asdfasdfads!!!!', );
        if (this.model.state.flag !== flag) {
            this.setState('flag', flag);
            //init
            this.changeArrFromEachFlag();
            render(this.model.state);
        }
    }
    changeArrFromEachFlag() {
        //테이블 그려주는 어레이 뽑는 로직
        const { getMonthlyArr, getWeeklyArr, getDayArr } = this.model;
        let showArr = [];
        switch (this.model.state.flag) {
            case 'month':
                showArr = getMonthlyArr();
                break;
            case 'week':
                showArr = getWeeklyArr();
                break;
            case 'day':
                showArr = getDayArr();
                break;
            default:
                console.error('none flag');
                break;
        }
        this.setState('showArr', showArr);
    }
}

export default Controller;
