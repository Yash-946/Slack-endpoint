function convertUTCToIST(dateStr) {
  const dateObj = new Date(dateStr);

  // Convert to IST (UTC+5:30)
  const offsetIST = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istDateObj = new Date(dateObj.getTime() + offsetIST);

  // Extract year, month, and time in HH:MM:SS format
  const year = istDateObj.getUTCFullYear();
  const month = istDateObj.getUTCMonth() + 1; // getUTCMonth() returns 0-11
  const day = istDateObj.getUTCDate();
  const hours = istDateObj.getUTCHours();
  const minutes = istDateObj.getUTCMinutes();
  const seconds = istDateObj.getUTCSeconds();

  // Format month and day to always have two digits
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  // Construct time in HH:MM:SS format
  const time = `${hours}:${minutes}:${seconds}`;

  return {
    year: year,
    month: formattedMonth,
    day: formattedDay,
    time: time
  };
}

// Example usage
const dateStr = '2024-05-01T10:29:41Z'
const convertedData = convertUTCToIST(dateStr);
console.log(convertedData);
