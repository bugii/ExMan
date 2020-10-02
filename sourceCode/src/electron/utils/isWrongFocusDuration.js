module.exports = (startTime, endTime) => {
  if (endTime < startTime || (endTime - startTime) / 1000 / 3600 > 10) {
    return true;
  }
  return false;
};
