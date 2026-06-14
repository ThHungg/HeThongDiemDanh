const isLastDayOfMonth = (date) => {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay.getMonth() !== date.getMonth();
};

module.exports = { isLastDayOfMonth };
