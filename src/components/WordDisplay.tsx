import { RefObject } from "react";
import { WordType } from "../types";

interface WordDisplayProps {
  tooltipAnswerRef: RefObject<HTMLInputElement>;
  inputGuessRef: RefObject<HTMLInputElement>;
  word: WordType;
  inputValue: string;
  inputStatus: string;
  correctIndex: number;
  onInputChange: (value: string) => void;
  infoText: string;
}

export default function WordDisplay({
  tooltipAnswerRef,
  inputGuessRef,
  word,
  inputValue,
  inputStatus,
  correctIndex,
  onInputChange,
  infoText,
}: WordDisplayProps) {
  return (
    <div className="content flex-center-col">
      <div
        ref={tooltipAnswerRef}
        className={`tooltip tooltip-error flex-center-col font-bold`}
        data-tip={word.answer.charAt(correctIndex) === " "
          ? "[SPACE]"
          : word.answer.charAt(correctIndex)}
      >
        <h1 className={inputStatus}>{word.guess}</h1>
        <h2 className={inputStatus}>
          {word.answer !== "♡" ? `( ${word.translation} )` : word.translation}
        </h2>
      </div>
      <input
        ref={inputGuessRef}
        className="input-guess-value"
        value={inputValue}
        onChange={(e) => onInputChange(e.currentTarget.value)}
        autoFocus
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
      />
      <h3>{infoText}</h3>
    </div>
  );
}
