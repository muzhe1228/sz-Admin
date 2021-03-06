import {Form, Input, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchModal from '../../components/modal/SearchModal.js'
import {getCodeType} from '../../requests/http-req.js'

moment.locale('zh-cn');
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export const FormItemCode = (props) => {

    return (
        <FormItem style={{margin: 'auto'}} label={'币种·'}>
            {
                (
                    <Input placeholder="输入币种"/>
                )}
        </FormItem>
    )
}

class BalanceTaskListSearch extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        showSearchModal: false,
        phone: '',
        email: '',
        codeType: null
    };
    selectUserId = ''

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (this.props.handleSearch) {
                    this.props.handleSearch(values, this.selectUserId)
                    return
                }
            }
        });
    }

    componentWillMount() {

    }

    componentDidMount() {
//获取币种类型 //获取提现类型的接口
        getCodeType().then(((res) => {
            this.setState({
                codeType: res.data.data
            })
        }))
    }

    onFocu = () => {
        this.selectUserId = null
        this.setState({showSearchModal: true})

    }

    onCancel = () => {
        this.setState({
            showSearchModal: false
        })
    }

    selectRow = (e) => {
        console.log(e)
        this.selectUserId = e.userId
        this.setState({
            phone: e.mobile&&e.mobile.trim() || null,
            email: e.email || null,
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    height: '120px',
                    minHeight: '120px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Row gutter={24}>
                        <Col span={24} key={6}>
                            <FormItem style={{margin: 'auto', flex: 1, width: '200px', paddingRight: '15px'}} label={`币种`}>
                                {getFieldDecorator(`coinCode`, {})(
                                    <Select
                                        placeholder="选择币种"
                                    >
                                        <Option key={1232} value={null}>全部</Option>
                                        {
                                            this.state.codeType && this.state.codeType.map((item, index) => {
                                                return <Option key={index}
                                                               value={item}>{item}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                    <Button htmlType="submit" type="primary" icon="search" style={{
                        marginLeft: '10px'
                    }}>
                        查询
                    </Button>

                </div>
            </Form>
        );
    }
}

const NewBalanceTaskListSearch = Form.create()(BalanceTaskListSearch);
export default NewBalanceTaskListSearch;
