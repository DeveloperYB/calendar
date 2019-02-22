import moment from 'moment';
//기본 저장 데이터 폼
/*
공휴일 API는 시간 되면 하자...
now day << selected day
저장 값 스템프 기준으로 하기
가장 큰 값이 Month
State 비교 로직은 해당
한달 7*6 42칸 일 별 timestamp << 기준월 -1 ~ + 1
주간 7*24  168칸 시간 일 별 timestamp << 기준주
일간 1*24 24칸 시간 별 timestamp << 기준일
obj 1depth : (기준 월 -1)TimeStamp|(기준 월 +1)TimeStamp
obj 2depth : []
*/
// sample = {
//     [Month TimeStamp (-1 ~ +1)] : [
//         startTime : timeStamp, 년월일시
//         endTime : timeStamp, 년월일시
//         title : 타이틀,
//         content : content
//     ]
// }
let saveData = localStorage.getItem('saveData');
if (!saveData) {
    localStorage.setItem('saveData', JSON.stringify({}));
    saveData = {};
} else saveData = JSON.parse(saveData);
const now = moment();
class Model {
    constructor() {
        //initState
        this.state = {
            saveData,
            now,
            flag: 'month' // month,week,day
        };
        this.setState = this.setState.bind(this);
    }
    setState(val) {
        this.state = val;
    }
}
export default Model;
