import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../../themes/skogen';

import {
  AutoComplete,
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Divider,
  Modal,
  Switch,
  Tag,
} from 'antd';

import SkogenTerms from '../../UIComponents/SkogenTerms';
import UploadAvatar from '../../UIComponents/UploadAvatar';

const FormItem = Form.Item;
const { Search } = Input;
const h3Style = {
  textAlign: 'center',
  marginBottom: 12,
};

function Profile(props) {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    getKeywords();
  });

  const getKeywords = () => {
    Meteor.call('getKeywords', (error, respond) => {
      if (error) {
        message.error('getKeywords');
        return;
      }
      setKeywords(respond);
    });
  };

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

  const keywordExists = keywords.find(
    (item) => item.value === keywordInput.toLowerCase()
  );

  const onKeywordSelect = (data) => {
    Meteor.call('assignKeyword', data, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
      message.success('The keyword is assigned to you');
    });
    setKeywordInput('');
  };

  const onKeywordCreate = () => {
    if (keywordExists) {
      Meteor.call('assignKeyword', keywordInput, (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
          return;
        }
        message.success('The keyword is assigned to you');
      });
    } else {
      Meteor.call('createAndAssignKeyword', keywordInput, (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
          return;
        }
        message.success('A new keyword is created and assigned to you');
      });
    }
    setKeywordInput('');
  };

  const onRemoveKeyword = (data) => {
    console.log(data);
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
                initialValue={currentUser.isPublic || false}
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

          <AutoComplete
            options={keywords}
            style={{
              width: '100%  ',
            }}
            onSelect={onKeywordSelect}
          >
            <Search
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="add keyword"
              allowClear
              enterButton={keywordExists ? 'Select' : 'Create'}
              onSearch={onKeywordCreate}
              size="large"
            />
          </AutoComplete>

          <div>
            {keywords.map((item) => (
              <Tag
                closable
                color="geekblue"
                key={item._id}
                style={{ marginTop: 8, marginRight: 8 }}
                onClose={() => onRemoveKeyword(item)}
              >
                {item.value}
              </Tag>
            ))}
          </div>
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
