const convertToOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastTwoDigits = Math.abs(number) % 100;
    const lastDigit = lastTwoDigits % 10;

    return number + (suffixes[(lastTwoDigits - 20) % 10] || suffixes[lastDigit] || suffixes[0]);
};

module.exports = {
    convertToOrdinal,
};
