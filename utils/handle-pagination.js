/**
 * Calculates pagination options based on the provided page and limit.
 *
 * @param {string} page - The current page number, defaults to 1 if not a valid number.
 * @param {string} limit - The number of items per page, defaults to 10 if not a valid number.
 * @returns {Object} An object containing parsedLimit (the number of items per page)
 *                   and skip (the number of items to skip for pagination).
 */
function getPaginationOptions(page = '1', limit = '10') {
  const parsePage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsePage - 1) * parsedLimit;

  return { parsedLimit, skip };
}

module.exports = { getPaginationOptions };
