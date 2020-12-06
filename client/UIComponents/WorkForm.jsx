import React from 'react';
import { Button, Col, Form, Icon, Input, message, Row } from 'antd/lib';
const FormItem = Form.Item;
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import Slider from 'react-slick';

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

const sliderSettings = { dots: true };

function WorkForm({
  form,
  formValues,
  onQuillChange,
  setUploadableImages,
  images,
  imageUrl,
  buttonLabel,
  isButtonDisabled,
  onSortImages,
  onRemoveImage,
  categories,
  registerGroupLocally
}) {
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const handleSubmit = event => {
    event.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(err);
        console.log(err);
        return;
      }

      registerGroupLocally(fieldsValue);
    });
  };

  return (
    <Row style={{ padding: 24 }}>
      <Col lg={6} />
      <Col lg={12}>
        <Form onSubmit={handleSubmit}>
          <FormItem {...formItemLayout} label="Title">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please enter the Title'
                }
              ],
              initialValue: formValues ? formValues.title : null
            })(<Input placeholder="Title" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Subtitle">
            {getFieldDecorator('subtitle', {
              rules: [
                {
                  required: false,
                  message: 'Please enter subtitle (optional)'
                }
              ],
              initialValue: formValues ? formValues.subtitle : null
            })(<Input placeholder="Subtitle" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Description">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: false,
                  message: 'Please enter a detailed description'
                }
              ],
              initialValue: formValues ? formValues.description : null
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

          <FormItem {...formItemLayout}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {images && images.length > 0 && (
                <Slider settings={sliderSettings}>
                  {images.map(image => (
                    <img key={image} alt={formValues.title} src={image} />
                  ))}
                </Slider>
              )}
            </div>
          </FormItem>

          <FormItem {...formItemLayout} label={`Images (${images.length})`}>
            {images && images.length > 0 ? (
              <SortableContainer
                onSortEnd={onSortImages}
                axis="xy"
                helperClass="sortableHelper"
              >
                {images.map((image, index) => (
                  <SortableItem
                    key={image}
                    index={index}
                    image={image}
                    onRemoveImage={() => onRemoveImage(index)}
                  />
                ))}

                <FileDropper setUploadableImage={setUploadableImages} />
              </SortableContainer>
            ) : (
              <FileDropper setUploadableImage={setUploadableImages} />
            )}
          </FormItem>

          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 }
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              disabled={isButtonDisabled}
            >
              {buttonLabel}
            </Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
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
