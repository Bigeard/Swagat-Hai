import { useEffect, useRef, useState } from "react";
import { WORDS } from "./words";
import { getListWords } from "./services/Idb";
import Navbar from "./components/Navbar";
import WordDisplay from "./components/WordDisplay";
import DrawerSidebar from "./components/DrawerSidebar";
import { WordType } from "./types";
import "./App.css";
import Footer from "./components/Footer";

function App() {
  const checkboxDrawerRef = useRef<HTMLInputElement>(null);
  const tooltipAnswerRef = useRef<HTMLInputElement>(null);
  const inputGuessRef = useRef<HTMLInputElement>(null);
  const [inputGuessValue, setInputGuessValue] = useState("");
  const [inputGuessValueCorrectIndex, setInputGuessValueCorrectIndex] =
    useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const [infoText, setInfoText] = useState(
    "Type the Hindi word in alphabet...",
  );
  const [index, setIndex] = useState(0);
  const [listWords, setListWords] = useState<WordType[]>([]);
  const [word, setWord] = useState({
    answer: "",
    guess: "",
    translation: "",
  });
  const [helperCheckError, setHelperCheckError] = useState(0);

  const setNextWord = (nextIndex: number) => {
    // End of the game
    if (listWords.length <= nextIndex) {
      if (inputGuessRef.current != null) {
        inputGuessRef.current.disabled = true;
      }
      setInputGuessValue("");
      setWord({
        answer: "♡",
        guess: "",
        translation: `Well done 🎉 !\nYou completed all the words!`,
      });
      setInfoText("");
      return true;
    } // Next Word
    else {
      setWord(listWords[nextIndex]);
    }
  };

  const checkValue = (value: string) => {
    if (value.toLowerCase() === word.answer) {
      // If the word is correct, move on to the next word
      setInfoText(`Previous word: ${word.answer} - ${word.translation}`);
      setWordNumber(index + 1);
    } // Check if the character is correct
    else {
      if (value.length < inputGuessValue.length) {
        setInputStatus("");
      } else {
        if (value.toLowerCase() === word.answer.substring(0, value.length)) {
          // ---= Correct =---
          tooltipAnswerRef.current?.classList.remove("tooltip-open");
          setHelperCheckError(0);
          setInputStatus("text-success");
          setInputGuessValue(value);
          setTimeout(() => setInputGuessValueCorrectIndex(value.length), 300);
        } else {
          // ---= Correct =---
          setInputStatus("text-error");
          tooltipAnswerRef.current?.classList.add("animate-giggle");
          setTimeout(
            () => tooltipAnswerRef.current?.classList.remove("animate-giggle"),
            300,
          );

          // After 5 errors give the answer
          if (helperCheckError + 1 >= 5) {
            tooltipAnswerRef.current?.classList.add("tooltip-open");
          } else {
            setHelperCheckError(helperCheckError + 1);
          }
        }
      }
    }
  };

  const setWordNumber = (selectedIndex: number) => {
    tooltipAnswerRef.current?.classList.remove("tooltip-open");
    localStorage.setItem("wordindex", selectedIndex.toString());
    setIndex(selectedIndex);
    setInputStatus("");
    setInputGuessValue("");
    if (inputGuessRef.current != null) {
      inputGuessRef.current.disabled = false;
    }
    if (checkboxDrawerRef?.current != null) {
      checkboxDrawerRef.current.checked = false;
    }
    setNextWord(selectedIndex);
    setTimeout(() => setInputGuessValueCorrectIndex(0), 300);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
  };

  const toggleDrawer = () => {
    if (checkboxDrawerRef.current?.checked) {
      checkboxDrawerRef.current.checked = !checkboxDrawerRef.current?.checked;
    }
  };

  const initWordList = async (newWordList: WordType[]) => {
    const wordListWithIndex: WordType[] = [];
    newWordList.forEach((w, i) => {
      w.id = i;
      wordListWithIndex.push(w);
    });
    setListWords(wordListWithIndex);
  };

  const onLoadWordList = async (id: string) => {
    console.log(`Load Word List ${id}`);
    try {
      const loadListWords = await getListWords(id);
      if (loadListWords != null) {
        localStorage.setItem("wordindex", "0");
        initWordList(loadListWords);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const wordindex = localStorage.getItem("wordindex") || "0";
    const currentIndex = Number(wordindex);
    setIndex(currentIndex);
    setNextWord(currentIndex);
    if (inputGuessRef.current != null) {
      inputGuessRef.current.disabled = false;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [listWords]);

  useEffect(() => {
    initWordList(WORDS);

    const handleClick = () => {
      if (!checkboxDrawerRef.current?.checked) {
        inputGuessRef?.current?.focus();
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
      } else {
        tooltipAnswerRef.current?.classList.remove("tooltip-open");
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <main>
      <div className="drawer">
        <input
          ref={checkboxDrawerRef}
          onClick={() => checkboxDrawerRef?.current?.focus()}
          id="checkbox-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          <Navbar
            index={index}
            inputGuessRef={inputGuessRef}
            onLoadWordList={onLoadWordList}
          />
          <WordDisplay
            tooltipAnswerRef={tooltipAnswerRef}
            inputGuessRef={inputGuessRef}
            word={word}
            inputValue={inputGuessValue}
            inputStatus={inputStatus}
            correctIndex={inputGuessValueCorrectIndex}
            onInputChange={checkValue}
            infoText={infoText}
          />
          <Footer />
        </div>
        <DrawerSidebar
          listWords={listWords}
          currentIndex={index}
          setWordNumber={setWordNumber}
          toggleDrawer={toggleDrawer}
        />
      </div>
    </main>
  );
}

export default App;
