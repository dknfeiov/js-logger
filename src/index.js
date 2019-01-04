// import { formateDateAndTimeToString } from './utils'
// 获取年月日
function formatDateToString(date) {
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
function formateDateAndTimeToString(date) {
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



const insMap = new Map()

export default class Logger {

    static getInstance(origin, config) {
        if (!insMap.has(origin)) {
            try {
                insMap.set(origin, new Logger(origin, config))
            } catch (error) {
                console.warn('初始化前端错误监控发生错误', error)
            }
        }
        return insMap.get(origin)
    }

    defaultConfig = {
        // error category
        jsError: true,
        resourceError: true,
        ajaxError: true,
        // others
        vueError: true,
        workerError: true,
        consoleError: false,
        category: ['js', 'resource', 'ajax'],
        handle: function () {
            console.warn('错误处理 handle 方法未定义')
        }
    }

    constructor(origin, config) {
        this.origin = origin
        this.recordError = this.recordError.bind(this)
        this.config = Object.assign({
            recordError: this.recordError
        }, this.defaultConfig, config)
        this.init(this.config)
    }

    // 记录错误
    recordError({ title, msg, level, category }) {
        try {
            console.error(
                this.origin,
                title, msg, level, category
            )
        } catch (error) {
            console.log('上报错误日志发生异常', error)
        }
        // const time = formateDateAndTimeToString()
        // const logData = new LogData(time, this.origin, title, msg, level, category)
        // console.log('日志上报', title, msg, level, category)
        // // 尽量不影响页面主线程
        // if (this.window.requestIdleCallback) {
        //     this.window.requestIdleCallback(() => this.report(logData))
        // } else {
        //     setTimeout(() => this.report(logData))
        // }
    }

    init(config) {
        var addEventListener = window.addEventListener || window.attachEvent;
        if (config.jsError) {
            this.handleWindowError(config);
        }
        if (config.jsError) {
            this.handleRejectPromise(config);
        }
        if (config.resourceError && addEventListener) {
            this.handleResourceError(config);
        }
        if (config.ajaxError) {
            this.handleAjaxError(config);
        }
        if (config.consoleError) {
            this.handleConsoleError(config);
        }
        // 初始化设备信息
        this.initDeviceInfo()
    }

    initDeviceInfo() {
        if (!navigator) {
            return
        }
        if (!this.deviceInfo) {
            this.deviceInfo = {
                // 浏览器信息
                USERAGENT: navigator.userAgent,
                // 系统平台
                PLATFORM: navigator.platform
            }
        }
    }

    // 全局js错误
    handleWindowError = function (config) {
        const $oldWindowError = window.onerror;
        window.onerror = (msg, url, line, col, error) => {
            if (error && error.stack) {
                config.recordError({
                    title: msg,
                    msg: error.stack,
                    category: 'js',
                    level: 'error'
                });
            } else if (typeof msg === 'string') {
                config.recordError({
                    title: msg,
                    msg: JSON.stringify({
                        resourceUrl: url,
                        rowNum: line,
                        colNum: col
                    }),
                    category: 'js',
                    level: 'error'
                });
            }
            if ($oldWindowError && typeof $oldWindowError === 'function') {
                $oldWindowError && $oldWindowError.apply(window, msg, url, line, col, error);
            }
        }
    }

    // uncatch Promise 错误
    handleRejectPromise = function (config) {
        window.addEventListener('unhandledrejection', (event) => {
            if (event) {
                const reason = event.reason;
                config.recordError({
                    title: 'unhandledrejection',
                    msg: reason,
                    category: 'js',
                    level: 'error'
                });
            }
        }, true);
    }

    handleResourceError = function (config) {
        window.addEventListener('error', (event) => {
            if (event) {
                const target = event.target || event.srcElement;
                const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget) return; // js error不再处理

                const url = target.src || target.href;
                config.recordError({
                    title: target.nodeName,
                    msg: url,
                    category: 'resource',
                    level: 'error'
                });
            }
        }, true);
    }

    handleFetchError = function (config) {
        if (!window.fetch) return;
        const $oldFetch = window.fetch;
        window.fetch = (...args) => {
            return $oldFetch.apply(args)
                .then(res => {
                    if (!res.ok) { // True if status is HTTP 2xx
                        config.recordError({
                            title: args[0],
                            // res 中的属性是不可枚举的，直接JSON.stringify 获取 '{}'
                            msg: JSON.stringify({
                                method: args[1].method,
                                status: res.status,
                                statusText: res.statusText,
                                type: res.type,
                                url: res.url
                            }),
                            category: 'ajax',
                            level: 'error'
                        });
                    }
                    return res;
                })
                .catch(error => {
                    // 网络故障时或请求被阻止
                    config.recordError({
                        title: args[0],
                        msg: JSON.stringify({
                            message: error.message,
                            stack: error.stack
                        }),
                        category: 'ajax',
                        level: 'error'
                    });
                    throw error;
                })
        }
    }

    handleAjaxError(config) {
        var protocol = window.location.protocol;
        if (protocol === 'file:') return;

        // 处理fetch
        this.handleFetchError(config);

        // 处理XMLHttpRequest
        if (!window.XMLHttpRequest) {
            return;
        }
        const xmlhttp = window.XMLHttpRequest;

        const $oldSend = xmlhttp.prototype.send;
        const _handleEvent = function (event) {
            if (event && event.currentTarget && event.currentTarget.status !== 200) {
                config.recordError({
                    title: event.target.responseURL,
                    msg: JSON.stringify({
                        response: event.target.response,
                        responseURL: event.target.responseURL,
                        status: event.target.status,
                        statusText: event.target.statusText
                    }),
                    category: 'ajax',
                    level: 'error'
                });
            }
        }
        xmlhttp.prototype.send = function (...args) {
            if (this['addEventListener']) {
                this['addEventListener']('error', _handleEvent);
                this['addEventListener']('load', _handleEvent);
                this['addEventListener']('abort', _handleEvent);
            } else {
                const $oldStateChange = this['onreadystatechange'];
                this['onreadystatechange'] = (event) => {
                    if (this.readyState === 4) {
                        _handleEvent(event);
                    }
                    $oldStateChange && $oldStateChange.apply(this, args);
                };
            }
            return $oldSend.apply(this, args);
        }
    }

    handleConsoleError = function (config) {
        if (!window.console || !window.console.error) return;
        const $oldConsoleError = window.console.error;
        window.console.error = (...args) => {
            config.recordError({
                title: 'consoleError',
                msg: JSON.stringify(args.join(',')),
                category: 'js',
                level: 'error'
            });
            $oldConsoleError && $oldConsoleError.apply(args);
        };
    }


    /*
        vue version 2.5.16 需要通过 Logger 实例手动调用
        @example:
            import Vue from 'vue';
            const logger = Logger.getInstance('data-insight')
            logger.handleVueError(Vue)
    */
    handleVueError = function (Vue) {
        const config = this.config
        if (!config.vueError) {
            return;
        }
        if (!Vue || !Vue.config) return; // 没有找到vue实例
        const $oldVueError = Vue.config.errorHandler;

        Vue.config.errorHandler = function VueErrorHandler(error, vm, info) {
            var metaData = {};
            if (Object.prototype.toString.call(vm) === '[object Object]') {
                metaData.componentName = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
                // metaData.propsData = vm.$options.propsData;
            }
            config.recordError({
                title: 'vue Error',
                msg: {
                    meta: metaData,
                    message: error.message,
                    stack: error.stack
                },
                category: 'js',
                level: 'error'
            });

            if ($oldVueError && typeof $oldVueError === 'function') {
                $oldVueError.call(this, error, vm, info);
            }
        };
    }


    handleWorkerError(worker) {
        const config = this.config
        if (!config.workerError) {
            return;
        }
        worker.addEventListener("error", event => {
            config.recordError({
                title: 'worker Error',
                msg: {
                    message: event.message,
                    filename: event.stack,
                    lineno: event.lineno,
                    colno: event.colno
                },
                category: 'js',
                level: 'error'
            });
        });
    }
}

window.JsLogger = Logger