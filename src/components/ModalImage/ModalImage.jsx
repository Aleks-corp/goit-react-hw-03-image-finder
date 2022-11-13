import React from 'react';
import './ModalImage.css';
import { CgClose } from 'react-icons/cg';

const ModalImage = ({ src, alt, onClick }) => (
  <>
    <img className="ModalImage" src={src} alt={alt} />
    <CgClose className="modal-close-icon" onClick={onClick} />
  </>
);

export default ModalImage;
