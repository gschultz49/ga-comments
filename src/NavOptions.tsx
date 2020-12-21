import { auth } from "./App";
import logout from "./img/logout.svg";
import home from "./img/homeIcon.svg";

export function SignOut() {
  return (
    <div
      className={
        "flex cursor-pointer hover:bg-red-500 rounded-full p-1 space-x-2"
      }
      onClick={() => auth.signOut()}
    >
      <img src={logout} alt="logout button" className={"h-full w-6"}></img>
      <button className="sign-out">Sign Out</button>
    </div>
  );
}

export const HomeButton = () => {
  return (
    <div
      className={
        "flex cursor-pointer hover:bg-red-500 rounded-full p-1 space-x-2"
      }
      onClick={() => auth.signOut()}
    >
      <img
        src={home}
        alt="home navigation button"
        className={"h-full w-6"}
      ></img>
      <button className="sign-out">Home</button>
    </div>
  );
};

const NavOptions = () => {
  return (
    auth.currentUser && (
      <div className={"flex justify-end items-center h-12 space-x-8"}>
        <HomeButton />
        <SignOut />
      </div>
    )
  );
};

export default NavOptions;
