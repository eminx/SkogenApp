import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row, message } from 'antd';
import arrayMove from 'array-move';

import WorkForm from '../../UIComponents/WorkForm';
import { call, resizeImage, uploadImage } from '../../functions';
import Loader from '../../UIComponents/Loader';

class NewPlace extends PureComponent {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      additionalInfo: '',
      category: '',
    },
    categories: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newPlaceId: null,
    currentUser: null,
  };

  componentDidMount() {
    this.getCategories();
  }

  getCategories = async () => {
    const categories = await call('getCategories', 'work');
    this.setState({
      categories,
    });
  };

  handleQuillChange = (description) => {
    const { formValues } = this.state;
    const newValues = {
      ...formValues,
      description,
    };

    this.setState({
      formValues: newValues,
    });
  };

  handleRemoveImage = (imageIndex) => {
    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: uploadableImages.filter(
        (image, index) => imageIndex !== index
      ),
      uploadableImagesLocal: uploadableImagesLocal.filter(
        (image, index) => imageIndex !== index
      ),
    }));
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
    }));
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
          this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
            uploadableImages: [...uploadableImages, uploadableImage],
            uploadableImagesLocal: [...uploadableImagesLocal, reader.result],
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

  registerPlaceLocally = (formValues) => {
    this.setState(
      {
        formValues,
        isCreating: true,
      },
      () => this.uploadImages()
    );
  };

  uploadImages = async () => {
    const { uploadableImages } = this.state;

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage, index) => {
          const resizedImage = await resizeImage(uploadableImage, 1200);
          const uploadedImage = await uploadImage(
            resizedImage,
            'workImageUpload'
          );
          return uploadedImage;
        })
      );
      this.createPlace(imagesReadyToSave);
    } catch (error) {
      message.error(error.reason);
      this.setState({
        isError: true,
      });
    }
  };

  createPlace = async (imagesReadyToSave) => {
    const { formValues, categories } = this.state;
    const selectedCategory = categories.find(
      (category) => category.label === formValues.category.toLowerCase()
    );

    const newPlace = {
      ...formValues,
      category: {
        label: selectedCategory.label,
        color: selectedCategory.color,
        categoryId: selectedCategory._id,
      },
    };

    try {
      const respond = await call('createPlace', newPlace, imagesReadyToSave);
      this.setState({
        newPlaceId: respond,
        isCreating: false,
        isSuccess: true,
      });
      message.success('Your entry is successfully created');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isCreating: false });
    }
  };

  render() {
    const currentUser = Meteor.user();

    if (!currentUser || !currentUser.isRegisteredMember) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Loader />
        </div>
      );
    }

    const {
      formValues,
      isLoading,
      uploadableImagesLocal,
      isSuccess,
      newPlaceId,
      isCreating,
      categories,
    } = this.state;

    if (isSuccess && newPlaceId) {
      return <Redirect to={`/place/${newPlaceId}`} />;
    }

    const buttonLabel = isCreating ? 'Creating...' : 'Confirm and Create';

    return (
      <Row style={{ padding: 24 }}>
        <Col lg={6} />
        <Col lg={12}>
          <h3 style={{ marginBottom: 24 }}>New Place</h3>
          <WorkForm
            formValues={formValues}
            categories={categories}
            setUploadableImages={this.setUploadableImages}
            images={uploadableImagesLocal}
            buttonLabel={buttonLabel}
            isButtonDisabled={isCreating}
            onSortImages={this.handleSortImages}
            onRemoveImage={this.handleRemoveImage}
            registerWorkLocally={this.registerPlaceLocally}
          />
        </Col>
      </Row>
    );
  }
}

export default NewPlace;
