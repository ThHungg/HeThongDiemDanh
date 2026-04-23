const getScoreColor = (score: number | null | undefined) => {
  if (score === null || score === undefined) return "text-gray-400";
  if (score >= 8) return "text-green-600";
  if (score >= 5) return "text-amber-500";
  return "text-red-500";
};

export default getScoreColor;
