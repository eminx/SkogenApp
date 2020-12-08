import React from 'react';
import { Button, Form, Icon, Input, message, Select } from 'antd/lib';
const FormItem = Form.Item;
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import Slider from 'react-slick';

const { Option } = Select;

import FileDropper from '../UIComponents/FileDropper';
import { editorFormats, editorModules } from '../constants/quill-config';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const sliderSettings = { dots: true };

function WorkForm({
  form,
  formValues,
  setUploadableImages,
  images,
  buttonLabel,
  isButtonDisabled,
  onSortImages,
  onRemoveImage,
  categories,
  registerWorkLocally,
}) {
  const { getFieldDecorator } = form;

  const formItemLayout = {
    wrapperCol: { span: 24 },
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(err);
        console.log(err);
        return;
      }

      registerWorkLocally(fieldsValue);
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem {...formItemLayout}>
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: 'Please enter the Title',
            },
          ],
          initialValue: formValues ? formValues.title : null,
        })(<Input placeholder="Title" />)}
      </FormItem>

      <FormItem {...formItemLayout}>
        {getFieldDecorator('category', {
          rules: [
            {
              required: true,
              message: 'Please select category',
            },
          ],
          initialValue: <span style={{ color: '#aaa' }}>Category</span>,
        })(
          <Select placeholder="Category">
            {categories &&
              categories.map((category) => (
                <Option key={category._id} value={category.label.toUpperCase()}>
                  {category.label.toUpperCase()}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>

      <FormItem {...formItemLayout}>
        {getFieldDecorator('shortDescription', {
          rules: [
            {
              required: false,
              message: 'Please enter short info (optional)',
            },
          ],
          initialValue: formValues ? formValues.shortDescription : null,
        })(<Input placeholder="Short Description" />)}
      </FormItem>

      <FormItem {...formItemLayout}>
        {getFieldDecorator('longDescription', {
          rules: [
            {
              required: false,
              message: 'Please enter a detailed description',
            },
          ],
          initialValue: formValues ? formValues.longDescription : '',
        })(
          <ReactQuill
            modules={editorModules}
            formats={editorFormats}
            placeholder="Description"
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout}>
        {getFieldDecorator('additionalInfo', {
          rules: [
            {
              required: false,
              message: 'Please enter additional info (optional)',
            },
          ],
          initialValue: formValues ? formValues.additionalInfo : null,
        })(<Input placeholder="Additional Info" />)}
      </FormItem>

      <FormItem {...formItemLayout}>
        <h4>{`Images (${images.length})`}</h4>
        <Slider settings={sliderSettings}>
          {images &&
            images.length > 0 &&
            images.map((image) => (
              <div
                key={image}
                style={{
                  height: 180,
                  margin: '0 auto',
                }}
              >
                <img
                  alt={form.title}
                  src={image}
                  style={{ margin: '0 auto', height: 180 }}
                />
              </div>
            ))}
        </Slider>

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
        {...formItemLayout}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={isButtonDisabled}
          style={{ float: 'right' }}
        >
          {buttonLabel}
        </Button>
      </FormItem>
    </Form>
  );
}

const thumbStyle = (backgroundImage) => ({
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: 4,
  border: '1px solid #fff',
});

const thumbIconStyle = {
  float: 'right',
  margin: 2,
  padding: 4,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, .8)',
  cursor: 'pointer',
};

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  const onRemoveClick = (event) => {
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
