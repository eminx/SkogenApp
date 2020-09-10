import React from 'react';
import {
  Box,
  Button,
  TextInput,
  TextArea,
  Text,
  FormField,
  Form,
  Select
} from 'grommet';
import { Close } from 'grommet-icons';
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

// import FileDropper from '../UIComponents/FileDropper';
// import NiceSlider from '../UIComponents/NiceSlider';
import { editorFormats, editorModules } from '../constants/quillConfig';

const WorkForm = ({
  formValues,
  onFormChange,
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
}) => {
  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <FormField label="Title" margin={{ bottom: 'medium', top: 'medium' }}>
          <TextInput
            plain={false}
            name="title"
            placeholder="Mango Juice in Bottles..."
          />
        </FormField>

        <FormField
          label="Short description"
          margin={{ bottom: 'medium', top: 'medium' }}
        >
          <TextArea
            plain={false}
            name="shortDescription"
            placeholder="Sweet, Natural & Refreshing"
          />
        </FormField>

        <FormItem>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: 'Please enter a title'
              }
            ],
            initialValue: work && work.title ? work.title : ''
          })(<Input placeholder="Title" />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('subTitle', {
            rules: [
              {
                required: true,
                message: 'Please enter a subtitle'
              }
            ],
            initialValue: work && work.subTitle ? work.subTitle : ''
          })(<Input placeholder="Subtitle" />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please enter a detailed description'
              }
            ],
            initialValue: work ? work.description : null
          })(
            <ReactQuill
              modules={editorModules}
              formats={editorFormats}
              value={formValues.longDescription}
              onChange={onQuillChange}
              placeholder="This artwork is about..."
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('additionalInfo', {
            rules: [
              {
                required: true,
                message: 'Please enter a subtitle (typically artists name)'
              }
            ],
            initialValue: work && work.additionalInfo ? work.additionalInfo : ''
          })(<TextArea name="additionalInfo" placeholder="Additional info" />)}
        </FormItem>

        <FormItem>
          {images && <NiceSlider images={images} />}

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
      </Form>
    </div>
  );
};

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
      <Close
        color="dark-1"
        size="small"
        style={thumbIconStyle}
        onClick={onRemoveClick}
      />
    </div>
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Box direction="row" justify="center" wrap>
      {children}
    </Box>
  );
});

export default WorkForm;
