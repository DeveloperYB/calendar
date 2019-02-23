const dayFromIdx = idx => {
    let re = '일';
    switch (idx) {
        case 0:
            re = '일';
            break;
        case 1:
            re = '월';
            break;
        case 2:
            re = '화';
            break;
        case 3:
            re = '수';
            break;
        case 4:
            re = '목';
            break;
        case 5:
            re = '금';
            break;
        case 6:
            re = '토';
            break;
    }
    return re;
};
const timeFromIdx = idx => {
    let text = '';
    if (idx <= 12) text += '오전 ';
    else text += '오후 ';

    if (idx > 12) text += `${idx - 12}시<br/>`;
    else text += `${idx}시<br/>`;

    if (idx < 10) {
        text += `(0${idx}:00)`;
    } else {
        text += `(${idx}:00)`;
    }
    return text;
};
const showDateRange = (now, flag, today) => {
    const sameDate = now.isSame(today);
    let html = '';
    if (flag === 'month') {
        html = now.format('YYYY년MM월');
    } else if (flag === 'week') {
        const thisWeekIdx = now.week();
        const minMonth = moment()
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0)
            .week(thisWeekIdx)
            .startOf('week');
        const maxMonth = moment()
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0)
            .week(thisWeekIdx)
            .endOf('week');
        if (minMonth.month() === maxMonth.month()) html = now.format('YYYY년MM월');
        else {
            if (minMonth.year() === maxMonth.year()) {
                html = `${minMonth.year()}년${minMonth.month() + 1}월 ~ ${maxMonth.month() + 1}월`;
            } else {
                html = `${minMonth.year()}년${minMonth.month() +
                    1}월 ~ ${maxMonth.year()}년${maxMonth.month() + 1}월`;
            }
        }
    } else if (flag === 'day') {
        html = now.format('YYYY년MM월DD알');
    }
    if (!sameDate) {
        html += `<div class="sel">Selected Day : (${now.format('YYYY년MM월DD일')})</div>`;
    }
    if (flag !== 'day' || !sameDate) {
        html += `<div class="today">Today : (${today.format('YYYY년MM월DD일')})</div>`;
    }
    return html;
};
class View {
    constructor() {
        this.render = this.render.bind(this);
        this.dateInputsChk = this.dateInputsChk.bind(this);
        this.addModal = this.addModal.bind(this);
        this.addActions = this.addActions.bind(this);
    }
    addActions() {
        const {
            changeDate,
            flagChange,
            setTimeInput,
            ucdMemoModal,
            goTimeWrap
        } = this.controllerAct;
        //일정추가 버튼
        $('#popup .footer .save, #popup .footer .edit, #popup .footer .del').on('click', e => {
            // const type = $()
            const type = $(e.target).data('type');
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
                data.startTime = Number(
                    moment(data.startTime)
                        .clone()
                        .format('x')
                );
                data.endTime = Number(
                    moment(data.endTime)
                        .clone()
                        .format('x')
                );
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
            //flag, key, value
            ucdMemoModal(
                type,
                data.startTime
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0) +
                    '|' +
                    data.endTime
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .millisecond(0),
                data
            );
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
        //addNote 일정 추가 버튼
        $('#addNote, #popup .bg, #popup .close').on('click', () => {
            this.addModal();
        });
    }
    addModal() {
        const { setTimeInput } = this.controllerAct;
        //addNote 일정 추가 버튼
        if (!$('#popup').hasClass('hide')) {
            $('#popup input').val('');
            setTimeInput('startDate', false, ['', '', '', 1]);
            setTimeInput('endDate', false, ['', '', '', 1]);
        }
        $('#popup').toggleClass('hide');
    }
    render(state) {
        const { changeNow, setTimeInput } = this.controllerAct;
        const { now, flag, showArr, saveData, today } = state;
        const cloneNow = now.clone();
        const cloneToday = today.clone();
        //팝업 내부 셀렉 select option채워넣기
        if (!$('#popup .timeSelWrap select option').length) {
            let optHtml = '';
            for (let t = 1; t <= 24; t++) {
                optHtml += `<option value="${t}">${t < 10 ? '0' + t : t}시</option>`;
            }
            $('#popup .timeSelWrap select').html(optHtml);
        }
        //현재 셀렉 날짜 보여주기
        // console.log(flag, showArr);
        console.log('state:\n', state);
        $('#head .selectedDate').html(showDateRange(cloneNow, flag, cloneToday));
        //월,주,일 버튼
        if ($('.cycleBtns .btn.active')) $('.cycleBtns .btn.active').removeClass('active');
        $('.cycleBtns .btn').each((i, v) => {
            if ($(v).data('cycle') === flag) {
                $(v).addClass('active');
                return false;
            }
        });
        //월간 달력 보여주기
        const $Calendar = $('<div class="container">');
        //헤드 부분 : 시작
        const $Chead = $('<div class="head">');
        $Chead.addClass(flag);
        if (flag === 'week' || flag === 'day') {
            const $div = $('<div class="dayWrap dayTxt">');
            $div.html(`<span class="dayOfTheWeek">요일</span>`);
            $Chead.append($div);
        }
        if (flag === 'day') {
            const thisDay = showArr[0].days[0].clone();
            const thisDayDay = thisDay.day();
            const $div = $('<div class="dayWrap">');
            if (thisDayDay === 0) {
                $div.addClass('sun');
            } else if (thisDayDay === 6) {
                $div.addClass('sat');
            }
            $div.html(`<span class="dayOfTheWeek">${dayFromIdx(thisDayDay)}</span>`);
            $Chead.append($div);
        } else {
            for (let c = 0; c < 7; c++) {
                const $div = $('<div class="dayWrap">');
                if (c === 0) {
                    $div.addClass('sun');
                } else if (c === 6) {
                    $div.addClass('sat');
                }
                $div.html(`<span class="dayOfTheWeek">${dayFromIdx(c)}</span>`);
                $Chead.append($div);
            }
        }
        $Calendar.append($Chead);
        //헤드부분 : 끝
        //몸통 부분 : 시작
        const thisMonth = cloneNow.month();
        const $Cbody = $('<div class="body">');
        $Cbody.addClass(flag);
        for (let a = 0; a < showArr.length; a++) {
            const weekData = showArr[a];
            const $row = $(`<div class="row" data-week="${weekData.week}">`);
            if (flag === 'week' || flag === 'day') {
                const $col = $(`<div class="col blank">`);
                $col.html('<div>시간/날짜</div>');
                $row.append($col);
            }
            for (let d = 0; d < weekData.days.length; d++) {
                const day = weekData.days[d];
                const timeStamp = day.format('x');
                const dayNum = day.day();
                const date = day.date();
                const dayMonth = day.month();
                // console.log(date, day);
                const $col = $(`<div class="col">`);
                $col.html(
                    `<div class="${
                        thisMonth === dayMonth ? 'dateBadge' : 'dateBadge noThisMonth'
                    }">${date}</div>`
                );
                //날짜 가 적혀있는 콜에 모달 팝업 Fn넣기
                $col.on('click', () => {
                    setTimeInput('startDate', false, [day.year(), dayMonth + 1, date, 1]);
                    setTimeInput('endDate', false, [day.year(), dayMonth + 1, date, 1]);
                    this.addModal();
                });
                if (dayNum === 0) {
                    $col.find('.dateBadge').addClass('sun');
                } else if (dayNum === 6) {
                    $col.find('.dateBadge').addClass('sat');
                }
                $col.find('.dateBadge').on('click', () => {
                    changeNow(day);
                });
                if (cloneNow.isSame(day)) {
                    $col.addClass('selectedDay');
                }
                if (cloneToday.isSame(day)) {
                    $col.addClass('today');
                }
                $row.append($col);
            }
            $Cbody.append($row);
        }
        if (flag === 'week' || flag === 'day') {
            let colLoop = 6;
            if (flag === 'day') colLoop = 0;
            for (let time = 1; time < 25; time++) {
                const $row = $(`<div class="row" data-week="${showArr[0].week}">`);
                //timeFromIdx
                for (let colIdx = -1; colIdx <= colLoop; colIdx++) {
                    const $col = $(`<div class="col">`);
                    if (colIdx === -1) {
                        $col.html(`<div class="">${timeFromIdx(time)}</div>`);
                        $col.addClass('timeTxt');
                    } else {
                        const day = showArr[0].days[colIdx].clone();
                        const timeStamp = day.format('x');
                        const dayNum = day.day();
                        const date = day.date();
                        const dayMonth = day.month();
                        $col.on('click', () => {
                            setTimeInput('startDate', false, [
                                day.year(),
                                dayMonth + 1,
                                date,
                                time
                            ]);
                            setTimeInput('endDate', false, [day.year(), dayMonth + 1, date, time]);
                            this.addModal();
                        });
                    }
                    $row.append($col);
                }
                $Cbody.append($row);
            }
        }
        $Calendar.append($Cbody);
        //몸통 부분 : 끝
        $('#calendar').html($Calendar);
    }
    dateInputsChk(state) {
        const { selDate, startDate, endDate } = state;
        $('.timeSelWrap').each((wi, wv) => {
            const chkTimeArr = (arr, t) => {
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
                $(t)
                    .find('input')
                    .each((i, v) => {
                        if (chk && valArr[i] && i === 1) {
                            $(v).val(valArr[i] + 1);
                        } else $(v).val(arr[i]);
                    });
                //시작일시,종료일시 부분 초기화
                if (arr[3]) {
                    $(t)
                        .find('select')
                        .val(!chk ? 1 : arr[3]);
                }
                return chk;
            };
            if (wi === 0) {
                //selDate
                if (!chkTimeArr(selDate, wv)) $(wv).addClass('error');
                else if ($(wv).hasClass('error')) $(wv).removeClass('error');
            } else if (wi === 1) {
                //startDate
                if (!chkTimeArr(startDate, wv)) $(wv).addClass('error');
                else if ($(wv).hasClass('error')) $(wv).removeClass('error');
            } else if (wi === 2) {
                //endDate
                if (!chkTimeArr(endDate, wv)) $(wv).addClass('error');
                else if ($(wv).hasClass('error')) $(wv).removeClass('error');
            }
        });
    }
}
export default View;
