
import React from 'react';

export const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-0 sm:p-4">
      <div className="w-full h-screen sm:max-w-[400px] sm:h-[850px] bg-white sm:rounded-[3rem] sm:shadow-2xl overflow-hidden relative border-0 sm:border-[8px] border-gray-900">
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-50"></div>
        <div className="h-full overflow-y-auto bg-[#F2F2F7]">
          {children}
        </div>
      </div>
    </div>
  );
};
