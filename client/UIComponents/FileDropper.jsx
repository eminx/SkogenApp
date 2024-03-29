import React from 'react';
import Dropzone from 'react-dropzone';
import { Button } from 'antd';

const containerStyle = {
  width: 120,
  height: 120,
  borderStyle: 'dashed',
  borderColor: '#921bef',
  cursor: 'hover',
  textAlign: 'center',
};

const FileDropper = ({
  imageUrl,
  round = false,
  width,
  setUploadableImage,
  uploadableImageLocal,
  ...otherProps
}) => {
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => {
        return (
          <div
            {...otherProps}
            {...getRootProps()}
            style={{
              ...containerStyle,
              backgroundColor: isDragActive ? '#921bef' : '#fbd5d0',
              borderRadius: round ? '50%' : '0',
              overflow: round ? 'hidden' : 'inherit',
              width: width || containerStyle.width,
            }}
          >
            {uploadableImageLocal || imageUrl ? (
              <img
                src={uploadableImageLocal || imageUrl}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Button
                style={{
                  backgroundColor: 'transparent',
                  margin: '24px auto',
                  border: 'none',
                }}
              >
                Choose
              </Button>
            )}
            <input {...getInputProps()} htmlType="file" />
          </div>
        );
      }}
    </Dropzone>
  );
};

export default FileDropper;
