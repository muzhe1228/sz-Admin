
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, message, Input, Button, Modal, Table} from 'antd';
import TableView from '../../components/TableView'
import {
    freezeListNode,
    freezeNodeList,
    freezeNodeFlow
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import {Link} from 'react-router-dom'
export default class NodeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            isLoading: false,
            total: 0,
            pageNo: 0,
            Mlist: [],
            Mlist2: [],
            showModal: false,
            showModal2: false,
            mPageNo: 1,
            mtotal: 0
        }

        this.uid = 0;
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '100px',
            key: 'index',
        }
        ,
        {
            title: '用户ID',
            dataIndex: 'userId',
            width: '200px',
            key: 'userId',
        }
        ,
        {
            title: '节点数量',
            dataIndex: 'nodeAmount',
            key: 'nodeAmount',
        }
        , {
            title: '锁仓量(SZ)',
            dataIndex: 'nodeFreezeAmount',
            key: 'nodeFreezeAmount',
        }
        ,
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
    
            width: 100,
            render: (text, record) => (
                <div> 
                    <a onClick={this._Nodelist.bind(this, record)} style={{marginRight: 10}}>详细</a><a onClick={this._NodeFlow.bind(this, record)}>流水</a>
                </div>
            )
        }
    ];
    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '100px',
            key: 'index',
        }
        ,
        {
            title: '申请时间',
            dataIndex: 'freezeTime',
            key: 'freezeTime',
        }
        ,
        {
            title: '节点数量',
            dataIndex: 'nodeSurplus',
            key: 'nodeSurplus',
        }
        , {
            title: '锁仓量(SZ)',
            dataIndex: 'freezeSurplus',
            key: 'freezeSurplus',
        }
    ];
    columns2 = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '100px',
            key: 'index',
        }
        ,
        {
            title: '用户操作',
            dataIndex: 'freezeFlag',
            width: '200px',
            key: 'freezeFlag',
            render: (text, record) => (
                record.freezeFlag == 1? '申请' : '退出'
            )
        }
        ,
        {
            title: '节点数量',
            dataIndex: 'nodeAmount',
            key: 'nodeAmount',
        }
        , {
            title: '锁仓量(SZ)',
            dataIndex: 'freezeAmount',
            key: 'freezeAmount',
        }
        , {
            title: '时间',
            dataIndex: 'freezeTime',
            key: 'freezeTime',
        }
    ];


    componentWillMount() {
        this.setState({isLoading: true})
    }

    componentDidMount() {
        this.getData({pageNo: 0, pageSize: 10})
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.getData({pageNo: e, pageSize: 10})
    }
    
    renderLockDepotList = () => {
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

    getData = () => {
        this.setState({isLoading: true})

        let req = {
            pageNo: this.state.pageNo,
            pageSize: 10,
        }

        if(this.uid) {
            req.userId = this.uid
        }

        freezeListNode(req).then((res) => {
            let listData = []
            let total = 0
            if (res.status == 200) {
                let temArr = res.data.data.list
                total = res.data.data.total
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    listData.push(item)
                })
            }

            //添加key 没有计算
            this.setState({
                listData: listData,
                isLoading: false,
                total: total
            })
        })
    }

    _changeHandler(e) {
       this.uid = e.target.value;
    }

    onCancel() {
        this.setState({
            showModal: false,
            showModal2: false,
            Mlist: [],
            Mlist2: [],
            mtotal: 0,
            mPageNo: 1
        })
    }

    _Nodelist(r) {
        this._getMDate(r);
        this.setState({
            showModal: true,
            mUid: r.userId
        })
    }
    _NodeFlow(r) {
        this._getMDate2(r);
        this.setState({
            showModal2: true,
            mUid: r.userId
        })
    }

    donChangePagintion = (e) => {
        this.setState({
            mPageNo: e
        }, () => {
            this._getMDate()
        })
    }
    donChangePagintion2 = (e) => {
        this.setState({
            mPageNo: e
        }, () => {
            this._getMDate2()
        })
    }

    _getMDate(r) {
        let req = {
            pageNo: this.state.mPageNo,
            pageSize: 10,
            userId: r? r.userId : this.state.mUid
        }
        freezeNodeList(req).then(res => {
            if(res.data.status == 200) {
                let temArr = res.data.data.list
                let listData = []
                let total = res.data.data.total
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
                    item.index = this.state.mPageNo == 0 ? (index + 1) : (this.state.mPageNo - 1) * 10 + index + 1

                    listData.push(item)
                })
                this.setState({
                    Mlist: listData,
                    mtotal: total
                })
            }
        })
    }
    _getMDate2(r) {
        let req = {
            pageNo: this.state.mPageNo,
            pageSize: 10,
            userId: r? r.userId : this.state.mUid
        }
        freezeNodeFlow(req).then(res => {
            if(res.data.status == 200) {
                let temArr = res.data.data.list
                let listData = []
                let total = res.data.data.total
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
                    item.index = this.state.mPageNo == 0 ? (index + 1) : (this.state.mPageNo - 1) * 10 + index + 1

                    listData.push(item)
                })
                this.setState({
                    Mlist2: listData,
                    mtotal: total
                })
            }
        })
    }

    render() {
        let { mUid } = this.state;
        return (
            <div className='center-user-list'>
                <Modal title="详细记录"
                    visible={this.state.showModal}
                    closable={true}
                    width={1200}
                    onCancel={this.onCancel.bind(this)}
                    footer={null}>
                    <div>用户ID:  {mUid}</div>
                    <Table pagination={{
                        pageSize: 10,
                        total: this.state.mtotal,
                        onChange: this.donChangePagintion,
                        current: this.state.mPageNo
                    }}
                        columns={this.columns1} dataSource={this.state.Mlist} />
                </Modal>
                <Modal title="流水明细"
                    visible={this.state.showModal2}
                    closable={true}
                    width={1200}
                    onCancel={this.onCancel.bind(this)}
                    footer={null}>
                    <div>用户ID:  {mUid}</div>
                    <Table pagination={{
                        pageSize: 10,
                        total: this.state.mtotal,
                        onChange: this.donChangePagintion2,
                        current: this.state.mPageNo
                    }}
                        columns={this.columns2} dataSource={this.state.Mlist2} />
                </Modal>
                {this.renderBreadcrumb()}
                <div style={{display: 'flex'}}>
                    <label htmlFor="" style={{height: 32, lineHeight: '32px', marginLeft: 30}}>用户ID：</label>
                    <Input style={{width: 200}} onChange={this._changeHandler.bind(this)} onPressEnter={this.getData.bind(this)}/>
                    <Button onClick={this.getData.bind(this)} type="primary" icon="search" style={{marginLeft: '30px'}}>
                        查询
                    </Button>
                </div>
                
                {this.renderLockDepotList()}
            </div>
        )
    }
}
