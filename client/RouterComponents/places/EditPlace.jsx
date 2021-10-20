import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import arrayMove from 'array-move';
import { Alert, Button, Col, Modal, message, Row } from 'antd';

import WorkForm from '../../UIComponents/WorkForm';
import { call, resizeImage, uploadImage } from '../../functions';

class EditPlace extends PureComponent {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      additionalInfo: '',
      category: '',
    },
    categories: [],
    images: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDeleteModalOn: false,
  };

  componentDidMount() {
    this.getPlace();
    this.getCategories();
  }

  getCategories = async () => {
    const categories = await call('getCategories');
    this.setState({
      categories,
    });
  };

  getPlace = async () => {
    this.setState({ isLoading: true });
    const { match } = this.props;
    const { id } = match.params;

    try {
      const response = await call('getPlace', id);
      const catLabel =
        response.category &&
        response.category.label &&
        response.category.label.toUpperCase();
      this.setState({
        formValues: {
          ...response,
          category: catLabel,
        },
        images: response.images.map((image) => ({
          src: image,
          type: 'uploaded',
        })),
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
      this.setState({
        isLoading: false,
      });
    }
  };

  registerPlaceLocally = (formValues) => {
    this.setState(
      {
        isCreating: true,
        formValues,
      },
      () => this.uploadImages()
    );
  };

  setUploadableImages = (files) => {
    this.setState({
      isLocalising: true,
    });

    files.forEach((uploadableImage, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          this.setState(({ images }) => ({
            images: [
              ...images,
              {
                resizableData: uploadableImage,
                type: 'not-uploaded',
                src: reader.result,
              },
            ],
          }));
        },
        false
      );
      if (files.length === index + 1) {
        this.setState({
          isLocalising: false,
        });
      }
    });
  };

  uploadImages = async () => {
    const { images } = this.state;
    this.setState({
      isCreating: true,
    });

    const isThereUploadable = images.some(
      (image) => image.type === 'not-uploaded'
    );
    if (!isThereUploadable) {
      const imagesReadyToSave = images.map((image) => image.src);
      this.updatePlace(imagesReadyToSave);
      return;
    }

    try {
      const imagesReadyToSave = await Promise.all(
        images.map(async (uploadableImage, index) => {
          if (uploadableImage.type === 'uploaded') {
            return uploadableImage.src;
          } else {
            const resizedImage = await resizeImage(
              uploadableImage.resizableData,
              1200
            );
            const uploadedImage = await uploadImage(
              resizedImage,
              'workImageUpload'
            );
            return uploadedImage;
          }
        })
      );
      this.updatePlace(imagesReadyToSave);
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isError: true,
      });
    }
  };

  updatePlace = async (imagesReadyToSave) => {
    const { match } = this.props;
    const { id, username } = match.params;
    const { formValues, categories } = this.state;
    const currentUser = Meteor.user();
    if (username !== currentUser.username) {
      message.error('You are not allowed');
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.label === formValues.category.toLowerCase()
    );

    const updatedValues = {
      ...formValues,
      category: {
        label: selectedCategory.label,
        color: selectedCategory.color,
        categoryId: selectedCategory._id,
      },
    };

    try {
      await call('updatePlace', id, updatedValues, imagesReadyToSave);
      this.setState({
        isCreating: false,
        isSuccess: true,
      });
      message.success('Place is successfully updated');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isCreating: false });
    }
  };

  handleRemoveImage = (imageIndex) => {
    this.setState(({ images }) => ({
      images: images.filter((image, index) => imageIndex !== index),
      // unSavedImageChange: true,
    }));
  };

  handleSortImages = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ images }) => ({
      images: arrayMove(images, oldIndex, newIndex),
      // unSavedImageChange: true,
    }));
  };

  handleDeletePlace = async () => {
    const { match, history } = this.props;
    const { id } = match.params;
    const currentUser = Meteor.user();

    if (!currentUser || !currentUser.isSuperAdmin) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      await call('deletePlace', id);
      this.setState({
        isLoading: false,
      });
      history.push('/places');
      message.success('Place is successfully deleted');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isLoading: false });
    }
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  render() {
    const { match } = this.props;
    const { id } = match.params;
    const currentUser = Meteor.user();

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '24px auto' }}>
          <Alert message="Not allowed" type="error" />
        </div>
      );
    }

    const {
      formValues,
      images,
      isSuccess,
      isCreating,
      categories,
      isDeleteModalOn,
    } = this.state;

    if (isSuccess) {
      return <Redirect to={`/place/${id}`} />;
    }

    const buttonLabel = isCreating ? 'Updating...' : 'Confirm and Update';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3;

    return (
      <Row style={{ padding: 24 }}>
        <Col lg={6} />
        <Col lg={12}>
          <h3 style={{ marginBottom: 24 }}>Update </h3>
          <WorkForm
            formValues={formValues}
            categories={categories}
            images={images.map((image) => image.src)}
            buttonLabel={buttonLabel}
            isButtonDisabled={isCreating}
            isFormValid={isFormValid}
            setUploadableImages={this.setUploadableImages}
            registerWorkLocally={this.registerPlaceLocally}
            onSortImages={this.handleSortImages}
            onRemoveImage={this.handleRemoveImage}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => this.showDeleteModal()}>Delete</Button>
          </div>
        </Col>

        <Modal
          title="Confirm"
          visible={isDeleteModalOn}
          onOk={this.handleDeletePlace}
          onCancel={this.hideDeleteModal}
          okText="Yes, delete"
          cancelText="Cancel"
        >
          Are you sure you want to delete?
        </Modal>
      </Row>
    );
  }
}

export default EditPlace;
