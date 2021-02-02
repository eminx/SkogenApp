import React from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../themes/skogen';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  Divider,
  Modal,
} from 'antd/lib';
const FormItem = Form.Item;
import { CheckCircleOutlined } from '@ant-design/icons';

class CreateGroupForm extends React.Component {
  handleSubmit = (fieldsValue) => {
    if (!this.props.uploadableImage) {
      Modal.error({
        title: 'Image is required',
        content: 'Please upload an image',
      });
      return;
    }

    this.props.registerGroupLocally(fieldsValue);
  };

  render() {
    const { uploadableImage, setUploadableImage, groupData } = this.props;

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details below</h3>
        <Divider />

        <Form onFinish={this.handleSubmit}>
          <FormItem
            name="title"
            rules={[
              {
                required: true,
                message: 'Please enter the title',
              },
            ]}
            initialValue={groupData ? groupData.title : null}
          >
            <Input placeholder="Group title" />
          </FormItem>

          <FormItem
            name="readingMaterial"
            rules={[
              {
                required: true,
                message: 'Please enter a subtitle',
              },
            ]}
            initialValue={groupData ? groupData.readingMaterial : null}
          >
            <Input placeholder="Subtitle" />
          </FormItem>

          <FormItem
            name="description"
            rules={[
              {
                required: true,
                message: 'Please enter a detailed description',
              },
            ]}
            initialValue={groupData ? groupData.description : null}
          >
            <ReactQuill modules={editorModules} formats={editorFormats} />
          </FormItem>

          <FormItem
            name="capacity"
            rules={[
              {
                required: true,
                message: 'Please enter capacity for the group',
              },
            ]}
            initialValue={groupData ? groupData.capacity : null}
            min={2}
            max={50}
          >
            <InputNumber min={2} max={50} placeholder="Capacity" autosize />
          </FormItem>

          <FormItem
            className="upload-image-col"
            extra={uploadableImage ? null : 'Pick an image from your device'}
          >
            <Upload
              name="gathering"
              action="/upload.do"
              onChange={setUploadableImage}
              required
            >
              {uploadableImage ? (
                <Button>
                  <CheckCircleOutlined />
                  Image selected
                </Button>
              ) : (
                <Button>Choose an image</Button>
              )}
            </Upload>
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

export default CreateGroupForm;
