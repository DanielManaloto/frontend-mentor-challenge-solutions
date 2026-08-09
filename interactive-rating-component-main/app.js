const ratingState = document.querySelector("#rating-state");
const thankYouState = document.querySelector("#thank-you-state");
const submitButton = document.querySelector("#submit-button");
const selectedRatingText = document.querySelector("#selected-rating");

submitButton.addEventListener("click", function () {
  const selectedInput = document.querySelector('input[name="rating"]:checked');

  if (!selectedInput) {
    return;
  }

  selectedRatingText.textContent = selectedInput.value;

  ratingState.style.display = "none";
  thankYouState.style.display = "flex";
});