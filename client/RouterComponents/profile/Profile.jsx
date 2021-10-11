import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
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
  Switch,
} from 'antd';

import SkogenTerms from '../../UIComponents/SkogenTerms';
import UploadAvatar from '../../UIComponents/UploadAvatar';

const FormItem = Form.Item;

const h3Style = {
  textAlign: 'center',
  marginBottom: 12,
};

function Profile(props) {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);

  const handleSubmit = (fieldsValue) => {
    Meteor.call('saveUserInfo', fieldsValue, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      } else {
        message.success('Your data is successfully saved');
      }
    });
  };

  const deleteAccount = () => {
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

  const { currentUser } = props;

  if (!currentUser) {
    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col md={10}>
            <SkogenTerms />
          </Col>
        </Row>
      </div>
    );
  }

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
        <Col md={8} />
        <Col md={8}>
          <h3 style={h3Style}>Avatar</h3>
          <UploadAvatar currentUser={currentUser} />
          <Divider />
          <h3 style={h3Style}>Personal Info</h3>
          {currentUser && (
            <Form layout="vertical" onFinish={handleSubmit}>
              <FormItem
                label="First name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your first name',
                  },
                ]}
                initialValue={currentUser.firstName || null}
              >
                <Input placeholder="first name" />
              </FormItem>

              <FormItem
                label="Last name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your last name',
                  },
                ]}
                initialValue={currentUser.lastName || null}
              >
                <Input placeholder="last name" />
              </FormItem>

              <FormItem
                label="Make my profile public"
                name="isPublic"
                initialValue={false}
              >
                <Switch />
              </FormItem>

              <FormItem
                label="Contact info"
                name="contactInfo"
                rules={[
                  {
                    required: false,
                  },
                ]}
                initialValue={currentUser.contactInfo || ''}
              >
                <ReactQuill modules={editorModules} formats={editorFormats} />
              </FormItem>

              <FormItem
                label="Skogen & Me"
                name="skogenAndMe"
                rules={[
                  {
                    required: false,
                  },
                ]}
                initialValue={currentUser.skogenAndMe || ''}
              >
                <ReactQuill modules={editorModules} formats={editorFormats} />
              </FormItem>

              <FormItem
                label="What I like to share with the community"
                name="forCommunity"
                rules={[
                  {
                    required: false,
                  },
                ]}
                initialValue={currentUser.forCommunity || ''}
              >
                <ReactQuill modules={editorModules} formats={editorFormats} />
              </FormItem>

              <FormItem
                label="I'm interested in..."
                name="interestedIn"
                rules={[
                  {
                    required: false,
                  },
                ]}
                initialValue={currentUser.interestedIn || ''}
              >
                <ReactQuill modules={editorModules} formats={editorFormats} />
              </FormItem>

              <FormItem>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </div>
              </FormItem>
            </Form>
          )}

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => setIsDeleteModalOn(true)}
              style={{ color: 'red' }}
            >
              Delete Account
            </Button>
          </div>
          <Divider />
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
        onOk={deleteAccount}
        onCancel={() => setIsDeleteModalOn(false)}
        visible={isDeleteModalOn}
      >
        <p>
          You are about to permanently delete your user information. This is an
          irreversible action.
        </p>
      </Modal>
    </div>
  );
}

export default Profile;
