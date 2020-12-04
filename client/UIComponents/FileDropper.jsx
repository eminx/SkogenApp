import React from 'react';
import Dropzone from 'react-dropzone';

const FileDropper = ({
  setUploadableImage,
  uploadableImageLocal,
  imageUrl,
  label,
  ...otherProps
}) => {
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          background={isDragActive ? 'dark-3' : 'white'}
          width="medium"
          height="small"
          border={{ style: 'dashed', size: 'medium' }}
          {...otherProps}
        >
          {uploadableImageLocal || imageUrl ? (
            <img
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <button
              plain
              hoverIndicator="light-1"
              label={
                label ||
                'Drop an image or images; or alternatively click to open the file picker'
              }
            />
          )}
          <input {...getInputProps()} />
        </div>
      )}
    </Dropzone>
  );
};

export default FileDropper;
