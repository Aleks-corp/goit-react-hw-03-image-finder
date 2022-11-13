import React from 'react';
import { BiSearch } from 'react-icons/bi';
import './SearchBar.css';

const SearchBar = ({ onSubmit }) => (
  <header className="Searchbar">
    <form className="SearchForm" onSubmit={e => onSubmit(e)}>
      <button type="submit" className="SearchForm-button">
        <BiSearch className="SearchForm-icon" />
      </button>

      <input
        className="SearchForm-input"
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
      />
    </form>
  </header>
);

export default SearchBar;
