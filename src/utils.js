// 获取年月日
export function formatDateToString(date) {
    if (!date) {
        date = new Date();
    }
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
}

// 获取年月日时分秒
export function formateDateAndTimeToString(date) {
    if (!date) {
        date = new Date();
    }
    let hours = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    // let msecs = date.getMilliseconds();
    if (hours < 10) hours = `0${hours}`;
    if (mins < 10) mins = `0${mins}`;
    if (secs < 10) secs = `0${secs}`;
    // if (msecs < 10) secs = `0${msecs}`;
    return `${formatDateToString(date)} ${hours}:${mins}:${secs}`;
}