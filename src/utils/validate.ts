export const isNumeric = (value: any): boolean => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};
