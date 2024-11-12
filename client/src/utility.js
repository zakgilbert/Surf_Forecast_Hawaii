const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export const getTideBeginAndEndDates = () => {
  const today = new Date(); // Get today's date
  const beginDate = getFormattedDate(today); // Current date in YYYYMMDD format

  // Add 3 days to the current date
  const endDate = getFormattedDate(
    new Date(today.setDate(today.getDate() + 2))
  );
  return {
    beginDate: beginDate,
    endDate: endDate,
  };
};

export function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
