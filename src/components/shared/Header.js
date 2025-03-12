import React from 'react';
import '../../styles/Header.css';

const Header = () => {
  const handleOnClick = () => {
    window.location.href = '/auth';
  };

  return (
    <header>
      <h1>медуслуги</h1>
        <button className="loginbutton" onClick={handleOnClick}>
          Авторизация
        </button>
    </header>
  );
};

export default Header;