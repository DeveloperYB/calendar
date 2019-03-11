// import HoliydayAPI from './HoliydayAPI';
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
        this.addActions = this.addActions.bind(this);
        this.addModal = this.addModal.bind(this);
        this.view.controllerAct = {
            changeNow: this.changeNow,
            setTimeInput: this.setTimeInput,
            addModal: this.addModal
        };
    }
    init() {
        //[[2019,02],[2019,03],[2019,04]]
        // const test = new HoliydayAPI(
        //     res => {
        //         console.log(res);
        //     },
        //     [['2019', '02'], ['2019', '03'], ['2019', '04']]
        // );
        const { render, dateInputsChk } = this.view;
        dateInputsChk(this.model.state);
        this.changeArrFromEachFlag();
        render(this.model.state);
        this.addActions();
    }
    addActions() {
        const { changeDate, flagChange, setTimeInput, ucdMemoModal, goTimeWrap, addModal } = this;
        //일정추가 버튼
        $('#popup .footer .save, #popup .footer .edit, #popup .footer .del').on('click', e => {
            // const type = $()
            const type = $(e.target).data('type');
            const dataKey = Number($('#popup input.keyIdx').val());
            let data = {
                colorChip: $('#popup select.selColor').val(),
                title: $('#popup input.title').val(),
                content: $('#popup textarea.content').val(),
                startTime: [
                    Number($('#popup .startDate input.year').val()),
                    Number($('#popup .startDate input.month').val()),
                    Number($('#popup .startDate input.day').val()),
                    Number($('#popup .startDate select.hour').val())
                ],
                endTime: [
                    Number($('#popup .endDate input.year').val()),
                    Number($('#popup .endDate input.month').val()),
                    Number($('#popup .endDate input.day').val()),
                    Number($('#popup .endDate select.hour').val())
                ]
            };
            if ($('#popup .timeSelWrap.error').length) {
                alert('시간 설정이 잘못되었습니다.');
                return;
            } else {
                data.startTime[1] = data.startTime[1] - 1;
                data.endTime[1] = data.endTime[1] - 1;
                data.startTime = Number(moment(data.startTime).format('x'));
                data.endTime = Number(moment(data.endTime).format('x'));
                if (data.startTime > data.endTime) {
                    alert('시작일시가 종료일시보다 이전이어야 합니다.');
                    return;
                } else if (!data.title) {
                    alert('제목이 없습니다.');
                    return;
                } else if (!data.content) {
                    alert('내용이 없습니다.');
                    return;
                }
            }
            //flag, value, idx
            if (type === 'create') {
                ucdMemoModal(type, data, null);
                // newData.push(value);
            } else if (type === 'update') {
                //모달에 idx 값 불러오기
                ucdMemoModal(type, data, dataKey);
                // newData[idx] = value;
            } else if (type === 'delete') {
                //모달에 idx 값 불러오기
                ucdMemoModal(type, null, dataKey);
                // newData.splice(idx, 1);
            }
            addModal();
        });
        //날짜 변환 버튼
        $('.editTimeBtns .btn').each((i, v) => {
            $(v).on('click', () => {
                let key = $(v).data('key');
                changeDate(key);
                $('#goTimeWrap input').val('');
                setTimeInput('selDate', false, ['', '', '']);
            });
        });
        //월,주,일 버튼
        $('.cycleBtns .btn').each((i, v) => {
            $(v).on('click', () => {
                flagChange($(v).data('cycle'));
            });
        });
        //해당 시간 선택 버튼
        $('#goThatTime').on('click', () => {
            if ($('#goTimeWrap .timeSelWrap').hasClass('error')) {
                alert('시간이 정확하지 않습니다.');
            } else goTimeWrap();
        });
        //모든 년,월,일 인풋 제한 걸기 ----- 시작
        $('.timeSelWrap input').each((i, v) => {
            let type = $(v).data('type');
            let dateType = $(v).data('datetype');
            if (type === 'year') {
                $(v).on('change', e => {
                    if (e.target.value) {
                        let val = Number(e.target.value.replace(/[^0-9\.]+/g, ''));
                        if (val < 1800) {
                            val = 1800;
                        } else if (val > 3000) {
                            val = 3000;
                        }
                        setTimeInput(dateType, 0, val);
                        $(v).val(val);
                    } else {
                        setTimeInput(dateType, 0, '');
                        $(v).val('');
                    }
                });
            } else if (type === 'month') {
                $(v).on('change', e => {
                    if (e.target.value) {
                        let val = Number(e.target.value.replace(/[^0-9\.]+/g, ''));
                        if (val < 1) {
                            val = 1;
                        } else if (val > 12) {
                            val = 12;
                        }
                        setTimeInput(dateType, 1, val);
                        $(v).val(val);
                    } else {
                        setTimeInput(dateType, 1, '');
                        $(v).val('');
                    }
                });
            } else if (type === 'day') {
                $(v).on('change', e => {
                    if (e.target.value) {
                        let val = Number(e.target.value.replace(/[^0-9\.]+/g, ''));
                        if (val < 1) {
                            val = 1;
                        } else if (val > 31) {
                            val = 31;
                        }
                        setTimeInput(dateType, 2, val);
                        $(v).val(val);
                    } else {
                        setTimeInput(dateType, 2, '');
                        $(v).val('');
                    }
                });
            }
        });
        //모든 년,월,일 인풋 제한 걸기 ----- 끝
        $('#popup2 .bg, #popup2 .close').on('click', () => {
            $('#popup2').toggleClass('hide');
            if (!$('#popup2').hasClass('hide')) {
                $('#popup2 .allList').html('');
            }
        });
        //addNote 일정 추가 버튼
        $('#addNote, #popup .bg, #popup .close').on('click', () => {
            addModal();
        });
    }
    addModal(data, idx) {
        const { setTimeInput } = this;
        //addNote 일정 추가 버튼
        if (!$('#popup').hasClass('hide')) {
            $('#popup select.selColor').val('ivory');
            $('#popup input.title').val('');
            $('#popup textarea.content').val('');
            setTimeInput('startDate', false, ['', '', '', 0]);
            setTimeInput('endDate', false, ['', '', '', 0]);
            $('#popup').removeClass('editing');
            $('#popup').addClass('addNew');
            $('#popup input.keyIdx').val('');
        } else {
            if (data) {
                const selDataTime = [moment(data.startTime), moment(data.endTime)];
                $('#popup select.selColor').val(data.colorChip);
                $('#popup input.title').val(data.title);
                $('#popup textarea.content').val(data.content);
                setTimeInput('startDate', false, [
                    selDataTime[0].year(),
                    selDataTime[0].month() + 1,
                    selDataTime[0].date(),
                    selDataTime[0].hour()
                ]);
                setTimeInput('endDate', false, [
                    selDataTime[1].year(),
                    selDataTime[1].month() + 1,
                    selDataTime[1].date(),
                    selDataTime[1].hour()
                ]);
                $('#popup').addClass('editing');
                $('#popup').removeClass('addNew');
                $('#popup input.keyIdx').val(idx);
            } else {
                $('#popup').removeClass('editing');
                $('#popup').addClass('addNew');
                $('#popup input.keyIdx').val('');
            }
        }
        $('#popup').toggleClass('hide');
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
    ucdMemoModal(flag, value, idx) {
        const { render } = this.view;
        const newData = [...this.model.state.saveData];
        if (flag === 'create') {
            newData.push(value);
        } else if (flag === 'update') {
            newData[idx] = value;
        } else if (flag === 'delete' && newData[idx]) {
            newData.splice(idx, 1);
        }
        this.setState('saveData', newData);
        localStorage.setItem('saveData', JSON.stringify(newData));
        //init
        //this.changeArrFromEachFlag();
        render(this.model.state);
    }
    setTimeInput(key, idx, val) {
        const { render, dateInputsChk } = this.view;
        if (idx !== false) {
            const newTimeArr = [...this.model.state[key]];
            newTimeArr[idx] = val;
            this.setState(key, newTimeArr);
        } else {
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
