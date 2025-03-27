import React from "react";

const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2 className="dialog-title">{title}</h2>
        <div className="dialog-content">{children}</div>
        {/* <button className="dialog-close" onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Dialog;
