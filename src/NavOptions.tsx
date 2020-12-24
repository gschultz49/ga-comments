import { auth } from "./App";
import logout from "./img/logout.svg";
import home from "./img/homeIcon.svg";
import { useHistory } from "react-router-dom";
import { redirectTo } from "./utils";
import backButton from "./img/backButton.svg";

export function SignOut() {
  return (
    <NavItemContainer>
      <img src={logout} alt="logout button" className={"h-full w-6"}></img>
      <p className="sign-out">Sign Out</p>
    </NavItemContainer>
  );
}

export const NavItemContainer = ({
  onClick = () => auth.signOut(),
  children,
}: any) => (
  <div
    className={
      "flex cursor-pointer hover:bg-gray-200 m-4 p-2 rounded-full p-1 space-x-2 items-center"
    }
    onClick={onClick}
  >
    {children}
  </div>
);

export const GoBackButton = () => {
  const history = useHistory();
  return (
    <NavItemContainer onClick={() => history.goBack()}>
      <img
        src={backButton}
        alt="back navigation button"
        className={"h-full w-6"}
      ></img>
      <p className="home">Go Back</p>
    </NavItemContainer>
  );
};

export const HomeButton = () => {
  const history = useHistory();
  return (
    <NavItemContainer onClick={() => redirectTo(history, "/")}>
      <img
        src={home}
        alt="home navigation button"
        className={"h-full w-6"}
      ></img>
      <p className="home">Home</p>
    </NavItemContainer>
  );
};

const NavOptions = () => {
  return (
    auth.currentUser && (
      <div className={"flex justify-end items-center h-12 space-x-8"}>
        <GoBackButton />
        <HomeButton />
        <SignOut />
      </div>
    )
  );
};

export default NavOptions;
