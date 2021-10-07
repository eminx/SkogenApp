import React, { PureComponent } from 'react';
import { Avatar, Button, message } from 'antd';

import FileDropper from './FileDropper';
import Loader from './Loader';
import { call, resizeImage, uploadImage } from '../functions';
import { Fragment } from 'react';

class UploadAvatar extends PureComponent {
  state = {
    uploadableAvatarLocal: null,
    uploadableAvatar: null,
    isLocalising: false,
  };

  setUploadableAvatar = (files) => {
    this.setState({
      isLocalising: true,
    });

    const uploadableAvatar = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableAvatar);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableAvatar,
          uploadableAvatarLocal: reader.result,
          isLocalising: false,
        });
      },
      false
    );
  };

  uploadAvatar = async () => {
    const { uploadableAvatar } = this.state;
    this.setState({
      isUploading: true,
    });

    try {
      const resizedAvatar = await resizeImage(uploadableAvatar, 300);
      const uploadedAvatar = await uploadImage(
        resizedAvatar,
        'avatarImageUpload'
      );
      await call('setAvatar', uploadedAvatar);
      this.setState({
        isUploading: false,
      });
      message.success('Your avatar is successfully set');
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isUploading: false,
        isError: true,
      });
    }
  };

  removeLocalAvatar = () => {
    this.setState({
      uploadableAvatar: null,
      uploadableAvatarLocal: null,
    });
  };

  render() {
    const { uploadableAvatarLocal, isUploading } = this.state;
    const { currentUser } = this.props;

    if (!currentUser) {
      return null;
    }

    const props = {
      setUploadableAvatar: this.setUploadableAvatar,
      removeLocalAvatar: this.removeLocalAvatar,
      uploadAvatar: this.uploadAvatar,
      uploadableAvatarLocal,
      avatar: currentUser.avatar || null,
      isUploading,
    };

    return <AvatarUI {...props} />;
  }
}

const avatarHolderStyle = {
  marginBottom: 24,
  width: 120,
  height: 120,
};

function AvatarUI({
  setUploadableAvatar,
  removeLocalAvatar,
  uploadAvatar,
  uploadableAvatarLocal,
  avatar,
  isUploading,
}) {
  const avatarImageIfAny = uploadableAvatarLocal || (avatar && avatar.src);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 24,
      }}
    >
      <div style={avatarHolderStyle}>
        <FileDropper
          imageUrl={avatarImageIfAny}
          label="Click/Drag your favourite image to upload avatar"
          round
          setUploadableImage={setUploadableAvatar}
        />
      </div>
      {(uploadableAvatarLocal || avatar) && (
        <Fragment>
          <Button
            onClick={() => removeLocalAvatar()}
            color="status-critical"
            style={{ marginBottom: 24 }}
          >
            Remove
          </Button>

          <Button
            onClick={() => uploadAvatar()}
            disabled={isUploading}
            style={{ marginBottom: 24 }}
          >
            Confirm & Upload
          </Button>
        </Fragment>
      )}
      {isUploading && <Loader />}
    </div>
  );
}

export default UploadAvatar;
