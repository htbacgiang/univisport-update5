import { FC, useCallback, useRef, useState } from "react";
import { MdTableChart } from "react-icons/md";
import Button from "./Button";
import useOutsideClick from "./useOutsideClick";

interface Props {
  onSubmit(rows: number, cols: number, withHeaderRow: boolean): void;
  onToggle?(isOpen: boolean): void;
}

const InsertTable: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    const rowsNum = parseInt(rows) || 3;
    const colsNum = parseInt(cols) || 3;
    
    if (rowsNum < 1 || rowsNum > 20) return;
    if (colsNum < 1 || colsNum > 20) return;

    onSubmit(rowsNum, colsNum, withHeaderRow);
    setRows("3");
    setCols("3");
    setWithHeaderRow(true);
    hideForm();
  };

  const hideForm = useCallback(() => {
    setVisible(false);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm);
  
  const showForm = () => {
    setVisible(true);
    onToggle?.(true);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={({ key }) => {
        if (key === "Escape") hideForm();
      }}
      className="relative"
    >
      <Button onClick={visible ? hideForm : showForm}>
        <MdTableChart title="Chèn bảng" />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 p-4 min-w-[280px]">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tạo bảng
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Số hàng:
              </label>
              <input
                autoFocus
                type="number"
                min="1"
                max="20"
                className="flex-1 bg-white dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-600 focus:border-[#105d97] dark:focus:border-[#105d97] transition p-2 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="3"
                value={rows}
                onChange={({ target }) => setRows(target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Số cột:
              </label>
              <input
                type="number"
                min="1"
                max="20"
                className="flex-1 bg-white dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-600 focus:border-[#105d97] dark:focus:border-[#105d97] transition p-2 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="3"
                value={cols}
                onChange={({ target }) => setCols(target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="headerRow"
                checked={withHeaderRow}
                onChange={({ target }) => setWithHeaderRow(target.checked)}
                className="w-4 h-4 text-[#105d97] border-gray-300 rounded focus:ring-[#105d97]"
              />
              <label htmlFor="headerRow" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Có hàng tiêu đề
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={hideForm}
                className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 p-2 text-gray-800 dark:text-gray-200 rounded text-sm transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#105d97] hover:bg-[#0e4d7a] p-2 text-white rounded text-sm transition"
              >
                Tạo bảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertTable;
