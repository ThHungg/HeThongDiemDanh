export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}/${month}`;
};