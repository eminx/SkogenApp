import React, { useState } from 'react';
import {
  Button,
  Card,
  Carousel,
  Form,
  Icon,
  Input,
  Modal,
  Upload
} from 'antd/lib';
const FormItem = Form.Item;
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import FileDropper from '../UIComponents/FileDropper';
import { editorFormats, editorModules } from '../constants/quill-config';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function WorkForm({
  form,
  formValues,
  onQuillChange,
  onSubmit,
  setUploadableImages,
  images,
  imageUrl,
  buttonLabel,
  isFormValid,
  isButtonDisabled,
  onSortImages,
  onRemoveImage,
  categories
}) {
  const [previewImage, setPreviewImage] = useState(null);

  const { getFieldDecorator } = form;

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage({
      previewImage: file.url || file.preview
    });
  };

  const handleChange = ({ fileList }) => this.setState({ fileList });

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <div className="clearfix">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>

        <FormItem {...formItemLayout} label="Title">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: 'Please enter the Title'
              }
            ],
            initialValue: formValues ? formValues.title : null
          })(<Input placeholder="Page title" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Subtitle">
          {getFieldDecorator('shortDescription', {
            rules: [
              {
                required: false,
                message: 'Please enter subtitle (optional)'
              }
            ],
            initialValue: formValues ? formValues.shortDescription : null
          })(<Input placeholder="Page title" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Description">
          {getFieldDecorator('longDescription', {
            rules: [
              {
                required: true,
                message: 'Please enter a detailed description'
              }
            ],
            initialValue: formValues ? formValues.longDescription : null
          })(<ReactQuill modules={editorModules} formats={editorFormats} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Additional Info">
          {getFieldDecorator('additionalInfo', {
            rules: [
              {
                required: false,
                message: 'Please enter additional info (optional)'
              }
            ],
            initialValue: formValues ? formValues.additionalInfo : null
          })(<Input placeholder="Only limited amount..." />)}
        </FormItem>

        {images && images.length > 0 && (
          <div style={{ width: 180, height: 120 }}>
            <h3>Images {images.length}</h3>
            <Carousel>
              {images.map(image => (
                <Card
                  key={image}
                  cover={<img alt={formValues.title} src={image} />}
                />
              ))}
            </Carousel>
          </div>
        )}

        <FormItem
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 }
          }}
        >
          <Button type="primary" htmlType="submit">
            Confirm
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

const thumbStyle = backgroundImage => ({
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: 4,
  border: '1px solid #fff'
});

const thumbIconStyle = {
  float: 'right',
  margin: 2,
  padding: 4,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, .8)',
  cursor: 'pointer'
};

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  const onRemoveClick = event => {
    event.stopPropagation();
    event.preventDefault();
    onRemoveImage();
  };

  return (
    <div key={image} className="sortable-thumb" style={thumbStyle(image)}>
      <div
        color="dark-1"
        size="small"
        style={thumbIconStyle}
        onClick={onRemoveClick}
      />
    </div>
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return <div style={{ display: 'flex', wrap: 'wrap' }}>{children}</div>;
});

export default Form.create()(WorkForm);
