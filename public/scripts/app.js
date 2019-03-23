// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)

$(document).ready(() => {
  const username    = JSON.parse($("input#user")[0].value).name;
  const userID      = JSON.parse($("input#user")[0].value).id;
  const baseURL     = window.location.origin;

  //CREATES THE RESOURCE DOM TREE
  function createResource (resource, categories){
    let $allResources = $(`<div class="all-resources">`);
    let $singleResource = $(`<div class="resource">`).appendTo($allResources);
      let $img = $(`<img class="card-img-top" src="${resource.imageURL}"></img>`).appendTo($singleResource);
      let $resourceID = $(`<input type="hidden" id="resourceID" name="resourceID" value="${resource.id}">`).appendTo($singleResource);        
      let $createdBy = $(`<input type="hidden" id="createdBy" name="createdBy" value="${resource.created_by}">`).appendTo($singleResource);
      let $title = $(`<h3> ${resource.title} <br> <a href="${resource.resourceURL}">Source</a>`).appendTo($singleResource);
      let $description = $(`<p class="resourceDescription"> ${resource.description}</p>`).appendTo($singleResource);
      let $footer = $("<footer>").appendTo($singleResource);
        let $leftSideDivs = $(`<div class="left-side-divs">`).appendTo($footer);
          let $commentButton = $(`<button class="comment-button">Comments</button>`).appendTo($leftSideDivs);
          let $likeDiv = $(`<div class="like-div">`).appendTo($leftSideDivs);
            let $likeCount = $(`<p class="like-count">0</p>`).appendTo($likeDiv);
            let $likeButton = $(`<i id="like-button" class="fas fa-thumbs-up">`).appendTo($likeDiv);
          let $displayRatingWords = $(`<p class="average-rating-declaration">Average Rating: </p>`).appendTo($leftSideDivs)
          let $displayRating = $(`<p class="average-rating">N/A.</p>`).appendTo($leftSideDivs);
        let $rightSideDivs = $(`<div class="right-side-divs">`).appendTo($footer);
          let $selectRatingForm = $(`<form id="submitRating" method="POST" action="${baseURL}/api/resources/rate">`).appendTo($rightSideDivs);
            let $selectRatingList = $(`<select id="selectRatingList">`).appendTo($selectRatingForm);
              let $selectRatingOption = $(`<option id="select-rating-disabled" value="" selected disabled hidden>Rate Article</option>`).appendTo($selectRatingList);
              for (let ratingValue = 1; ratingValue <= 5; ratingValue++){
                let $selectRatingValue = $(`<option id="select-rating" value="${ratingValue}">${ratingValue} Stars</option>`).appendTo($selectRatingList);
              }
            let $selectRatingInput = $(`<input class="ratingSubmit" type="submit" value="Submit">`).appendTo($selectRatingForm);
          let $selectCategoryForm = $(`<form id="submitCategory" method="POST" action="${baseURL}/api/resources/categorize">`).appendTo($rightSideDivs);
            let $selectCategoryList = $(`<select id="selectCategoryList">`).appendTo($selectCategoryForm);
              let $selectCategoryOption  = $(`<option id="select-category-disabled" value="" selected disabled hidden>Categorize</option>`).appendTo($selectCategoryList);
              for (let eachCategory of categories){
                let $selectCategoryValue = $(`<option id="select-category" value="${eachCategory.id}">${eachCategory.label}</option>`).appendTo($selectCategoryList);
              }
            let $selectCategoryInput = $(`<input class="categorySubmit" type="submit" value="Submit">`).appendTo($selectCategoryForm);
          // commentContainer contains all of the posted comments
        let $commentContainer = $(`<div class="comment-container">`).appendTo($singleResource);
          let $commentForm = $(`<form class="submitComment" method="POST" action="${baseURL}/api/users/comment">`).appendTo($commentContainer);
            let $textArea = $(`<textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>`).appendTo($commentForm);
            let $postButton = $(`<input class="commentPost" type="submit" value="Post">`).appendTo($commentForm);
          let $commentSection = $(`<div class="postArea">`).appendTo($commentContainer);
    return $allResources;
  }

  // CREATES THE COMMENT DOM TREE
  function createComment (comment) {
    let $eachComment = $("<div>").addClass("comment");
      let $header = $("<header>").appendTo($eachComment);
        let $commentID = $(`<input type="hidden" id="commentID" name="commentID" value="${comment.id}">`).appendTo($eachComment);
        let $userName = $(`<h4 class="username">${comment.user_name}</h4>`).appendTo($header);
      let $content = $("<p>").text(`${comment.comment}`).appendTo($eachComment);
      let $footer = $("<footer>").appendTo($eachComment);
        let $span = $("<span>").addClass("timestamp").text(unixDate(comment.time_created)).appendTo($footer);
    return $eachComment;
  }    

  function unixDate(digits){
    let daysAgo = Math.floor((Date.now() - digits) / 86400000);
    let hoursAgo = Math.floor((Date.now() - digits) / 3600000);
    let minutesAgo = Math.floor((Date.now() - digits) / 60000);
    if (daysAgo < 2 && hoursAgo < 2 && minutesAgo < 2){
        return "Moments ago.";
    } else if (daysAgo < 2 && hoursAgo < 2){
        return minutesAgo + " minutes ago.";
    } else if (daysAgo < 2 && hoursAgo >= 2){
        return hoursAgo + " hours ago.";
    } else {
        return daysAgo + " days ago";
    }
  }

  // APPENDS THE RESOURCES
  function renderResources(resourceData, userCategories, callback){
    resourceData.forEach((resource) => {
      let $resource = createResource(resource, userCategories);
      $("section.feed").prepend($resource);
    });
    callback();
  };


  // APPENDS THE COMMENTS
  function renderComments(commentData){
    commentData.forEach((comment) => {
      $("div.comment-container").each((index, element) => {
        let targetResourceIDValue = Number($(element).closest('div.resource').find('input#resourceID')[0].value);    
        if (targetResourceIDValue === comment.resource_id){
          let $comment = createComment(comment);
          $(element).children('div.postArea').prepend($comment);
        }
      })
    });
  };

  function renderLikes(likeData){
    likeData.forEach((like) => {
      $("div.resource").each((index, element) => {
        let targetResourceIDValue = Number($(element).find('input#resourceID')[0].value); 
        if (targetResourceIDValue === like.resource_id){
          let oldLikeCount = Number($(element).find("p.like-count").text());
          $(element).find("p.like-count").text(oldLikeCount + 1);
        }
      })
    })
  }

  function renderRatings(ratingData){
    let totalRatingsObject = {}
    ratingData.forEach((eachRating) => {
      let rateResourceID = String(eachRating.resource_id);
      if (totalRatingsObject[rateResourceID]){
        let oldRatingTotalLength   = totalRatingsObject[rateResourceID].totalLength;
        let oldRatingTotalSum      = totalRatingsObject[rateResourceID].totalSum;
        totalRatingsObject[rateResourceID].totalLength = oldRatingTotalLength + 1;
        totalRatingsObject[rateResourceID].totalSum = oldRatingTotalSum + eachRating.rating;
      } else {
        totalRatingsObject[rateResourceID] = {"totalLength": 1, "totalSum": eachRating.rating};
      }
      let newAverage = (totalRatingsObject[rateResourceID].totalSum / totalRatingsObject[rateResourceID].totalLength).toFixed(2);
      $("div.resource").each((index, element) => {
        let targetResourceIDValue = Number($(element).find('input#resourceID')[0].value);
        if (targetResourceIDValue === eachRating.resource_id){
          $(element).find("p.average-rating").text(`${newAverage}/5`);
          if (eachRating.user_id === userID){
            let $userRating = $(`<input hidden id="userRating" name="userRating" value="${eachRating.rating}">`);
            $(element).append($userRating);
          }
        }
      })
    })
  }

  //LOADS THE RESOURCES ON PAGE LOAD - this works
  // getCategories obtains the different categories that the user has created
  //
  $(function getCategories() {
    $.ajax({
      method: "GET",
      url: `${baseURL}/api/users/categories`
    }).done((categories) => {
      getResources(categories);
    })
  })

  // URLSearchParams acquires the query parameters from the URL link
  function getResources(userCategories) {
    let searchPath      = `/search`;
    let categoriesPath  = `/${username}/categories`;
    let resourcesPath   = `/${username}/resources`;
    let likedPath       = `/${username}/liked-resources`;

    // /search?query=dogvideos
    if (document.location.pathname === searchPath){
      let urlParams = new URLSearchParams(document.location.search);
      let queryString = urlParams.get('query');
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/resources/search?query=${queryString}`,
      }).done((resources) => {
        if (!resources[0]){
          alert("No resources were found under this category.");
          return;
        }
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
          getRatings();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });

    // /steven/categories
    } else if (document.location.pathname === categoriesPath){
      let urlParams = new URLSearchParams(document.location.search);
      let catName = urlParams.get('name');
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/resources/categories?catName=${catName}`,
      }).done((resources) => {
        if (!resources[0]){
          alert("No resources were found under this category.");
          return;
        }
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
          getRatings();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });

      // /steven/resources
    } else if (document.location.pathname === resourcesPath){
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/users/${username}/resources`,
      }).done((resources) => {
        if (!resources[0]){
          alert('No resources were found.');
          return;
        }
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
          getRatings();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });

      // /steven/resources/liked
    } else if (document.location.pathname === likedPath){
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/users/${username}/resources/liked`,
      }).done((resources) => {
        if (!resources[0]){
          alert("You haven't liked any resources yet.");
          return;
        }
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
          getRatings();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });
      // /
    } else if (document.location.pathname === '/'){
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/resources/`
      }).done((resources) => {
        if (!resources[0]){
          alert("No resources were found.");
          return;
        }
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
          getRatings();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });
    }
  };

  // LOADS THE COMMENTS ON PAGE LOAD - this works
  function getComments() {
    $.ajax({
      method: "GET",
      url: `${baseURL}/api/resources/comments`
    }).done((commentData) => {
      renderComments(commentData);
    })
    .fail(() => {
      alert("Error: comments not rendering properly!");
    })
  };

  function getLikes() {
    $.ajax({
      method: "GET",
      url: `${baseURL}/api/resources/likes`
    }).done((likeData) => {
      renderLikes(likeData);
    })
    .fail(() => {
      alert("Error: likes not rendering properly!");
    })
  };

  function getRatings() {
    $.ajax({
      method: "GET",
      url: `${baseURL}/api/resources/ratings`
    }).done((ratingData) => {
      renderRatings(ratingData);
    })
    .fail(() => {
      alert("Error: ratings not rendering properly!");
    })
  };

  function appendComment(comment) {
    $("div.comment-container").each((index, container) => {
      let targetID = Number($(container).closest('div.resource').find('input#resourceID')[0].value);
      if (targetID === comment.resource_id){
        let $comment = createComment(comment);
        $(container).find('div.postArea').prepend($comment);
      }
    })
  }

  function removeComment(comment) {
    $("div.comment-container").each((index, container) => {
      let targetID = Number($(container).closest('div.resource').find('input#resourceID')[0].value);
      if (targetID === comment.resource_id){
        $(container).find('div.comment').remove();
      }
    })
  }
})

