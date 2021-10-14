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
  Typography,
} from 'antd';

import UploadAvatar from '../../UIComponents/UploadAvatar';

const FormItem = Form.Item;
const { Search } = Input;
const { Text, Title } = Typography;

const noBottomMargin = {
  marginBottom: 0,
};

function Profile(props) {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    getKeywords();
  }, []);

  const getKeywords = () => {
    if (!props.currentUser) {
      return;
    }
    Meteor.call('getKeywords', (error, respond) => {
      if (error) {
        message.error('cannot get keywords');
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

  const handleKeywordAssign = () => {
    if (keywordInput.length < 4) {
      message.error('Minimum 4 letters required');
      return;
    }
    if (keywordExists) {
      Meteor.call('assignKeyword', keywordInput, (error, respond) => {
        if (error) {
          message.error(error.error);
          return;
        }
        message.success('The keyword is assigned to you');
      });
    } else {
      Meteor.call('createAndAssignKeyword', keywordInput, (error, respond) => {
        if (error) {
          message.error(error.error);
          return;
        }
        message.success('A new keyword is created and assigned to you');
      });
    }
    getKeywords();
    setKeywordInput('');
  };

  const onRemoveKeyword = (item) => {
    Meteor.call('removeKeyword', item, (error, respond) => {
      if (error) {
        message.error(error.error);
        return;
      }
      message.success(
        'Yoi have successfully removed the keyword from your profile'
      );
    });
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
      </div>
    );
  }

  const myKeywords = currentUser.keywords;
  const myKeywordsStr = myKeywords ? myKeywords.map((item) => item.label) : [];
  const keywordsWithoutMine =
    keywords &&
    myKeywordsStr &&
    keywords.filter((kw) => !myKeywordsStr.includes(kw.value));

  return (
    <div style={{ padding: 24, minHeight: '80vh' }}>
      <Row gutter={24}>
        <Col md={8}>
          <Blaze template="loginButtons" />
        </Col>
      </Row>
      <Divider />

      <Row>
        <Col md={12}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={24}>
              <Col md={16}>
                <FormItem
                  label={
                    <Title style={noBottomMargin} level={4}>
                      First name
                    </Title>
                  }
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
                  label={
                    <Title style={noBottomMargin} level={4}>
                      Last name
                    </Title>
                  }
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
              </Col>

              <Col md={8}>
                <Title level={4} style={{ textAlign: 'center' }}>
                  Profile Picture
                </Title>
                <UploadAvatar currentUser={currentUser} />
              </Col>
            </Row>

            <FormItem>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </FormItem>

            <Divider />

            <FormItem
              initialValue={currentUser.isPublic || false}
              label={
                <Title style={noBottomMargin} level={4}>
                  Make my profile public
                </Title>
              }
              name="isPublic"
              valuePropName="checked"
            >
              <Switch />
            </FormItem>

            <FormItem
              label={
                <Title style={noBottomMargin} level={4}>
                  Contact info
                </Title>
              }
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
              label={
                <Title style={noBottomMargin} level={4}>
                  Skogen & Me
                </Title>
              }
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
              label={
                <Title style={noBottomMargin} level={4}>
                  What I like to share with the community
                </Title>
              }
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
              label={
                <Title style={noBottomMargin} level={4}>
                  I'm interested in...
                </Title>
              }
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

          <Divider />

          <Title style={noBottomMargin} level={4}>
            Keywords
          </Title>
          <Text>People can use keywords to filter and find profiles</Text>
          <AutoComplete
            options={keywordsWithoutMine}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onSelect={(data) => setKeywordInput(data)}
            style={{ width: '100%' }}
          >
            <Search
              placeholder="add keyword"
              enterButton={keywordExists ? 'Assign' : 'Create'}
              size="large"
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              onSearch={handleKeywordAssign}
            />
          </AutoComplete>

          <div>
            {myKeywords &&
              myKeywords.map((item) => (
                <Tag
                  closable
                  color="purple"
                  key={item.id}
                  style={{ marginTop: 8, marginRight: 8 }}
                  onClose={() => onRemoveKeyword(item)}
                >
                  <b>{item.label}</b>
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
