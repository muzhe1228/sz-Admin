import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Table, Modal, message, Button, Input} from 'antd';
// import './UserList/user-list.css';
import TableView from '../../components/TableView'
import {
    settleTaskList,
    settleTaskSubmit,
    dividendSetList,
    dividendSetUpdate
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import NewBalanceTaskListSearch from '../../components/SearchView/BalanceTaskListSearch.js'
export default class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModal: false,
            isLoading: false,
            total: 0,
            pageNo: 1,
            selectedRowKeys: [],
            showModal: false,
            dividList: [],
            dtotal: 0,
            dpageNo: 1,
            submitList: []
        }
    }

    columns1 = [
        {
            title: '币种',
            dataIndex: 'coinCode',
            width: '150px',
            key: 'coinCode'
        }
        ,
        {
            title: '今日交易手续费',
            dataIndex: 'poundageAmountTotal',
            width: '200px',
            key: 'poundageAmountTotal'
        }
        ,
        {
            title: '实际分配',
            width: '200px',
            render: (text, record, index) => (
                <Input key={record.id} value={this.state.submitList[index].poundageAmountTotal} onChange={this._changeHandler.bind(this,index)}></Input>
            )
        }
        ,
        {
            title: '数字游民分红',
            dataIndex: 'commonDividendAmount',
            key: 'commonDividendAmount',
            width: '200px'
        }
        ,
        {
            title: '数字节点分红',
            dataIndex: 'nodeDividendAmount',
            key: 'nodeDividendAmount',
            width: '200px'
        }
        ,
        {
            title: '自治基金',
            dataIndex: 'prizeDividendAmount',
            key: 'prizeDividendAmount',
            // width: '100px'
        }
    ];
    columns = [
        {
            title: '日期',
            dataIndex: 'tradeDate',
            width: '150px',
            key: 'tradeDate'
        }
        ,
        {
            title: '任务代码',
            dataIndex: 'taskCode',
            width: '200px',
            key: 'taskCode'
        }
        ,
        {
            title: '任务描述',
            dataIndex: 'taskDesc',
            key: 'taskDesc',
            width: '250px'
        }
        ,
        {
            title: '优先级',
            dataIndex: 'taskPriority',
            key: 'taskPriority',
            width: '100px'
        }
        ,
        {
            title: '任务备注',
            dataIndex: 'taskMemo',
            key: 'taskMemo',
            width: '200px'
        }
        ,
        {
            title: '操作员',
            dataIndex: 'operatorId',
            key: 'operatorId',
        }
        , {
            title: '操作时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }
        ,
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
            key: 'ww',
            width: 80,
            render: (text, r) => {
                if(r.taskManualFlag ==1 && r.taskStatus !== 1 && r.taskStatus !== 2){
                    return r.taskType == 130 ?<a onClick={() => this._set(r)}>设置</a> : <a onClick={() => this.submitTask(r)}>提交</a>
                }
            }
        }
    ];

    componentWillMount() {
        this.setState({isLoading: true})
    }

    componentDidMount() {
        this.getData()
    }

    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        })
    }

    donChangePagintion = (e) => {
        this.setState({
            dpageNo: e
        })
    }

    _changeHandler(i,e) {
        let list = this.state.submitList;
        list[i].poundageAmountTotal = e.target.value;
        this.setState({
            submitList: list
        })
    }

    _set(r) {
        let req = {
            pageNo: this.state.dpageNo,
            pageSize: 10,
            tradeDate: r.tradeDate,
            coinCode: ''
        }
    
        dividendSetList(req).then(res => {
            let _list = res.data.data.list.map(item => {
                let one = {};
                one.id = item.id;
                one.poundageAmountTotal = item.poundageAmountTotal;
                return one
            })
    
            this.setState({
                dividList: res.data.data.list,
                submitList: _list
            })
            
        })
        this.setState({
            showModal: true
        })
    }

    _onSubmit() {
       let req = this.state.submitList;
        dividendSetUpdate(req).then(res => {
            if(res.data.status == 200) {
                message.success('提交成功');
                this.onCancel();
                this.getData();
            }
        }).catch(err => {
            message.error(err.data.message);
        })
    }

    onCancel() {
        this.setState({
            showModal: false,
            dpageNo: 1,
            dividList: [],
            submitList: [],
            dtotal: 0
        })
    }

    renderSettleTaskList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px', minWidth: "800px"}}>
                <Spin spinning={this.state.isLoading}>
                    <TableView onChangePagintion={this.onChangePagintion} hiddenSelection
                               columns={this.columns} data={this.state.listData} pageNo={this.state.pageNo}
                               minWidth={800}
                               total={this.state.total}/>
                </Spin>
            </div>
        )
    }

    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }

    // 提交任务
    submitTask = (r) => {
        let para = {
            taskType: r.taskType,
            tradeDate: r.tradeDate
        }
        settleTaskSubmit(para).then((res) => {
            if (res.status == 200) {
                message.success('任务提交成功');
                this.getData()
            } else {
                message.error('没有修改');
            }

        }).catch(err => {
            message.error(err.data.message);
        })
    }

    handleSearch = (e, id) => {
        this.setState({
            pageNo : 1
        })
        //拼装请求格式
        this.searchData = e
        this.getData()

    }

    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    getData = () => {
        let data = this.searchData || []
        this.setState({isLoading: true})
        let startTime = data.tradeDate ? JSON.stringify(data.tradeDate).slice(1, 11) : null
        let tradeDate = startTime;
        if(!startTime) {
            tradeDate = this.getNowFormatDate();
        }
        let para = {
            tradeDate: tradeDate,
            taskManualFlag: data.taskManualFlag
        }
        settleTaskList(para).then((res) => {
            let listData = []
            if (res.status == 200) {
                let temArr = res.data.data
                if (!temArr || temArr.length == 0) {
                    message.info('没有查询到相关数据')
                } else {
                    temArr.forEach((item, index) => {
                        //TODO 是否登录 提现
                        item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                        listData.push(item)
                    })
                }
            }

            //添加key 没有计算
            this.setState({
                listData: listData,
                isLoading: false,
            })
        })
    }

    render() {
        return (
            <div className='center-user-list'>
            <Modal title="分红设置"
                   visible={this.state.showModal}
                   closable={true}
                   width={1200}
                   onCancel={this.onCancel.bind(this)}
                   footer={null}>
                <Table pagination={{
                    pageSize: this.state.dpageSize,
                    total: this.state.dtotal,
                    onChange: this.donChangePagintion
                }}
                       columns={this.columns1} dataSource={this.state.dividList} />
                <div style={{marginTop: 40, textAlign: 'center'}}>
                    <Button onClick={this._onSubmit.bind(this)} size='large' type='primary'
                        style={{ marginRight: 30 }}>提交</Button>
                    <Button onClick={this.onCancel.bind(this)} size='large' >返回</Button>
                </div>
            </Modal>
                {this.renderBreadcrumb()}
                <NewBalanceTaskListSearch handleSearch={this.handleSearch}/>
                {this.renderSettleTaskList()}
            </div>
        )
    }
}
