import React from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../themes/skogen';
import { Form, Input, Button, Divider } from 'antd';
const FormItem = Form.Item;

class CreatePageForm extends React.Component {
  handleSubmit = (fieldsValue) => {
    this.props.registerPageLocally(fieldsValue);
  };

  validateTitle = (rule, value, callback) => {
    const { pageData, pageTitles } = this.props;

    let pageExists = false;
    if (
      pageTitles &&
      value &&
      pageTitles.some((title) => title.toLowerCase() === value.toLowerCase()) &&
      pageData.title.toLowerCase() !== value.toLowerCase()
    ) {
      pageExists = true;
    }

    if (pageExists) {
      callback('A page with this title already exists');
    } else if (value.length < 4) {
      callback('Title has to be at least 4 characters');
    } else {
      callback();
    }
  };

  render() {
    const { pageData } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details below</h3>
        <Divider />

        <Form onFinish={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please enter the Title',
              },
              { validator: this.validateTitle },
            ]}
            initialValue={pageData ? pageData.title : null}
          >
            <Input placeholder="Page title" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Description"
            name="longDescription"
            rules={[
              {
                required: true,
                message: 'Please enter a detailed description',
              },
            ]}
            initialValue={pageData ? pageData.longDescription : null}
          >
            <ReactQuill modules={editorModules} formats={editorFormats} />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Description in Swedish"
            name="longDescriptionSV"
            rules={[
              {
                message: 'Please enter a detailed description in Swedish',
              },
            ]}
            initialValue={pageData ? pageData.longDescriptionSV : null}
          >
            <ReactQuill modules={editorModules} formats={editorFormats} />
          </FormItem>

          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default CreatePageForm;
