import { useApp } from "../context/AppContext";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianNums(str) {
  return String(str).replace(/[0-9]/g, (d) => FA_DIGITS[d]);
}

export function useFormatNum() {
  const { language } = useApp();
  return (str) => {
    if (language === "fa") return toPersianNums(str);
    return String(str);
  };
}
