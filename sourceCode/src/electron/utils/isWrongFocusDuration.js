module.exports = (startTime, endTime) => {
  // allow open focus sessions
  if (!endTime) {
    return false;
  }

  if (endTime < startTime || (endTime - startTime) / 1000 / 3600 > 10) {
    return true;
  }
  return false;
};
