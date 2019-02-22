const getMonthlyArr = now => {
    const startWeek = moment(now)
        .startOf('month')
        .week();
    const endWeek = moment(now)
        .endOf('month')
        .week();

    let calendar = [];
    for (var week = startWeek; week <= endWeek; week++) {
        calendar.push({
            week: week,
            days: Array(7)
                .fill(0)
                .map((n, i) =>
                    moment(now)
                        .week(week)
                        .startOf('week')
                        .clone()
                        .add(n + i, 'day')
                )
        });
    }
    return calendar;
};
const firstDayFromThisWeek = now => {
    return now
        .day(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
};

class View {
    constructor() {
        this.render = this.render.bind(this);
        this.addActions = this.addActions.bind(this);
    }
    addActions(fns) {
        //월,주,일 버튼
        $('.cycleBtns .btn').each((i, v) => {
            $(v).on('click', () => {
                fns.flagChange($(v).data('cycle'));
            });
        });
        console.log('_=-=-=-=-= 액션 추가!완료!', fns);
    }
    render(state) {
        //현재 셀렉 날짜 보여주기
        $('#head .selectedDate').html(state.now.format('YYYY-MM-DD'));
        //월,주,일 버튼
        if ($('.cycleBtns .btn.active')) $('.cycleBtns .btn.active').removeClass('active');
        $('.cycleBtns .btn').each((i, v) => {
            if ($(v).data('cycle') === state.flag) {
                $(v).addClass('active');
                return false;
            }
        });
        if (state.flag === 'month') {
            console.log(getMonthlyArr(state.now));
            console.log(state);
        }
    }
}
export default View;
