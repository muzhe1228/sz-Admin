import React, {Component} from 'react';
import {Spin, Button, Modal, message, Checkbox} from 'antd';
// import './UserList/user-list.css';
import TableView from '../../components/TableView'
import {
    userCommissionDetailList,
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import NewUserRecommedSearch from '../../components/SearchView/UserRecommedSearch.js'
export default class PoundageToday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModal: false,
            isLoading: false,
            total: 0,
            pageNo: 1,
        }
    }

    selectedRowKeys = []

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
    
    todayPoudageList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                <Spin spinning={this.state.isLoading}>
                    <TableView onChangePagintion={this.onChangePagintion} hiddenSelection
                               columns={columns} data={this.state.listData} pageNo={this.state.pageNo}
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

   
   
    handleSearch = (e, id) => {
        this.state.pageNo = 1
        //拼装请求格式
        this.searchData = e
        this.getData()

    }

    getData = () => {
        let data = this.searchData || []
        this.setState({isLoading: true})

        let startTime = data.date && data.date[0] ? JSON.stringify(data.date[0]).slice(1, 11) : null
        let endTime = data.date && data.date[1] ? JSON.stringify(data.date[1]).slice(1, 11) : null

        let req = {
            pageNo: this.state.pageNo,
            pageSize: 10,
            startDate: startTime,
            endDate: endTime,
            userId: data.userId,
            parentId: data.parentId
        }

        userCommissionDetailList(req).then((res) => {
            let listData = []
            let total = 0
            if (res.status == 200) {
                let temArr = res.data.data.list
                total = res.data.data.total
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
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

    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                <NewUserRecommedSearch handleSearch={this.handleSearch}/>
                {this.todayPoudageList()}
            </div>
        )
    }
}
const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '60px',
        key: 'index',
    }
    ,
    {
        title: '邀请人UID',
        dataIndex: 'parentId',
        key: 'parentId',
    }
    ,
    {
        title: '被邀请人UID',
        dataIndex: 'userId',
        key: 'userId',
    }
    ,
    {
        title: '金额( USDT )',
        dataIndex: 'amountUsdt',
        key: 'amountUsdt',
    }
    ,
    {
        title: '返佣时间',
        dataIndex: 'commissionDate',
        key: 'commissionDate',
    }
];