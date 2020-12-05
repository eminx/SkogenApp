import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import ReactDropzone from 'react-dropzone';
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
  Modal
} from 'antd/lib';
const TextArea = Input.TextArea;
import SkogenTerms from '../../UIComponents/SkogenTerms';
const FormItem = Form.Item;
import NiceList from '../../UIComponents/NiceList';
import Loader from '../../UIComponents/Loader';

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false
    // isAddWorkModalOn: false,
    // workTitle: '',
    // workShortDescription: '',
    // workDescription: '',
    // isUploading: false,
    // imageUrl: null
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }
      const values = {
        firstName: fieldsValue['firstName'],
        lastName: fieldsValue['lastName']
        // bio: fieldsValue['bio']
      };

      Meteor.call('saveUserInfo', values, (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
        } else {
          message.success('Your data is successfully saved');
        }
      });
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
    // message.success('Your account is successfully deleted from our database');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  render() {
    const { isUploading, imageUrl } = this.state;
    const { currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isDeleteModalOn } = this.state;

    const formItemStyle = {
      marginBottom: 24
    };

    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
        <Row>
          <Divider />
          <Col md={8}>
            <h2>Personal Info</h2>
            {currentUser && (
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter your first name'
                      }
                    ],
                    initialValue: currentUser ? currentUser.firstName : null
                  })(<Input placeholder="first name" />)}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('lastName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter your last name'
                      }
                    ],
                    initialValue: currentUser ? currentUser.lastName : null
                  })(<Input placeholder="last name" />)}
                </FormItem>

                <FormItem
                  wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 0 }
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

          <Col md={4} />
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

export default Form.create()(Profile);
