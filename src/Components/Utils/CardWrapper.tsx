import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

const centerFlex = ["flex", "justify-center", "items-center"];
const cardClasses = [
  "shadow-lg",
  "rounded-2xl",
  "cursor-pointer",
  "transform",
  "transition",
  "hover:scale-110",
  "motion-reduce:transform-none",
  "w-48",
  "h-48",
  "card-rect",
  ...centerFlex,
];

const rectangleCardWrapperClasses = [
  "shadow-lg",
  "cursor-pointer",
  "transform",
  "transition",
  "hover:scale-110",
  "motion-reduce:transform-none",
  "h-32",
  "w-full",
  "card-rect",
  ...centerFlex,
];

const CardWrapper = ({
  Wrapper = CircularCard,
  to,
  children,
  ...rest
}: any) => {
  return (
    <div className={"flex justify-center sm:justify-start items-center"}>
      <Link to={to} className={"w-full"}>
        <Wrapper {...rest}>{children}</Wrapper>
      </Link>
    </div>
  );
};

export const CircularCard = ({ children, onClick, styles = [] }: any) => {
  return (
    <div className={clsx([cardClasses, ...styles])} onClick={onClick}>
      {children}
    </div>
  );
};

export const RectangularCard = ({ children, onClick, styles = [] }: any) => {
  return (
    <div
      className={clsx([rectangleCardWrapperClasses, ...styles])}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
