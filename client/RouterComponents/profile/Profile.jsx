import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import {
  AutoComplete,
  Button,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  Tag,
  Typography,
  message,
} from 'antd/lib';

import { editorFormats, editorModules } from '../../themes/skogen';
import UploadAvatar from '../../UIComponents/UploadAvatar';
import { call, resizeImage, uploadImage } from '../../functions';
import FileDropper from '../../UIComponents/FileDropper';

const FormItem = Form.Item;
const { Search } = Input;
const { Text, Title } = Typography;

const noBottomMargin = {
  marginBottom: 0,
};

class Profile extends PureComponent {
  state = {
    currentUser: null,
    isDeleteModalOn: false,
    isImagesEdited: false,
    keywordInput: '',
    keywords: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
  };

  componentDidMount() {
    const currentUser = Meteor.user();
    this.setState({ currentUser }, this.getKeywords);
  }

  getKeywords = async () => {
    try {
      const allKeywords = await call('getKeywords');
      this.setState({
        keywords: allKeywords.sort((a, b) => {
          return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        }),
      });
    } catch (error) {
      message.error(error.error);
    }
  };

  handleSubmit = (fieldsValue) => {
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

  handleKeywordAssign = () => {
    const keywordExists = keywords.find(
      (item) => item.value === keywordInput.toLowerCase()
    );

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

  onRemoveKeyword = (item) => {
    Meteor.call('removeKeyword', item, (error, respond) => {
      if (error) {
        message.error(error.error);
        return;
      }
      message.success(
        'You have successfully removed the keyword from your profile'
      );
    });
  };

  handleSelectImages = (files) => {
    files.forEach((uploadableImage, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
            uploadableImages: [...uploadableImages, uploadableImage],
            uploadableImagesLocal: [...uploadableImagesLocal, reader.result],
            isImagesEdited: true,
          }));
        },
        false
      );
    });
  };

  handleSortImages = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: arrayMove(uploadableImages, oldIndex, newIndex),
      uploadableImagesLocal: arrayMove(
        uploadableImagesLocal,
        oldIndex,
        newIndex
      ),
      isImagesEdited: true,
    }));
  };

  uploadImages = async () => {
    const { uploadableImages } = this.state;

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage, index) => {
          const resizedImage = await resizeImage(uploadableImage, 1200);
          const uploadedImage = await uploadImage(
            resizedImage,
            'profileImageUpload'
          );
          return uploadedImage;
        })
      );
      this.saveUploadedImages(imagesReadyToSave);
    } catch (error) {
      console.log(error);
      message.error(error.reason);
      this.setState({
        isError: true,
      });
    }
  };

  saveUploadedImages = (imagesReadyToSave) => {
    try {
      call('saveProfileImages', imagesReadyToSave);
      message.success('Images are successfully saved');
      this.setState({
        isImagesEdited: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.error);
    }
  };

  render() {
    const {
      currentUser,
      keywordInput,
      isImagesEdited,
      isDeleteModalOn,
      uploadableImages,
      uploadableImagesLocal,
      keywords,
    } = this.state;

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

    const keywordExists = keywords.find(
      (item) => item.value === keywordInput.toLowerCase()
    );
    const myKeywords = currentUser.keywords;
    const myKeywordsStr = myKeywords
      ? myKeywords.map((item) => item.label)
      : [];
    const keywordsWithoutMine =
      keywords &&
      myKeywordsStr &&
      keywords.filter((kw) => !myKeywordsStr.includes(kw.value));

    const images = uploadableImagesLocal;
    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
        <Divider />

        <Row>
          <Col md={8}>
            <Form layout="vertical" onFinish={this.handleSubmit}>
              <Row gutter={24}>
                <Col md={12}>
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

                  <FormItem>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </div>
                  </FormItem>
                </Col>

                <Col md={12}>
                  <Title level={4} style={{ textAlign: 'center' }}>
                    Profile Picture
                  </Title>
                  <UploadAvatar currentUser={currentUser} />
                </Col>
              </Row>

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
              onSelect={(data) => this.setState({ keywordInput: data })}
              style={{ width: '100%' }}
            >
              <Search
                placeholder="add keyword"
                enterButton={keywordExists ? 'Assign' : 'Create'}
                size="large"
                value={keywordInput}
                onChange={(event) =>
                  this.setState({ keywordInput: event.target.value })
                }
                onSearch={this.handleKeywordAssign}
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
                    onClose={() => this.onRemoveKeyword(item)}
                  >
                    <b>{item.label}</b>
                  </Tag>
                ))}
            </div>
            <Divider />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => this.setState({ isDeleteModalOn: true })}
                style={{ color: 'red' }}
              >
                Delete Account
              </Button>
            </div>
            <Divider />
          </Col>

          <Col md={16}>
            <Row justify="center">
              <div style={{ minWidth: 300 }}>
                <Title level={4} style={{ textAlign: 'center' }}>
                  Images
                </Title>
                <Carousel autoplay>
                  {images &&
                    images.length > 0 &&
                    images.map((image) => (
                      <div
                        key={image}
                        style={{
                          height: 300,
                          margin: '0 auto',
                        }}
                      >
                        <img
                          src={image}
                          style={{ margin: '0 auto', height: 300 }}
                        />
                      </div>
                    ))}
                </Carousel>

                <div style={{ padding: 24 }}>
                  {images && images.length > 0 ? (
                    <SortableContainer
                      onSortEnd={this.handleSortImages}
                      axis="xy"
                      helperClass="sortableHelper"
                    >
                      {images.map((image, index) => (
                        <SortableItem
                          key={image}
                          index={index}
                          image={image}
                          onRemoveImage={() => this.onRemoveImage(index)}
                        />
                      ))}

                      <FileDropper
                        setUploadableImage={this.handleSelectImages}
                      />
                    </SortableContainer>
                  ) : (
                    <FileDropper
                      width={300}
                      setUploadableImage={this.handleSelectImages}
                    />
                  )}
                </div>
              </div>
            </Row>
            <Row justify="center">
              <Button disabled={!isImagesEdited} onClick={this.uploadImages}>
                Save
              </Button>
            </Row>
          </Col>
        </Row>

        <Divider />

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

const thumbStyle = (backgroundImage) => ({
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: 4,
  border: '1px solid #fff',
});

const thumbIconStyle = {
  float: 'right',
  margin: 2,
  padding: 4,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, .8)',
  cursor: 'pointer',
};

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  const onRemoveClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onRemoveImage();
  };

  return (
    <div key={image} className="sortable-thumb" style={thumbStyle(image)}>
      <div
        color="dark-1"
        size="small"
        style={thumbIconStyle}
        onClick={onRemoveClick}
      />
    </div>
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', wrap: 'wrap' }}>
      {children}
    </div>
  );
});

export default Profile;
