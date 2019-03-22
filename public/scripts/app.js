// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)

$(document).ready(() => {
  const username    = JSON.parse($("input#user")[0].value).name;
  const userID      = JSON.parse($("input#user")[0].value).id;
  const baseURL     = window.location.origin;

  //CREATES THE RESOURCE DOM TREE
  function createResource (resource, categories){
    let $allResources = $("<div>").addClass("all-resources");
    let $singleResource = $("<div>").addClass("resource").appendTo($allResources);
      let $img = $(`<img class="card-img-top" src="${resource.imageURL}"></img>`).appendTo($singleResource);
      let $resourceID = $(`<input type="hidden" id="resourceID" name="resourceID" value="${resource.id}">`).appendTo($singleResource);        
      let $createdBy = $(`<input type="hidden" id="createdBy" name="createdBy" value="${resource.created_by}">`).appendTo($singleResource);
      let $title = $(`<h3> ${resource.title} - <a href="${resource.resourceURL}">Source</a>`).appendTo($singleResource);
      let $description = $(`<p> ${resource.description}</p>`).appendTo($singleResource);
        // footer contains the social buttons, including the button to toggle comments
      let $footer = $("<footer>").appendTo($singleResource);
        // let $rateButton = $("<button>").addClass("social-buttons rate").text("Rate").appendTo($footer);
        let $selectRatingForm = $(`<form id="submitRating" class="rate-button" method="POST" action="${baseURL}/api/resources/rate">`).appendTo($footer);
          let $selectRatingList = $(`<select id="selectRatingList">`).appendTo($selectRatingForm);
            let $selectRatingOption = $(`<option value="" selected disabled hidden>Rate Article</option>`).appendTo($selectRatingList);
            for (let ratingValue = 1; ratingValue <= 5; ratingValue++){
              let $selectRatingValue = $(`<option id="select-rating" value="${ratingValue}">${ratingValue} Stars</option>`).appendTo($selectRatingList);
            }
            let $commentButton = $("<button>").addClass("comment-button").text("Comment").appendTo($footer);
        let $likeCount = $(`<p class="like-count">0</p>`).appendTo($footer);
        let $likeButton = $(`<i id="like-button" class="fas fa-thumbs-up">`).appendTo($footer);
        let $selectCategoryForm = $(`<form class="submitCategory" method="POST" action="${baseURL}/api/resources/categorize">`).appendTo($footer);
          let $selectCategoryList = $(`<select id="selectCategoryList">`).appendTo($selectCategoryForm);
            let $selectCategoryOption  = $(`<option value="" selected disabled hidden>Categorize</option>`).appendTo($selectCategoryList);
            for (let eachCategory of categories){
              let $selectCategoryValue = $(`<option id="select-category" value="${eachCategory.id}">${eachCategory.label}</option>`).appendTo($selectCategoryList);
            }
          let $selectInput = $(`<input class="categorizeSubmit" type="submit" value="Submit">`).appendTo($selectCategoryForm);
          // commentContainer contains all of the posted comments
        let $commentContainer = $("<div>").addClass("comment-container").appendTo($singleResource);
          let $commentForm = $(`<form class="submitComment" method="POST" action="${baseURL}/api/users/comment">`).appendTo($commentContainer);
            let $textArea = $(`<textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>`).appendTo($commentForm);
            let $postButton = $(`<input class="commentPost" type="submit" value="Post">`).appendTo($commentForm);
          let $commentSection = $("<div>").addClass("postArea").appendTo($commentContainer);
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

  // COMMENT BOX TOGGLER
  $("body").on("click", "button.comment-button", (event) => {
    $(event.target).parent("footer").siblings("div.comment-container").slideToggle("slow");
  });

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

  function getResources(userCategories) {
    if (document.location.pathname === `/${username}/categories`){
      let urlParams = new URLSearchParams(document.location.search);
      let catName = urlParams.get('name');
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/resources/${catName}`,
      }).done((resources) => {
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });
    } else if (document.location.pathname === '/'){
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/resources/`
      }).done((resources) => {
        renderResources(resources, userCategories, () => {
          getComments();
          getLikes();
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
      url: `${baseURL}/api/users/comments`
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

  function appendComment(comment) {
    $("div.comment-container").each((index, container) => {
      let targetID = Number($(container).closest('div.resource').find('input#resourceID')[0].value);
      if (targetID === comment.resource_id){
        let $comment = createComment(comment);
        $(container).find('div.postArea').prepend($comment);
      }
    })
  }

  // For each div.comment container
  // let the target equal the resource ID
  // if the target resource's id equals the comment's resource ID
  function removeComment(comment) {
    $("div.comment-container").each((index, container) => {
      let targetID = Number($(container).closest('div.resource').find('input#resourceID')[0].value);
      if (targetID === comment.resource_id){
        $(container).find('div.comment').remove();
      }
    })
  }

  $("body").on("submit", "form.submitCategory", (event) => {
    event.preventDefault();
    let selectedCategoryID  = Number($(event.target).find("#selectCategoryList option:selected").val());
    let resourceID          = Number($(event.target).closest('div.resource').find('input#resourceID')[0].value);
    $.ajax({
      method: "POST",
      url: `${baseURL}/api/resources/categorize`,
      data: {
        "user_id": userID,
        "resource_id": resourceID,
        "category_id": selectedCategoryID
      },
      success: (results) => {
        $(event.target).find("#selectCategoryList option:selected").removeAttr("selected");
        results.success ? alert("The categorization was successful!") : alert(`Error: ${results.error}`);
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

  // $(function makeActive() {
  //   var url = document.location.href;
  //   $('.list-group form').each(function() {
  //     if (url === this.action + "?") {
  //       $(this).children('button.list-group-item').addClass("active");
  //       //  renameCategory();
  //       //  $(this).children('button.list-group-item').addClass("active");
  //     }
  //   })
  // })
})

