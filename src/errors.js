

export default class ErrorGenerator {

    // Error trigger
    trigger(eventType) {
        this[eventType]()
    }

    jsExecute() {
        console.log(sdf.sdf)
        undeclareFunction()
        // throw new Error('Error Event')
    }

    sourceNotFind() {
        const img = new Image()
        img.style.display = 'none'
        document.body.appendChild(img)
        img.src = `${location.origin}/unfindImg.png`
    }

    uncatchPromise() {
        new Promise((resolve, reject) => {
            reject('uncatch promise error');
        })
    }

    xhr() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'wrong/xhrError');
        xhr.responseType = 'json';
        xhr.send();
    }

    fetch() {
        fetch('http://localhost:3001/wrong/fetchError', {
            method: 'GET'
        })
    }
}