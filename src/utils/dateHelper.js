const formatDate = (date) => {
  return date.toLocaleDateString("en-CA");
};

const getAttendanceDates = (tkbId, startDate, endDate, schedules) => {
  if (!tkbId || !startDate || !endDate || !schedules) {
    return [];
  }

  const dates = [];
  let current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    const dayOfWeek = current.getDay();
    const myFormatDay = dayOfWeek === 0 ? 8 : dayOfWeek + 1;

    const match = schedules.find((schedule) => schedule.thu === myFormatDay);
    if (match) {
      dates.push({
        tkb_id: tkbId,
        tkb_chi_tiet_id: match.tkbId,
        ngay_hoc: formatDate(current),
        trang_thai: 0,
        loai_buoi_hoc: "Chinh_thuc",
        ghi_chu: "",
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

module.exports = {
  getAttendanceDates,
};
