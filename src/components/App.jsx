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
    isloadMore: false,
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

  galleryMountFilteredById(response) {
    //Поиск повторяющихся картинок и их фильтр
    //Чтобы не было проблем с повторяющимися ID
    const imageList = [...this.state.imageGalleryList];
    const imageIdArray = [];
    imageList.map(imageItm => imageIdArray.push(imageItm.id));
    response.map(
      responseItem =>
        !imageIdArray.includes(responseItem.id) && imageList.push(responseItem)
    );
    //Добавление в state после проверки и фильтра
    this.setState({ imageGalleryList: imageList });
  }

  loadMoreImageHandler = async () => {
    try {
      this.setState({ isloadMore: true });
      const response = await fetchImageGallery(
        this.state.searchValue,
        this.state.page
      );
      this.galleryMountFilteredById(response.hits);
      //Добавление в state без проверки повторяющихся ID
      // this.setState({
      //   imageGalleryList: [...this.state.imageGalleryList, ...response],
      // });
      this.setState(prevState => ({ page: prevState.page + 1 }));
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      this.setState({ isloadMore: false });
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
    const imageObject = this.state.imageGalleryList.find(
      imageOption => imageOption.id === id
    );
    this.setState({
      shownImageInModalSrc: imageObject.largeImageURL,
      shownImageInModalAlt: imageObject.tags,
    });
    console.log('App ~ id', id);
    this.toggleModal();
  };

  render() {
    const {
      imageGalleryList,
      page,
      totalPages,
      isLoading,
      isloadMore,
      showModal,
      shownImageInModalAlt,
      shownImageInModalSrc,
    } = this.state;
    return (
      <div className="App">
        <SearchBar onSubmit={this.onSubmitForm} />
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <ModalImage
              src={shownImageInModalSrc}
              alt={shownImageInModalAlt}
              onClick={this.toggleModal}
            />
          </Modal>
        )}
        {imageGalleryList.length > 0 && !isLoading && (
          <ImageGallery
            onClick={this.openImageInModal}
            imageGalleryList={imageGalleryList}
          />
        )}
        {isLoading && <Loader />}
        {imageGalleryList.length <= 0 && (
          <p>Sorry, we don't find images, please try again</p>
        )}
        {isloadMore ? (
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
