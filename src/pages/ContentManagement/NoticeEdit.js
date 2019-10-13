import {Form, Icon, Upload, Input, Button, Radio, Select, message, InputNumber} from 'antd';
import React, {Component} from 'react';
import {upLoad} from '../../requests/http-req.js';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class NoticeEdit extends Component {
    state = {
        title: null,
        url: null,
        state: null,
        lang: null,
    };
    handleSubmit = () => {
        const {url, state, title, lang} = this.state
        //console.log(this.state)
        // if (url.indexOf('http') == -1) {
        //     message.warning('链接格式不正确，以http、https开头')
        //     return
        // }

        if (url == null || state == null || title == null || lang == null) {
            message.warning('信息不完整')
            return
        }
        let tem = {url: url, state: state, title: title, lang: lang}

        if (this.itemData) { //更新
            tem.id = this.itemData.id
            this.props.upData(tem)
        } else {
            this.props.onSave(tem)
        }
    }

    componentDidMount() {
//


    }

    componentWillMount() {

        this.itemData = this.props.itemData || null
        if (this.itemData) {
            //console.log(this.itemData)
            this.state.url = this.itemData.url,
                this.state.title = this.itemData.title,
                this.state.state = this.itemData.state,
                this.state.lang = this.itemData.lang
        }
    }

    selectBefore = (
        <Select defaultValue="Http://" style={{width: 90}}>
            <Option value="Http://">Http://</Option>
            <Option value="Https://">Https://</Option>
        </Select>
    );

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: {span: 8},//24
            },
        };

        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="标题"
                >

                    <Input  value={this.state.title} onChange={(e) => {
                        this.setState({title: e.target.value})
                    }} style={{width: 300}}/>

                </FormItem>
                <FormItem
                    {...formItemLayout}//linkUrl
                    label="链接地址"
                >

                    <Input value={this.state.url} onChange={(e) => {
                        this.setState({url: e.target.value})
                    }} style={{width: 300}}/>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="状态"
                >
                    <Select
                        style={{width: '150px'}}
                        value={this.state.state}
                        placeholder="状态"
                        onChange={(v) => {
                            this.setState({state: v})
                        }}
                    >
                        <Option key='android' value={0}>隐藏</Option>
                        <Option key='ios' value={1}>显示</Option>
                    </Select>

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="语言"
                >

                    <RadioGroup onChange={(e) => {
                        this.setState({lang: e.target.value})
                    }} value={this.state.lang}>
                        <Radio value={1}>中文</Radio>
                        <Radio value={2}>英文</Radio>
                    </RadioGroup>

                </FormItem>
                <Button style={{width: '100%'}} onClick={this.handleSubmit}>{this.itemData ? '修改' : '保存'}</Button>
            </Form>
        );
    }
}

const NewNoticeEdit = Form.create()(NoticeEdit);
export default NewNoticeEdit;
