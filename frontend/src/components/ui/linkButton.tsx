import React from 'react';
import { Link } from 'react-router-dom';

const HeroLinkButton = ({ to, label, icon }) => {
  return (
    <Link
      to={to}
      style={{
        backgroundColor: 'rgb(0, 128, 0)',
        borderColor: 'rgb(0, 128, 0)',
        borderBottomRightRadius: 0,
      }}
      className="hover:bg-white hover:text-black font-bold text-white px-6 py-3 font-medium transition-colors rounded-2xl opacity-70"
    >
      <span className="flex items-center text-sm font-bold gap-2">
        {label}
        {icon && icon}
      </span>
    </Link>
  );
};

export default HeroLinkButton;