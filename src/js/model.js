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
const initState = {
    saveData,
    now,
    timeStamp: now.format('X'),
    format: now.format('YYYY-MM-DD'),
    value: 100
};

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

export default class Model {
    constructer() {
        this.state = initState;
    }
    HeadingState() {
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
    HelloState(container) {
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
    WorldState(container) {
        var self = this;
        this.container = container;
        this.value = 'World';
        container.state = this;

        // Implementing interface
        this.next = function() {
            return new HelloState(self.container);
        };
    }
}
