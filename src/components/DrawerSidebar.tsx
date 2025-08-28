import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { WordType } from "../types";

interface DrawerSidebarProps {
  listWords: WordType[];
  currentIndex: number;
  setWordNumber: (index: number) => void;
  toggleDrawer: () => void;
}

export default function DrawerSidebar({
  listWords,
  currentIndex,
  setWordNumber,
  toggleDrawer,
}: DrawerSidebarProps) {
  const [inputSearchWord, setInputSearchWord] = useState("");
  const filteredWords = useMemo(
    () =>
      inputSearchWord.length > 0
        ? listWords.filter((w) =>
          w.translation.startsWith(inputSearchWord.toLowerCase())
        )
        : listWords,
    [inputSearchWord, listWords],
  );

  return (
    <div className="drawer-side">
      <label
        htmlFor="checkbox-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      >
      </label>
      <ul className="menu bg-base-200 text-base-content min-h-full w-100 max-w-full p-4 pb-25">
        <label className="input input-lg mb-4 sticky z-50 top-4 w-full">
          <MagnifyingGlassIcon className="h-[1em] opacity-50" />
          <input
            type="search"
            placeholder="Search"
            onChange={(e) => setInputSearchWord(e.currentTarget.value)}
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </label>

        {filteredWords.map((w, i) => (
          <li
            key={w.id || i}
            className={`btn btn-lg mb-2 text-left ${
              w.id === currentIndex && "btn-dash btn-primary"
            }`}
          >
            <a className="w-full" onClick={() => setWordNumber(w.id || i)}>
              <b>[{w.id || i}]</b> {w.translation} - {w.guess}
            </a>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-primary btn-lg fixed bottom-6 left-50"
        onClick={toggleDrawer}
      >
        <ArrowLeftIcon className="h-5 w-5" /> Go Back
      </button>
    </div>
  );
}
