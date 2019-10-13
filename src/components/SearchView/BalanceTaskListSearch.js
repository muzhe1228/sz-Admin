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


class BalanceTaskListSearch extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
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
                <div style={{display: 'flex', width: '500px', alignItems: 'center'}}>
                    <Row gutter={24} style={{width: '100%'}}>
                        <Col span={12} key={6}>
                            <FormItem style={{margin: 'auto'}} label={`时间`}>
                                {getFieldDecorator('tradeDate')(
                                    <DatePicker format="YYYY-MM-DD"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={99}>
                            <FormItem style={{margin: 'auto'}} label={`状态`}>
                                {getFieldDecorator(`taskManualFlag`, {})(
                                    <Select
                                        placeholder="状态"
                                        //  onChange={this.handleSelectChange}
                                    >
                                        <Option value={null}>全部</Option>
                                        <Option value={'0'}>自动</Option>
                                        <Option value={'1'}>手动</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <div style={{height: '100%', display: 'flex',  alignItems: 'center'}}>
                    <Button htmlType="submit" type="primary" icon="search" style={{
                        marginLeft: '10px'
                    }}>
                        搜索
                    </Button>

                </div>
            </Form>
        );
    }
}

const NewBalanceTaskListSearch = Form.create()(BalanceTaskListSearch);
export default NewBalanceTaskListSearch;
