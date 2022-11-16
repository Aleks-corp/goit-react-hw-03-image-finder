import Button from './Button';
import React, { Component } from 'react';

import { fetchImageGallery } from './axios';
import { PER_PAGE } from './constants';
import ImageGallery from './ImageGallery';
import SearchBar from './SearchBar';
import { Loader, LoaderForMoreImage } from './Loader';
import Modal from './Modal';
import ModalImage from './ModalImage';

export class App extends Component {
  state = {
    imageGalleryList: [],

    shownImageInModalSrc: '',
    shownImageInModalAlt: '',

    isLoading: false,
    isLoadMore: false,
    searchValue: null,
    page: 2,
    totalPages: null,
    showModal: false,
  };

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      const response = await fetchImageGallery();
      this.setState({
        imageGalleryList: [...response.hits],
        totalPages: Math.ceil(Number(response.totalHits) / PER_PAGE),
      });
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  galleryMountFilteredById(newImageList) {
    //Поиск повторяющихся картинок и их фильтр
    //Чтобы не было проблем с повторяющимися ID
    const imageList = [...this.state.imageGalleryList];
    const imageIdList = [];
    imageList.map(imageItm => imageIdList.push(imageItm.id));
    newImageList.map(
      newImageItem =>
        !imageIdList.includes(newImageItem.id) && imageList.push(newImageItem)
    );
    //Добавление в state после проверки и фильтра
    this.setState({ imageGalleryList: imageList });
  }

  loadMoreImageHandler = async () => {
    try {
      this.setState({ isLoadMore: true });
      const response = await fetchImageGallery(
        this.state.searchValue,
        this.state.page
      );
      this.galleryMountFilteredById(response.hits);
      //Добавление в state без проверки повторяющихся ID
      // this.setState({
      //   imageGalleryList: [...this.state.imageGalleryList, ...response.hits],
      // });
      this.setState(prevState => ({ page: prevState.page + 1 }));
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      this.setState({ isLoadMore: false });
    }
  };

  onSubmitForm = async e => {
    try {
      e.preventDefault();
      this.setState({ isLoading: true });
      this.setState({ searchValue: e.target[1].value.trim() });
      const response = await fetchImageGallery(e.target[1].value.trim());
      this.setState({
        imageGalleryList: [...response.hits],
        totalPages: Math.ceil(Number(response.totalHits) / PER_PAGE),
      });
      e.target[1].value = '';
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };
  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };
  openImageInModal = id => {
    const selectedImage = this.state.imageGalleryList.find(
      imageOption => imageOption.id === id
    );

    this.setState({
      shownImageInModalSrc: selectedImage.largeImageURL,
      shownImageInModalAlt: selectedImage.tags,
    });

    this.toggleModal();
  };

  render() {
    const {
      imageGalleryList,
      page,
      totalPages,
      isLoading,
      isLoadMore,
      showModal,
      shownImageInModalAlt,
      shownImageInModalSrc,
    } = this.state;
    return (
      <div className="App">
        <SearchBar onSubmit={this.onSubmitForm} />
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <ModalImage src={shownImageInModalSrc} alt={shownImageInModalAlt} />
          </Modal>
        )}
        {imageGalleryList.length > 0 && !isLoading && (
          <ImageGallery
            onClick={this.openImageInModal}
            imageGalleryList={imageGalleryList}
          />
        )}
        {isLoading && <Loader />}
        {imageGalleryList.length === 0 && (
          <p>Sorry, we din't find images, please try again</p>
        )}
        {isLoadMore ? (
          <LoaderForMoreImage />
        ) : (
          page <= totalPages &&
          totalPages !== null &&
          !isLoading && (
            <Button type="button" onClick={this.loadMoreImageHandler}>
              Load More...
            </Button>
          )
        )}
      </div>
    );
  }
}
