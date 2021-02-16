import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert } from 'antd';

import CreatePageForm from '../../UIComponents/CreatePageForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import PagesList from '../../UIComponents/PagesList';

import { parseTitle } from '../../functions';

const successCreation = () => {
  message.success('New page is successfully created', 6);
};

class NewPage extends React.Component {
  state = {
    modalConfirm: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newPageId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
  };

  registerPageLocally = (values) => {
    values.authorName = this.props.currentUser.username || 'emowtf';
    this.setState({
      values: values,
      modalConfirm: true,
    });
  };

  createPage = () => {
    const { currentUser } = this.props;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return false;
    }
    this.setState({ isLoading: true });

    const { values } = this.state;

    Meteor.call('createPage', values, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true,
        });
        return;
      }
      this.setState({
        isLoading: false,
        newPageId: parseTitle(result),
        isSuccess: true,
      });
    });
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  render() {
    const { currentUser, pageTitles, history } = this.props;

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to be super admin to create a static page."
            type="error"
          />
        </div>
      );
    }

    const {
      modalConfirm,
      values,
      isLoading,
      isSuccess,
      newPageId,
      uploadableImage,
      uploadableImageLocal,
    } = this.state;

    isSuccess ? successCreation() : null;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={48}>
          <Col md={8}>
            <PagesList
              pageTitles={pageTitles}
              activePageTitle={''}
              history={history}
            />
          </Col>
          <Col xs={24} sm={24} md={16}>
            <h2>Create a Page</h2>
            <CreatePageForm
              pageTitles={pageTitles}
              values={values}
              registerPageLocally={this.registerPageLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={uploadableImage}
            />
          </Col>
        </Row>

        {modalConfirm ? (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            imageSrc={uploadableImageLocal}
            visible={modalConfirm}
            onOk={this.createPage}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
            maskClosable={false}
            closable={!isLoading}
            okButtonProps={{ loading: isLoading }}
            cancelButtonProps={{ disabled: isLoading }}
          />
        ) : null}

        {isSuccess ? <Redirect to={`/page/${newPageId}`} /> : null}
      </div>
    );
  }
}

export default NewPage;
