import { auth } from "./App";
import logout from "./img/logout.svg";

export default function SignOut() {
  return (
    auth.currentUser && (
      <div className={"flex justify-end"}>
        <div className={"flex cursor-pointer hover:bg-red-500 rounded-full p-1"} onClick={() => auth.signOut()}>
          <img src={logout} alt="logout button" className={"h-full w-10"}></img>
          <button className="sign-out">Sign Out</button>
        </div>
      </div>
    )
  );
}
