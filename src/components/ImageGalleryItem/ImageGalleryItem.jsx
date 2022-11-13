import React from 'react';
import './ImageGalleryItem.css';

const ImageGalleryItem = ({ imageGalleryItm }) => {
  const { webformatURL, tags } = imageGalleryItm;
  return (
    <img className="ImageGalleryItem-image" src={webformatURL} alt={tags} />
  );
};
export default ImageGalleryItem;
