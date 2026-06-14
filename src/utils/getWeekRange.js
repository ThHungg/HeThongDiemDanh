const { formatDate } = require("./formatDate");

const getWeekRange = (date) => {
  const currentDay = date.getDay(); // 0 is Sunday, 1-6 are Monday-Saturday
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: formatDate(monday),
    endDate: formatDate(sunday),
  };
};

module.exports = { getWeekRange };
