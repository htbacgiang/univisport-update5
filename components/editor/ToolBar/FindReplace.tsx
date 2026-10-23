import { FC, KeyboardEvent, useCallback, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import { BsSearch } from "react-icons/bs";
import Button from "./Button";
import useOutsideClick from "./useOutsideClick";

interface Props {
  editor: Editor;
  onToggle?(isOpen: boolean): void;
}

type MatchRange = {
  from: number;
  to: number;
};

const findMatches = (
  editor: Editor,
  searchTerm: string,
  caseSensitive: boolean
): MatchRange[] => {
  const query = searchTerm.trim();
  if (!query) return [];

  const matches: MatchRange[] = [];
  const needle = caseSensitive ? query : query.toLocaleLowerCase("vi");

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;

    const haystack = caseSensitive ? node.text : node.text.toLocaleLowerCase("vi");
    let index = haystack.indexOf(needle);

    while (index !== -1) {
      matches.push({
        from: pos + index,
        to: pos + index + query.length,
      });
      index = haystack.indexOf(needle, index + needle.length);
    }
  });

  return matches;
};

const selectMatch = (editor: Editor, match: MatchRange) => {
  editor
    .chain()
    .focus()
    .setTextSelection({ from: match.from, to: match.to })
    .run();

  editor.view.dispatch(editor.state.tr.scrollIntoView());
};

const FindReplace: FC<Props> = ({ editor, onToggle }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [matchCount, setMatchCount] = useState(0);

  const updateMatchCount = (matches: MatchRange[]) => {
    setMatchCount(matches.length);
    if (!matches.length) setCurrentIndex(-1);
  };

  const showForm = () => {
    setVisible(true);
    onToggle?.(true);
  };

  const hideForm = useCallback(() => {
    setVisible(false);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm);

  const findAndSelect = (direction: "next" | "previous" = "next") => {
    const matches = findMatches(editor, searchTerm, caseSensitive);
    updateMatchCount(matches);
    if (!matches.length) return;

    const { from, to } = editor.state.selection;
    const selectedIndex = matches.findIndex(
      (match) => match.from === from && match.to === to
    );

    let nextIndex = 0;
    if (direction === "previous") {
      const firstMatchAfterSelection = matches.findIndex((match) => match.from >= from);
      nextIndex =
        selectedIndex >= 0
          ? (selectedIndex - 1 + matches.length) % matches.length
          : firstMatchAfterSelection === -1
            ? matches.length - 1
            : (firstMatchAfterSelection - 1 + matches.length) % matches.length;
    } else {
      nextIndex =
        selectedIndex >= 0
          ? (selectedIndex + 1) % matches.length
          : matches.findIndex((match) => match.from >= to);
      if (nextIndex === -1) nextIndex = 0;
    }

    setCurrentIndex(nextIndex);
    selectMatch(editor, matches[nextIndex]);
  };

  const replaceCurrent = () => {
    const matches = findMatches(editor, searchTerm, caseSensitive);
    updateMatchCount(matches);
    if (!matches.length) return;

    const { from, to } = editor.state.selection;
    const selectedIndex = matches.findIndex(
      (match) => match.from === from && match.to === to
    );
    const match = selectedIndex >= 0 ? matches[selectedIndex] : matches[0];

    const tr = editor.state.tr.insertText(replaceTerm, match.from, match.to);
    editor.view.dispatch(tr.scrollIntoView());
    editor.view.focus();

    setTimeout(() => findAndSelect("next"), 0);
  };

  const replaceAll = () => {
    const matches = findMatches(editor, searchTerm, caseSensitive);
    updateMatchCount(matches);
    if (!matches.length) return;

    let tr = editor.state.tr;
    [...matches].reverse().forEach((match) => {
      tr = tr.insertText(replaceTerm, match.from, match.to);
    });

    editor.view.dispatch(tr.scrollIntoView());
    editor.view.focus();
    setCurrentIndex(-1);
    setMatchCount(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      hideForm();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      findAndSelect(event.shiftKey ? "previous" : "next");
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <Button active={visible} onClick={visible ? hideForm : showForm}>
        <BsSearch title="Tìm và thay thế" />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50 w-[320px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-2">
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={({ target }) => {
                setSearchTerm(target.value);
                updateMatchCount(findMatches(editor, target.value, caseSensitive));
              }}
              placeholder="Từ cần tìm"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#105d97] dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={replaceTerm}
              onChange={({ target }) => setReplaceTerm(target.value)}
              placeholder="Thay bằng"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#105d97] dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />

            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={({ target }) => {
                    setCaseSensitive(target.checked);
                    updateMatchCount(findMatches(editor, searchTerm, target.checked));
                  }}
                />
                Phân biệt hoa/thường
              </label>
              <span>
                {matchCount > 0 && currentIndex >= 0
                  ? `${currentIndex + 1}/${matchCount}`
                  : `${matchCount} kết quả`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => findAndSelect("previous")}
                className="rounded bg-gray-100 px-2 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
              >
                Trước
              </button>
              <button
                type="button"
                onClick={() => findAndSelect("next")}
                className="rounded bg-gray-100 px-2 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
              >
                Sau
              </button>
              <button
                type="button"
                onClick={replaceCurrent}
                className="rounded bg-[#105d97] px-2 py-2 text-xs font-medium text-white hover:bg-[#0e4d7a]"
              >
                Thay
              </button>
              <button
                type="button"
                onClick={replaceAll}
                className="rounded bg-emerald-600 px-2 py-2 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindReplace;
