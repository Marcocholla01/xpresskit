/**
 * Checks if a given value is numeric.
 *
 * This function returns `true` if the provided value can be converted
 * to a finite number, otherwise returns `false`.
 *
 * @param {*} value - The value to be checked.
 * @returns {boolean} `true` if the value is numeric, otherwise `false`.
 *
 * @example
 * isNumeric('123'); // true
 * isNumeric('12.34'); // true
 * isNumeric('abc'); // false
 * isNumeric(null); // false
 */
export const isNumeric = (value: any): boolean => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};
