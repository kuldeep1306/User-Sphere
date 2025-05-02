import React from "react";

const AvtaraGroup = ({ avtars, maxVisible = 4 }) => {

  return (
    <div className="flex items-center">
      {avtars?.slice(0, maxVisible).map((avtar, index) => (
        <img
          key={index}
          src={avtar} // Use default if avtars is invalid or empty
          alt={`Avatar ${index}`}
          className="w-10 h-10 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
        />
      ))}
      {avtars?.length > maxVisible && (
        <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avtars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvtaraGroup;
