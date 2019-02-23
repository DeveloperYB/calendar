import moment from 'moment';
window.moment = moment;
//기본 저장 데이터 폼
// sample = {
//     [startTime-endTime]{
//         startTime : timeStamp, 년월일시
//         endTime : timeStamp, 년월일시
//         title : 타이틀,
//         content : content,
//         color : ''
//     }
// };

let saveData = localStorage.getItem('saveData');
if (!saveData) {
    localStorage.setItem('saveData', JSON.stringify({}));
    saveData = {};
} else saveData = JSON.parse(saveData);
const now = moment()
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
class Model {
    constructor() {
        //initState
        this.state = {
            saveData,
            now,
            today: now.clone(), //clone 해야함
            flag: 'month', // month,week,day
            showArr: [],
            selDate: ['', '', ''],
            startDate: ['', '', '', 1],
            endDate: ['', '', '', 1]
        };
        this.setState = this.setState.bind(this);
        this.getMonthlyArr = this.getMonthlyArr.bind(this);
        this.getWeeklyArr = this.getWeeklyArr.bind(this);
        this.getDayArr = this.getDayArr.bind(this);
    }
    setState(key, val) {
        // console.log(this.state, now);
        const initState = { ...this.state, [key]: val };
        this.state = initState;
    }
    getMonthlyArr() {
        const cloneNow = this.state.now.clone();
        const firstDayClone = cloneNow.clone().startOf('month');
        let startWeek = firstDayClone.week();
        let endWeek = firstDayClone
            .clone()
            .endOf('month')
            .week();
        //12월은 31일까지니까 31/7 = 4.4~ => +4||+5
        //12월 1일이 금요일이나 토요일이면 6줄
        //0 - 6 5금요일 6토요일
        if (endWeek < startWeek) {
            const startMonthDay = firstDayClone
                .clone()
                .startOf('month')
                .day();
            if (startMonthDay === 5 || startMonthDay === 6) {
                endWeek = startWeek + 5;
                // console.log('6줄이네요');
            } else {
                endWeek = startWeek + 4;
                // console.log('5줄이네요');
            }
        }
        // console.log('startWeek', startWeek);
        // console.log('cloneNow', cloneNow);
        let calendar = [];
        for (let week = startWeek; week <= endWeek; week++) {
            // console.log(week, firstDayClone.clone().week(week));
            calendar.push({
                week: week,
                days: Array(7)
                    .fill(0)
                    .map((n, i) => {
                        return firstDayClone
                            .clone()
                            .week(week)
                            .startOf('week')
                            .add(i, 'day');
                    })
            });
        }
        return calendar;
    }
    getWeeklyArr() {
        const cloneNow = this.state.now.clone();
        const thisWeekNum = cloneNow.week();
        let calendar = [{ week: thisWeekNum, days: [] }];
        for (let day = 0; day <= 6; day++) {
            calendar[0].days.push(
                cloneNow
                    .clone()
                    .startOf('week')
                    .add(day, 'day')
            );
        }
        return calendar;
    }
    getDayArr() {
        const cloneNow = this.state.now.clone();
        const thisWeekNum = cloneNow.week();
        let calendar = [{ week: thisWeekNum, days: [cloneNow] }];
        return calendar;
    }
}
export default Model;
