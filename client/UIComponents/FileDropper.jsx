import React from 'react';
import Dropzone from 'react-dropzone';
import { Button } from 'antd/lib';

const FileDropper = ({
  setUploadableImage,
  uploadableImageLocal,
  imageUrl,
  label,
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
              width: 120,
              height: 80,
              margin: 8,
              backgroundColor: isDragActive ? '#ea3924' : '#eee',
              borderStyle: 'dashed',
              cursor: 'hover'
            }}
          >
            {uploadableImageLocal || imageUrl ? (
              <img
                src={uploadableImageLocal || imageUrl}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <Button
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  margin: '24px auto',
                  border: 'none'
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
