$(document).ready(() => {
  const username    = JSON.parse($("input#user")[0].value).name;
  const userID      = JSON.parse($("input#user")[0].value).id;
  const baseURL     = window.location.origin;

    // COMMENT BOX TOGGLER
    $("body").on("click", "button.comment-button", (event) => {
      $(event.target).closest("div.all-resources").find("div.comment-container").slideToggle("slow");
    });
})