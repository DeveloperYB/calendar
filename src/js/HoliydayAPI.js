import '@babel/polyfill';

export default class HolidayApi {
    constructor(callBackFn, data) {
        this.callBackFn = callBackFn;
        this.call(data);
    }
    call(data) {
        const { callBackFn } = this;
        // console.log(data);
        Promise.all(
            data.map(async v => {
                let data = await fetch(
                    `https://api.manana.kr/calendar/${v[0]}/${v[1]}/00/sundry,holiday/kr.json`
                )
                    .then(response => response.json())
                    .then(json => json)
                    .catch(v => []);
                return data;
            })
        ).then(function(values) {
            callBackFn(values);
        });
    }
}
