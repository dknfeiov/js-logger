export class ErrorTest {
    constructor() {
        // uncatch promise 错误
        this.handle()
        // xhr 请求错误
        this.xhrError()
        // fetch 请求错误
        this.fetchError()
        // onerror js全局错误
        console.log(sdf.sdf)
    }

    handle() {
        new Promise((resolve, reject) => {
            // console.log(warn.promise)
            reject('reject promise');
        }).then((res) => {
            console.log('ok');
        });
    }
    xhrError() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'wrong/xhrError');
        xhr.responseType = 'json';
        xhr.onload = function () {
            console.log(xhr.response);
        };
        xhr.onerror = function () {
            console.log('Oops, error');
        };
        xhr.send();
    }
    fetchError() {
        fetch('http://localhost:3001/wrong/fetchError', {
            method: 'GET'
        }).then(res => {
            if (res.ok) { // True if status is HTTP 2xx
                return res;
            }
            throw new Error(`${res.status} : ${res.statusText}`);
        }).then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
        })
            .catch(e => {
                console.log(e);
            });
    }
}