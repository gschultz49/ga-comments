import clsx from "clsx";

const cardClasses = [
  "shadow-lg",
  "rounded-md",
  "bg-purple-200",
  "cursor-pointer",
  "transform",
  "transition",
  "hover:scale-110",
  "motion-reduce:transform-none",
  "w-full",
  "h-20",
  "flex",
  "justify-center",
  "items-center",
];

const CardWrapper = ({ children, onClick, styles = [] }: any) => {
  return (
    <div className={clsx([cardClasses, ...styles])} onClick={onClick}>
      {children}
    </div>
  );
};

export default CardWrapper;