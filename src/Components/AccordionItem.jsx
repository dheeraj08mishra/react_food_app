import React, { useState } from "react";

const AccordionItem = ({ title, content, index, activeIndex, onClick }) => {
  const isActive = activeIndex === index;

  return (
    <>
      <div className="accordionClass">
        <h1>{title}</h1>
        <h3 onClick={() => onClick(index)}>⬇️</h3>
        <div className="borderShow"></div>
      </div>
      {isActive && <div>{content}</div>}
    </>
  );
};

export default AccordionItem;
