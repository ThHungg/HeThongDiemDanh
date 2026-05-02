
export const formatClassCode = (maLopHocPhan: string, tenLop: string) => {
  const tenLopLength = tenLop.length;
  const baseCode = maLopHocPhan.substring(0, maLopHocPhan.length - tenLopLength);
  return `${baseCode}.${tenLop}`;
};