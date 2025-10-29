import React from 'react';
import { Coins } from 'lucide-react';
import { UI_TEXT } from '../config/constants';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Coins className="w-8 h-8 text-black" />
        <h1 className="text-3xl font-bold">SliceCost</h1>
      </div>
    </header>
  );
};

export default Header;
