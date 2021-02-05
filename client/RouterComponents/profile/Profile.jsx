import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../../themes/skogen';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Divider,
  Modal,
} from 'antd/lib';

import SkogenTerms from '../../UIComponents/SkogenTerms';
import UploadAvatar from '../../UIComponents/UploadAvatar';

const FormItem = Form.Item;
import Loader from '../../UIComponents/Loader';

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
  };

  handleSubmit = (fieldsValue) => {
    Meteor.call('saveUserInfo', fieldsValue, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
      message.success('Your data is successfully saved');
    });
  };

  deleteAccount = () => {
    Meteor.call('deleteAccount', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  render() {
    const { currentUser } = this.props;
    const { isDeleteModalOn } = this.state;

    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
        <Divider />
        <h2>Profile</h2>
        <Row>
          <Col md={8}>
            <h3>Personal Info</h3>
            {currentUser && (
              <Form onFinish={this.handleSubmit}>
                <FormItem
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your first name',
                    },
                  ]}
                  initialValue={currentUser ? currentUser.firstName : null}
                >
                  <Input placeholder="first name" />
                </FormItem>

                <FormItem
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your last name',
                    },
                  ]}
                  initialValue={currentUser ? currentUser.lastName : null}
                >
                  <Input placeholder="last name" />
                </FormItem>

                <FormItem
                  name="bio"
                  rules={[
                    {
                      required: false,
                      message: 'Enter your bio',
                    },
                  ]}
                  initialValue={(currentUser && currentUser.bio) || ''}
                >
                  <ReactQuill modules={editorModules} formats={editorFormats} />
                </FormItem>

                <FormItem
                  wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 0 },
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </FormItem>
              </Form>
            )}
            <Divider />

            {currentUser && (
              <div>
                <Button
                  onClick={() => this.setState({ isDeleteModalOn: true })}
                  style={{ color: 'red' }}
                >
                  Delete Account
                </Button>
                <Divider />
              </div>
            )}
          </Col>

          <Col md={6} style={{ paddingeLeft: 12, textAlign: 'center' }}>
            <h3>Avatar</h3>
            <UploadAvatar currentUser={currentUser} />
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col md={10}>
            <SkogenTerms />
          </Col>
        </Row>

        <Modal
          title="Are you sure?"
          okText="Confirm Deletion"
          onOk={this.deleteAccount}
          onCancel={() => this.setState({ isDeleteModalOn: false })}
          visible={isDeleteModalOn}
        >
          <p>
            You are about to permanently delete your user information. This is
            an irreversible action.
          </p>
        </Modal>
      </div>
    );
  }
}

export default Profile;
