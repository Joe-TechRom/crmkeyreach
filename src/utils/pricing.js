// src/utils/pricing.js
export const calculatePrice = (monthlyPrice, isYearly, yearlyDiscount) => {
  if (isYearly) {
    const yearlyPrice = monthlyPrice * 12 * (1 - yearlyDiscount);
    return [Number((yearlyPrice / 12).toFixed(2)), Number(yearlyPrice.toFixed(2))];
  }
  return [Number(monthlyPrice), Number((monthlyPrice * 12).toFixed(2))];
};
