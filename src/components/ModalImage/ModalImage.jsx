import React from 'react';
import './ModalImage.css';
// import { CgClose } from 'react-icons/cg';

const ModalImage = ({ src, alt }) => (
  <img className="ModalImage" src={src} alt={alt} loading="lazy" />
);

export default ModalImage;
