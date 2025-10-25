import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-6 md:py-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-red-500">
          ezz code
      </h1>
      <p className="mt-2 text-lg text-gray-300">
        Code made easy.
      </p>
    </header>
  );
};

export default Header;