const { formatDate } = require("./formatDate");

const getMonthRange = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay),
  };
};

module.exports = { getMonthRange };
