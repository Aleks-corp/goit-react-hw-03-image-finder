import ImageGalleryItem from 'components/ImageGalleryItem';
import React from 'react';
import './ImageGallery.css';

const ImageGallery = ({ imageGalleryList, onClick }) => (
  <ul className="ImageGallery">
    {imageGalleryList.map(imageGalleryItm => (
      <li
        className="ImageGalleryItem"
        key={imageGalleryItm.id}
        onClick={() => onClick(imageGalleryItm.id)}
      >
        <ImageGalleryItem imageGalleryItm={imageGalleryItm} />
      </li>
    ))}
  </ul>
);
export default ImageGallery;
