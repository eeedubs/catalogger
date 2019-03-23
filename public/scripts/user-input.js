
$(document).ready(() => {
  const username    = JSON.parse($("input#user")[0].value).name;
  const userID      = JSON.parse($("input#user")[0].value).id;
  const baseURL     = window.location.origin;

  $("body").on("submit", "form#submitCategory", (event) => {
    event.preventDefault();
    let resourceID          = Number($(event.target).closest('div.resource').find('input#resourceID')[0].value);
    let selectedCategoryID  = Number($(event.target).find("#selectCategoryList option:selected").val());
    $.ajax({
      method: "POST",
      url: `${baseURL}/api/resources/categorize`,
      data: {
        user_id: userID,
        resource_id: resourceID,
        category_id: selectedCategoryID
      },
      success: (results) => {
        $(event.target).find("#selectCategoryList option:selected").removeAttr("selected");
        $(event.target).find("#selectCategoryList").prop("selectedIndex", 0);
        results.success ? alert("The categorization was successful!") : alert(`Error: ${results.error}`);
      }
    }).fail((error) => {
      alert(`${error.status}: ${error.statusText}`);
    })
  })

  $("body").on("submit", "form#submitRating", (event) => {
    event.preventDefault();
    let oldRating       = $(event.target).closest("div.resource").find("input#userRating").val();
    let newRating       = Number($(event.target).find("#selectRatingList option:selected").val());
    let resourceID      = Number($(event.target).closest('div.resource').find('input#resourceID')[0].value);
    let createdByID     = Number($(event.target).closest('div.resource').find('input#createdBy')[0].value);
    if (userID === createdByID){
      alert('You cannot rate your own articles!');
      $(event.target).find("#selectRatingList").prop("selectedIndex", 0);
      return;
    }
    $.ajax({
      method: "POST",
      url: `${baseURL}/api/resources/rate`,
      data: {
        rating: newRating,
        user_id: userID,
        resource_id: resourceID
      },
      success: (ratingResults) => {
        let totalRatingsLength = ratingResults.results.length;
        let sumRatings = 0;
        for (let eachResult of ratingResults.results){
          sumRatings += Number(eachResult.rating);
        }
        let newAverage = (sumRatings / totalRatingsLength).toFixed(2);
        let $userRating = $(`<input hidden id="userRating" name="userRating" value="${newRating}">`);
        $(event.target).find("#selectRatingList option:selected").removeAttr("selected");
        $(event.target).find("#selectRatingList").prop("selectedIndex", 0);
        $(event.target).closest('div.resource').find('p.average-rating').text(`${newAverage}/5`);
        if (ratingResults.update){
          $(event.target).closest('div.resource').find('input#userRating').val(newRating);
          alert(`The rating was successfully changed from ${oldRating} Stars to ${newRating} Stars`)
        } else {
          $(event.target).closest('div.resource').append($userRating);
          alert("The rating was successfully posted!") 
        };
      }
    }).fail((error) => {
      alert(`${error.status}: ${error.statusText}`);
    })
  })

  // POST THE COMMENTS and RELOAD
  $("body").on("submit", "form.submitComment", (event) => {
    event.preventDefault();
    let userComment = event.target.commentInput.value;
    let resourceID  = Number($(event.target).closest('div.resource').find('input#resourceID')[0].value);
    let newCommentData = {
      comment: userComment,
      user_name: username,
      user_id: userID,
      time_created: Date.now(),
      resource_id: resourceID
    }
    appendComment(newCommentData);
    $.ajax({
      method: "POST",
      url: `${baseURL}/api/users/comment`,
      data: newCommentData,
      success: () => {
        $(event.target)[0].reset();
      }
    })
    .fail((error) => {
      removeComment(newCommentData);
      alert(`${error.status}: ${error.statusText}`);
    });
  })

  $("body").on("click", "#like-button", (event) => {
    event.preventDefault();
    let resourceID  = Number($(event.target).closest('div.resource').find('input#resourceID')[0].value);
    let createdByID = Number($(event.target).closest('div.resource').find('input#createdBy')[0].value);
    if (userID === createdByID){
      alert('You cannot like your own articles!');
      return;
    }
    let likeData = {
      user_id: userID,
      resource_id: resourceID
    };
    $.ajax({
      method: "POST",
      url: `${baseURL}/api/resources/like`,
      data: likeData,
      success: (newLikeData) => {
        $(event.target).closest('div.resource').find("p.like-count").text(newLikeData.length);
      }
    })
    .fail((error) => {
      alert(`${error.status}: ${error.statusText}`);
    })
  })
})