const getScoreColor = (score: number | null | undefined) => {
  if (score === null || score === undefined) return "text-gray-400";
  if (score >= 10) return "text-green-600";
  if (score >= 1) return "text-amber-500";
  return "text-red-500";
};

export default getScoreColor;
