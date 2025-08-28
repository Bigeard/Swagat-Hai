import { RefObject } from "react";
import Settings from "./Settings";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  index: number;
  inputGuessRef: RefObject<HTMLInputElement>;
  onLoadWordList: (id: string) => void;
}

export default function Navbar(
  { index, inputGuessRef, onLoadWordList }: NavbarProps,
) {
  return (
    <div className="navbar bg-base-100 fixed p-5">
      <div className="flex-none ml-3">
        <Settings
          inputGuessRef={inputGuessRef}
          onLoadWordList={onLoadWordList}
        />
      </div>

      <div className="flex-1 flex justify-center">
        <label
          htmlFor="checkbox-drawer"
          className="ml-4 mr-4 w-fit btn btn-primary drawer-button"
        >
          Word Number - <b>[{index}]</b>
        </label>
      </div>

      <div className="flex-none mr-3">
        <ThemeToggle />
      </div>
    </div>
  );
}
