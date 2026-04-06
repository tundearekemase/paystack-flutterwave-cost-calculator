export const buildFormat = (val: number, currency: 'NGN' | 'USD') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'USD' && val > 0 && val < 0.01 ? 4 : 2,
  }).format(val);
};

export const formatNGNBase = (ngnAmount: number, currency: 'NGN' | 'USD', rate: number) => {
  const val = currency === 'USD' ? ngnAmount / rate : ngnAmount;
  return buildFormat(val, currency);
};

export const formatUSDBase = (usdAmount: number, currency: 'NGN' | 'USD', rate: number) => {
  const val = currency === 'NGN' ? usdAmount * rate : usdAmount;
  return buildFormat(val, currency);
};

export const formatNum = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};
