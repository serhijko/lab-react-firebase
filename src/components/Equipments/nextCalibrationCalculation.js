export default function nextDate(per, lastDate) {
  const day = new Date(lastDate).getDate();
  const months = new Date(lastDate).getMonth() + 1 + per / 1;
  const month = months % 12;
  const year = new Date(lastDate).getFullYear() + (months - month) / 12;

  let insert1, insert2;
  if (month < 10) {
    insert1 = '-0';
  } else {
    insert1 = '-';
  }

  if (day < 10) {
    insert2 = '-0';
  } else {
    insert2 = '-';
  }

  const nextDate = year.toString().concat(
    insert1, month, insert2, day
  )

  return nextDate;
}
