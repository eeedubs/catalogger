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
      let $title = $(`<h3> ${resource.title} - <a href="${resource.resourceURL}">Source</a>`).appendTo($singleResource);
      let $createdBy = $(`<input type="hidden" id="createdBy" name="createdBy" value="${resource.created_by}">`).appendTo($singleResource);
      let $description = $(`<p> ${resource.description}</p>`).appendTo($singleResource);
        // footer contains the social buttons, including the button to toggle comments
      let $footer = $("<footer>").appendTo($singleResource);
        let $rateButton = $("<button>").addClass("social-buttons rate").text("Rate").appendTo($footer);
        let $likeButton = $("<button>").addClass("social-buttons like").text("Like").appendTo($footer);
        let $commentButton = $("<button>").addClass("social-buttons comment").text("Comment").appendTo($footer);
        let $selectForm = $(`<form class="submitCategory" method="POST" action="${baseURL}/api/resources/categorize">`).appendTo($footer);
          let $selectList = $(`<select id="select-list">`).appendTo($selectForm);
            let $option  = $(`<option value="" selected disabled hidden>Categorize</option>`).appendTo($selectList);
            for (let eachCategory of categories){
              let $selectValue = $(`<option id="select-category" value="${eachCategory.id}">${eachCategory.label}</option>`).appendTo($selectList);
            }
          let $selectInput = $(`<input class="categorizeSubmit" type="submit" value="Submit">`).appendTo($selectForm);
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
  $("body").on("click", "button.comment", (event) => {
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
        // console.log(comment.resource_id, targetResourceIDValue);
        if (targetResourceIDValue === comment.resource_id){
          let $comment = createComment(comment);
          $(element).children('div.postArea').prepend($comment);
        }
      })
    });
  };

  //LOADS THE RESOURCES ON PAGE LOAD - this works
  // getCategories obtains the different categories that the user has created
  //
  $(function getCategories() {
    $.ajax({
      method: "GET",
      url: `${baseURL}/api/users/categories`
    }).done((categories) => {
      loadResources(categories);
    })
  })

  function loadResources(userCategories) {
    if (document.location.pathname === `/${username}/categories`){
      let urlParams = new URLSearchParams(document.location.search);
      let catName = urlParams.get('name');
      $.ajax({
        method: "GET",
        url: `${baseURL}/api/resources/${catName}`,
      }).done((resources) => {
        console.log(resources);
        renderResources(resources, userCategories, () => {
          loadComments();
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
          loadComments();
        })
      })
      .fail((error) => {
        alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
      });
    }
  };

  // LOADS THE COMMENTS ON PAGE LOAD - this works
  function loadComments() {
    $.ajax({
      method: "GET",
      url: `${baseURL}/api/users/comments`
    }).done((comments) => {
      renderComments(comments);
    })
    .fail(() => {
      alert("Error: comments not rendering properly!");
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
    let selectedCategoryID  = Number($("#select-list option:selected").val());
    let resourceID          = Number($(event.target).closest('div.resource').find('input#resourceID')[0].value);
    $.ajax({
      method: "POST",
      url: `${baseURL}/api/resources/categorize`,
      data: {
        "resourceID": resourceID,
        "categoryID": selectedCategoryID
      },
      success: (results) => {
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
        console.log("SUCCESS!");
        $("form.submitComment").reset();
      }
    })
    .fail((error) => {
      console.log("fail");
      removeComment(newCommentData);
      alert(`${error.status}: ${error.statusText}`);
    });
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

