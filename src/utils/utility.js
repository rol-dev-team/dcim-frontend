import moment from "moment";
import { USER_TICKET_VALIDATION_MESSAGES } from "../data/data";

export const generateStrongPassword = () => {
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "@$!%*?&";

  const passwordArray = [
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
  ];

  const allCharacters =
    upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

  for (let i = passwordArray.length; i < 8; i++) {
    passwordArray.push(
      allCharacters[Math.floor(Math.random() * allCharacters.length)]
    );
  }
  const shuffledPassword = passwordArray
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
};

export const getFirstCaracterOfFirstTwoWord = (fullName) => {
  if (fullName) {
    const firstTwoWords = fullName.split(" ").slice(0, 2);
    const initials = firstTwoWords.map((word) => word.charAt(0)).join("");
    return initials.toUpperCase();
  }
};

export const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  }
  return str;
};

export const getWarningMessage = (length) => {
  if (length === 0) return USER_TICKET_VALIDATION_MESSAGES.SELECT_AT_LEAST_ONE;

  if (length > 1) return USER_TICKET_VALIDATION_MESSAGES.SELECT_ONE_TICKET;
  return null;
};

export const toUTC = (date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
};

export const printDateRangeLastThirtyDays = () => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);

  return `${moment(last30Days.toISOString().split("T")[0]).format(
    "MMM Do YY"
  )} to ${moment(today.toISOString().split("T")[0]).format("MMM Do YY")}`;
};
