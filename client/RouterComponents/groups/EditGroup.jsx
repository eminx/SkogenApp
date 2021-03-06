import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, message, Alert, Modal, Button, Affix } from 'antd';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import Resizer from 'react-image-file-resizer';

import CreateGroupForm from '../../UIComponents/CreateGroupForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { dataURLtoFile } from '../../functions';

const successCreation = () =>
  message.success('Your group is successfully updated', 6);

const successDelete = () =>
  message.success('The group is successfully deleted', 4);

const sideNote = 'This page is dedicated to create groups at Skogen.';

const resizedImageWidth = 900;

class EditGroup extends React.Component {
  state = {
    modalConfirm: false,
    isDeleteModalOn: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newGroupId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
  };

  registerGroupLocally = (values) => {
    values.authorName = this.props.currentUser.username || 'emo';
    this.setState({
      values: values,
      modalConfirm: true,
    });
  };

  setUploadableImage = (e) => {
    const theImageFile = e.file.originFileObj;

    Resizer.imageFileResizer(
      theImageFile,
      resizedImageWidth,
      (resizedImageWidth * theImageFile.height) / theImageFile.width,
      'JPEG',
      95,
      0,
      (uri) => {
        this.setState({
          uploadableImage: dataURLtoFile(uri, theImageFile.name),
          uploadableImageLocal: uri,
        });
      },
      'base64'
    );
  };

  uploadImage = () => {
    this.setState({ isLoading: true });
    const { uploadableImage } = this.state;

    if (uploadableImage === null) {
      console.log('no uploadable image');
      this.updateGroup();
      return;
    }

    const upload = new Slingshot.Upload('groupImageUpload');
    const timeStamp = Math.floor(Date.now());

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState({
          uploadedImage: downloadUrl,
        });
        this.updateGroup(downloadUrl);
      }
    });
  };

  updateGroup = () => {
    const { values, uploadedImage } = this.state;
    const { groupData } = this.props;
    const imageUrl = uploadedImage || groupData.imageUrl;

    Meteor.call(
      'updateGroup',
      groupData._id,
      values,
      imageUrl,
      (error, result) => {
        if (error) {
          this.setState({
            isLoading: false,
            isError: true,
          });
        } else {
          this.setState({
            isLoading: false,
            newGroupId: result,
            isSuccess: true,
          });
        }
      }
    );
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deleteGroup = () => {
    const groupId = this.props.groupData._id;
    Meteor.call('deleteGroup', groupId, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true,
        });
      } else {
        successDelete();
        this.setState({
          isLoading: false,
          isSuccess: true,
        });
      }
    });
  };

  render() {
    if (!this.props.currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a registered member to create a group."
            type="error"
          />
        </div>
      );
    }

    const {
      modalConfirm,
      isDeleteModalOn,
      values,
      isLoading,
      isSuccess,
      newGroupId,
      uploadedImage,
      uploadableImage,
      uploadableImageLocal,
    } = this.state;

    if (isSuccess && newGroupId) {
      successCreation();
      return <Redirect to={`/group/${newGroupId}`} />;
    } else if (isSuccess) {
      return <Redirect to="/groups" />;
    }

    const { groupData, currentUser } = this.props;

    return (
      <div style={{ padding: 24 }}>
        {groupData && (
          <div style={{ marginBottom: 12 }}>
            <Link to={`/group/${groupData._id}`}>
              <Button icon={<LeftOutlined />}>{groupData.title}</Button>
            </Link>
          </div>
        )}

        <h2>Edit your Group</h2>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            {groupData && currentUser && groupData.adminId === currentUser._id && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: 12,
                }}
              >
                <Button onClick={this.showDeleteModal}>Delete</Button>
              </div>
            )}

            <CreateGroupForm
              values={values}
              groupData={groupData}
              registerGroupLocally={this.registerGroupLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={
                (groupData && groupData.imageUrl) || uploadableImage
              }
            />
          </Col>
        </Row>
        {modalConfirm && (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            visible={modalConfirm}
            onOk={this.uploadImage}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        )}

        <Modal
          title="Confirm"
          visible={isDeleteModalOn}
          onOk={this.deleteGroup}
          onCancel={this.hideDeleteModal}
          okText="Yes, delete"
          cancelText="Cancel"
        >
          Are you sure you want to delete this group?
        </Modal>
      </div>
    );
  }
}

export default EditGroup;
