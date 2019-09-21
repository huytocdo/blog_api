// class FormatTime
const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

exports.formatVNDate = function(yourDate) {
  return `${
    days[yourDate.getDay()]
  }, ngày ${yourDate.getDate()} tháng ${yourDate.getMonth() + 1}`;
};
