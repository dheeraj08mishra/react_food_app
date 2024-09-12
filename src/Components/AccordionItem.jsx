import React from "react";

const AccordionItem = ({ title, content, index, activeIndex, onClick }) => {
  const isActive = activeIndex === index;

  return (
    <>
      <div className="accordionClass" onClick={() => onClick(index)}>
        <h1>{title}</h1>
        <h1>⬇️</h1>
        <div className="borderShow"></div>
      </div>
      {isActive && <div>{content}</div>}
    </>
  );
};

export default AccordionItem;
