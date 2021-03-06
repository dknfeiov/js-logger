/* 监控数据 */
export default class LogModel {
    /*  data:
            time: 时间
            origin: 错误来源
            title: 错误title
            category: 分类 =>  'js'| 'resource'| 'ajax' | 'timeout' | 'normal'  ...
            msg: 错误信息
            userAgent: 浏览器头
            platform: 操作系统
    */
    constructor(data) {
        const { time, origin, title, category, msg, userAgent, platform } = data
        // 上报时间
        this.MONITOR_REPORTTIME = time
        // 上报来源
        this.MONITOR_ORIGIN = origin
        // 标题
        this.MONITOR_TITLE = title
        // 指标细分
        this.MONITOR_CATEGORY = category
        // 错误信息
        this.MONITOR_DATA = msg

        // 浏览器信息
        this.USERAGENT = userAgent
        // 系统平台
        this.PLATFORM = platform
    }

}