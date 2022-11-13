import React from 'react';
import './Button.css';

const Button = ({ type, onClick, disabled, children }) => (
  <button className="Button" type={type} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export default Button;
