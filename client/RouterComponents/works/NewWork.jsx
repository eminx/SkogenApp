import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { message } from 'antd/lib';
import arrayMove from 'array-move';

import WorkForm from '../../UIComponents/WorkForm';
import { call, resizeImage, uploadImage } from '../../functions';
import Loader from '../../UIComponents/Loader';

class NewWork extends PureComponent {
  state = {
    formValues: {
      title: '',
      subtitle: '',
      description: '',
      additionalInfo: '',
      category: ''
    },
    categories: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newWorkId: null,
    currentUser: null
  };

  componentDidMount() {
    this.getCategories();
  }

  getCategories = async () => {
    const categories = await call('getCategories', 'work');
    this.setState({
      categories
    });
  };

  handleQuillChange = description => {
    const { formValues } = this.state;
    const newValues = {
      ...formValues,
      description
    };

    this.setState({
      formValues: newValues
    });
  };

  handleRemoveImage = imageIndex => {
    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: uploadableImages.filter(
        (image, index) => imageIndex !== index
      ),
      uploadableImagesLocal: uploadableImagesLocal.filter(
        (image, index) => imageIndex !== index
      )
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
      )
    }));
  };

  setUploadableImages = files => {
    this.setState({
      isLocalising: true
    });

    files.forEach((uploadableImage, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
            uploadableImages: [...uploadableImages, uploadableImage],
            uploadableImagesLocal: [...uploadableImagesLocal, reader.result]
          }));
        },
        false
      );
      if (files.length === index + 1) {
        this.setState({
          isLocalising: false
        });
      }
    });
  };

  registerGroupLocally = formValues => {
    this.setState(
      {
        formValues,
        isCreating: true
      },
      () => this.uploadImages()
    );
  };

  uploadImages = async () => {
    const { uploadableImages } = this.state;

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage, index) => {
          const resizedImage = await resizeImage(uploadableImage, 800);
          const uploadedImage = await uploadImage(
            resizedImage,
            'workImageUpload'
          );
          return uploadedImage;
        })
      );
      this.createWork(imagesReadyToSave);
    } catch (error) {
      message.error(error.reason);
      this.setState({
        isError: true
      });
    }
  };

  createWork = async imagesReadyToSave => {
    const { formValues, categories } = this.state;
    const selectedCategory = categories.find(
      category => category.label === formValues.category.toLowerCase()
    );

    const newWork = {
      ...formValues,
      category: {
        label: selectedCategory.label,
        color: selectedCategory.color,
        categoryId: selectedCategory._id
      }
    };

    try {
      const respond = await call('createWork', newWork, imagesReadyToSave);
      this.setState({
        newWorkId: respond,
        isCreating: false,
        isSuccess: true
      });
      message.success('Your work is successfully created');
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
      newWorkId,
      isCreating,
      categories
    } = this.state;

    if (isSuccess && newWorkId) {
      return <Redirect to={`/${currentUser.username}/work/${newWorkId}`} />;
    }

    const buttonLabel = isCreating
      ? 'Creating your work...'
      : 'Confirm and Create Work';

    return (
      <WorkForm
        formValues={formValues}
        categories={categories}
        onSubmit={this.uploadImages}
        setUploadableImages={this.setUploadableImages}
        images={uploadableImagesLocal}
        buttonLabel={buttonLabel}
        isButtonDisabled={isCreating}
        onSortImages={this.handleSortImages}
        onRemoveImage={this.handleRemoveImage}
        registerGroupLocally={this.registerGroupLocally}
      />
    );
  }
}

export default NewWork;
