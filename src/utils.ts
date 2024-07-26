export const dateToAwsDate = (date: Date) =>
  date.toISOString().substring(0, 10);
