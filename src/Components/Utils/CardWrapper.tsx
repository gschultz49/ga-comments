import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

const cardClasses = [
  "shadow-lg",
  "rounded-2xl",
  "bg-purple-200",
  "cursor-pointer",
  "transform",
  "transition",
  "hover:scale-110",
  "motion-reduce:transform-none",
  "w-60",
  "h-60",
  "flex",
  "justify-center",
  "items-center",
];

const CardWrapper = ({ to, children, ...rest }: any) => {
  return (
    <div className={"flex justify-center sm:justify-start items-center"}>
      <Link to={to}>
        <CardWrapperBase {...rest}>{children}</CardWrapperBase>
      </Link>
    </div>
  );
};

const CardWrapperBase = ({ children, onClick, styles = [] }: any) => {
  return (
    <div className={clsx([cardClasses, ...styles])} onClick={onClick}>
      {children}
    </div>
  );
};

export default CardWrapper;
