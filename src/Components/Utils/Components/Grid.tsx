import clsx from "clsx";
import { ReactNode } from "react";

const defaultStyles = ["grid", "grid-cols-1", "sm:grid-cols-3", "gap-10"];

const Grid = ({ children, styles }: { children: ReactNode; styles?: any }) => {
  return <div className={clsx([defaultStyles, styles])}>{children}</div>;
};

export default Grid;
