const generateSlug = (item) => {
  return item
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const titleCase = (item) => {
  return item
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

const getMonths = (start_month, final_month) => {
  let arr_months = [];
  if (start_month != final_month) {
    if (start_month >= final_month) {
      for (let i = start_month; i <= 12; i++) {
        arr_months.push(i);
      }
      for (let i = 1; i <= final_month; i++) {
        arr_months.push(i);
      }
    } else {
      for (let i = start_month; i <= final_month; i++) {
        arr_months.push(i);
      }
    }
  } else {
    arr_months.push(start_month);
  }

  return arr_months;
};

module.exports = {
  generateSlug,
  titleCase,
  getMonths,
};
