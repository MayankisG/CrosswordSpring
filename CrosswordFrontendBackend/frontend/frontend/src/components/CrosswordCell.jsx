export default function CrosswordCell({
  cellContent,
  userAnswer,
  rowIndex,
  colIndex,
  isSelected,
  isHighlighted,
  cellNumber,
  onClick,
  cellSize = 56,
  disabled = false,
}) {
  const isEmpty = cellContent === "";

  // Determine what to display in the cell
  const displayContent = disabled ? cellContent : userAnswer || "";

  return (
    <div
      className={`crossword-cell${isEmpty ? " empty" : ""}${
        isSelected ? " selected" : ""
      }${isHighlighted ? " highlighted" : ""}${
        disabled ? " solver-active" : ""
      }`}
      style={{
        width: cellSize,
        height: cellSize,
        border: "1.5px solid #333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isEmpty
          ? "#222"
          : isSelected
          ? "#ffe066"
          : isHighlighted
          ? "#d0ebff"
          : "#fff",
        position: "relative",
        fontSize: cellSize > 40 ? "1.5em" : "1.2em",
        cursor: isEmpty || disabled ? "default" : "pointer",
        userSelect: "none",
        transition: "all 0.2s",
        opacity: disabled ? 0.8 : 1,
      }}
      // In CrosswordCell.js
      onClick={() => {
        if (!isEmpty && !disabled) {
          onClick();
          // Focus on the grid container to ensure keyboard events work
          document.querySelector(".crossword-grid")?.focus();
        }
      }}
    >
      {cellNumber && (
        <span
          style={{
            position: "absolute",
            top: 4,
            left: 6,
            fontSize: cellSize > 40 ? "0.8em" : "0.6em",
            color: "#888",
          }}
        >
          {cellNumber}
        </span>
      )}
      <span>{displayContent}</span>
    </div>
  );
}
