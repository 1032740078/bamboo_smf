/*
 * 有限状态机
 * 用于编排复杂的流程业务,如订单流转,审批流程
 * */
const EventEmitter = require('events');

module.exports = class Smf {
    constructor() {
        this.smf_data = {
            area_name  : "",//区块名称 or 状态链名称
            init_status: "",//初始状态
            transitions: [//转变内容
                // {
                //     status_name: '',//状态名称
                //     to         : '',//下一个流程地址(区块名称.状态名称)
                //     err        : '',//异常时的流程地址(区块名称.状态名称)
                // }
            ],
        }

        this.smf_data_list = [] //状态链列表
        this.currentState = "" //当前状态
        this.event = new EventEmitter()
    }

    /*================ 以下为创建一个流程相关功能 ====================*/

    /**
     * 定义初始值状态
     * @param  {string} area_name 区块名称 or 状态链名称.
     * @param  {string} init_status 初始状态.
     * @return {Object} this 当前对象.
     */
    init(area_name, init_status) {
        this.smf_data.area_name = area_name
        this.smf_data.init_status = init_status
        return this
    }

    /**
     * 添加转变内容
     * @param  {string} status_name 状态名称.
     * @param  {string   } to 下一个流程地址(区块名称.状态名称).
     * @param  {string } err 异常时的流程地址(区块名称.状态名称).
     * @return {Object} this 当前对象.
     */
    push(status_name, to, err) {
        this.smf_data.transitions.push({
            status_name,
            to : to || '',
            err: err || '',
        })
        return this
    }

    /**
     * 获取全部定义的json数据
     */
    getSmfData() {
        return this.smf_data
    }

    /*================ 以下为流程跳转相关 ====================*/

    /**
     * 设置所有区块数据
     * @param  {array } list 区块数据.
     * @return {Object} this 当前对象.
     */
    setSmfDataList(list) {
        this.smf_data_list = list
        return this
    }

    /**
     * 设置当前状态
     * @param  {string} currentState 当前状态(区块名称.状态名称).
     * @return {Object} this 当前对象.
     */
    setStatus(currentState) {
        if (currentState) { this.currentState = currentState }
        return this
    }

    /**
     * 获取当前状态的数据
     */
    get() {
        const [area_name, status_name] = this.currentState.split('.')
        const area = this.smf_data_list.filter(item => item.area_name === area_name)
        const status = area[0].transitions.filter(item => item.status_name === status_name)
        status[0].currentState = this.currentState
        return status[0]
    }

    /**
     * 获取当前状态的名称
     */
    getStatusName() {
        const status = this.get()
        return status.status_name
    }

    /**
     * 获取当前区域和状态
     */
    getCurrentState() {
        const status = this.get()
        return status.currentState
    }

    /**
     * 获取当前状态的to区域和状态
     */
    getTo() {
        const status = this.get()
        return status.to
    }

    /**
     * 获取当前状态的err区域和状态
     */
    getErr() {
        const status = this.get()
        return status.err
    }

    /**
     * 按当前状态跳转下一个
     * @param  {string} event 事件:to,err.
     * @param  {string} status 跳转时可以重新定义当前状态.
     * @return {Object} this 当前对象.
     */
    next(event, status) {
        this.setStatus(status)
        const status_data = this.get()
        const event_next = status_data[event]
        if (!event_next) {
            throw new Error(`[${this.currentState}]没有这个事件:${event}`)
        }
        this.setStatus(event_next)
        this.emit(this.get())
        return this
    }

    nextTo(status) {
        return this.next('to', status)
    }

    nextErr(status) {
        return this.next('err', status)
    }


    on(fn) {
        this.event.on('next', fn)
    }

    emit(paras) {
        this.event.emit('next', paras)
    }
}



