const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

const dayError = document.getElementById("day-error");
const monthError = document.getElementById("month-error");
const yearError = document.getElementById("year-error");

const submitBtn = document.querySelector('button[type="submit"]');

const yearResult = document.getElementById("year-result");
const monthResult = document.getElementById("month-result");
const dayResult = document.getElementById("day-result");

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  calculateAge();
});

function calculateAge() {
  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  clearErrors();

  if (!validateInputs(day, month, year)) {
    return;
  }

  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const daysInPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += daysInPrevMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  yearResult.textContent = years;
  monthResult.textContent = months;
  dayResult.textContent = days;
}

function validateInputs(day, month, year) {
  let isValid = true;
  const today = new Date();

  if (!dayInput.value.trim()) {
    showError(dayInput, dayError, "This field is required");
    isValid = false;
  } else if (day < 1 || day > 31) {
    showError(dayInput, dayError, "Must be a valid day");
    isValid = false;
  }

  if (!monthInput.value.trim()) {
    showError(monthInput, monthError, "This field is required");
    isValid = false;
  } else if (month < 1 || month > 12) {
    showError(monthInput, monthError, "Must be a valid month");
    isValid = false;
  }

  if (!yearInput.value.trim()) {
    showError(yearInput, yearError, "This field is required");
    isValid = false;
  } else if (year > today.getFullYear()) {
    showError(yearInput, yearError, "Must be in the past");
    isValid = false;
  }

  // Only check the exact calendar date once the basic ranges pass,
  // so we catch things like 31 April or 29 Feb on a non-leap year.
  if (isValid) {
    const testDate = new Date(year, month - 1, day);
    const isRealDate =
      testDate.getFullYear() === year &&
      testDate.getMonth() === month - 1 &&
      testDate.getDate() === day;

    if (!isRealDate) {
      showError(dayInput, dayError, "Must be a valid date");
      isValid = false;
    } else if (testDate > today) {
      showError(dayInput, dayError, "Must be in the past");
      isValid = false;
    }
  }

  return isValid;
}

function showError(input, errorEl, message) {
  input.classList.add("error-input");
  errorEl.textContent = message;
  errorEl.classList.add("show");
}

function clearErrors() {
  [dayInput, monthInput, yearInput].forEach((input) =>
    input.classList.remove("error-input")
  );
  [dayError, monthError, yearError].forEach((errorEl) => {
    errorEl.classList.remove("show");
    errorEl.textContent = "---";
  });
}