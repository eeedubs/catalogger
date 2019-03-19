// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)

$(document).ready(() => {
  const username    = JSON.parse($("input#user")[0].value).name;
  const userID      = JSON.parse($("input#user")[0].value).id;

  //CREATES THE RESOURCE DOM TREE
  function createResource (resource, categories){
    let $allResources = $("<div>").addClass("all-resources");
      let $singleResource = $("<div>").addClass("resource").appendTo($allResources);
        let $img = $(`<img class="card-img-top" src="${resource.imageURL}"></img>`).appendTo($singleResource);
        let $title = $(`<h3> ${resource.title} - <a href="${resource.resourceURL}">Source</a>`).appendTo($singleResource);
        // $resourceID contains the id to each resource
        let $createdBy = $(`<input type="hidden" id="createdBy" name="createdBy" value="${resource.created_by}">`).appendTo($singleResource);
        let $description = $(`<p> ${resource.description}</p>`).appendTo($singleResource);
        // footer contains the social buttons, including the button to toggle comments
        let $footer = $("<footer>").appendTo($singleResource);
          let $rateButton = $("<button>").addClass("social-buttons rate").text("Rate").appendTo($footer);
          let $likeButton = $("<button>").addClass("social-buttons like").text("Like").appendTo($footer);
          let $commentButton = $("<button>").addClass("social-buttons comment").text("Comment").appendTo($footer);
          let $selectForm = $(`<form class="submitCategory" method="POST" action="/api/resources/categorize">`).appendTo($footer);
            let $categoryFormResourceID = $(`<input type="hidden" id="categoryFormResourceID" name="categoryFormResourceID" value="${resource.id}">`).appendTo($selectForm);        
            let $selectList = $(`<select id="select-category">`).appendTo($selectForm);
              let $option  = $(`<option value="" selected disabled hidden>Categorize</option>`).appendTo($selectList);
              for (let eachCategory of categories){
                let $selectValue = $(`<option value="${eachCategory.id}">${eachCategory.label}</option>`).appendTo($selectList);
              }
            let $selectInput = $(`<input class="categorizeSubmit" type="submit" value="Submit">`).appendTo($selectForm);
          // commentContainer contains all of the posted comments
        let $commentContainer = $("<div>").addClass("comment-container").appendTo($singleResource);
          let $commentForm = $(`<form class="submitComment" method="POST" action="/api/users/comment">`).appendTo($commentContainer);
            let $commentFormResourceID = $(`<input type="hidden" id="commentFormResourceID" name="commentFormResourceID" value="${resource.id}">`).appendTo($commentForm);        
            let $textArea = $(`<textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>`).appendTo($commentForm);
            let $postButton = $(`<input class="commentPost" type="submit" value="Post">`).appendTo($commentForm);
          let $commentSection = $("<div>").addClass("postArea").appendTo($commentContainer);
    return $allResources;
  }

  // CREATES THE COMMENT DOM TREE
  function createComment (comment) {
    var $eachComment = $("<div>").addClass("comment");
      var $header = $("<header>").appendTo($eachComment);
        var $commentId = $(`<input type="hidden" id="commentID" name="commentID" value="${comment.id}">`).appendTo($eachComment);
        var $userName = $(`<h4 class="username">${comment.user_name}</h4>`).appendTo($header);
      var $content = $("<p>").text(`${comment.comment}`).appendTo($eachComment);
      var $footer = $("<footer>").appendTo($eachComment);
        var $span = $("<span>").addClass("timestamp").text(unixDate(comment.time_created)).appendTo($footer);
    return $eachComment;
  }    

  function unixDate(digits){
    const daysAgo = Math.floor((Date.now() - digits) / 86400000);
    const hoursAgo = Math.floor((Date.now() - digits) / 3600000);
    const minutesAgo = Math.floor((Date.now() - digits) / 60000);
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
  $("body").on("click", "button.comment", function(event) {
    $(event.target).parent("footer").siblings("div.comment-container").slideToggle("slow");
  });

  // APPENDS THE RESOURCES
  function renderResources(resourceData, userCategories){
    resourceData.forEach(function(resource) {
      var $resource = createResource(resource, userCategories);
      $("section.feed").prepend($resource);
    });
  };


  // APPENDS THE COMMENTS
  function renderComments(commentData){
    commentData.forEach(function(comment) {
      $("div.comment-container").each(function (index, value){
        let target = $(this).children('form').children("input#commentFormResourceID");
        if (target[0].value == comment.resource_id){
          let $comment = createComment(comment);
          $(this).children('div.postArea').prepend($comment);
        }
      })
    });
  };

  //LOADS THE RESOURCES ON PAGE LOAD - this works
  $(function loadResources() {
      let getCategories = $.ajax({
        method: "GET",
        url: "/api/users/categories",
        data: userID
      });
      getCategories.done((returnedCategories) => {
        let userCategories = returnedCategories;
        if (document.location.pathname === `/${username}/categories`){
          let urlParams = new URLSearchParams(document.location.search);
          let catName = urlParams.get('name');
          console.log(catName);
          $.ajax({
            method: "GET",
            url: `/api/categories?catName=${catName}`
          }).done((resources) => {
            renderResources(resources, userCategories);
          })
          .fail((error) => {
            alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
          });
        } else if (document.location.pathname === '/'){
          $.ajax({
            method: "GET",
            url: "/api/resources/"
          }).done((resources) => {
            renderResources(resources, userCategories);
          })
          .fail((error) => {
            alert(`Error: ${JSON.stringify(error.responseJSON.error)}`);
          });
        }
      })
  });

  // LOADS THE COMMENTS ON PAGE LOAD - this works
  $(function loadComments() {
    if (document.location === '/'){
      $.ajax({
        method: "GET",
        url: "api/users/comments"
      }).done((comments) => {
        renderComments(comments);
      })
      .fail(() => {
        alert("Error: comments not rendering properly!");
      });
    }
  });

  function appendComment(comment) {
    $("div.comment-container").each(function(){
      let target = $(this).children('form').children("input#commentFormResourceID");
      if (target[0].value == comment.resource_id){
        let $comment = createComment(comment);
        $(this).children('div.postArea').prepend($comment);
      }
    })
  }

  // For each div.comment container
  // let the target equal the resource ID
  // if the target resource's id equals the comment's resource ID
  function removeComment(comment) {
    $("div.comment-container").each(function(){
      let target = $(this).children('form').children("input#commentFormResourceID");
      if (target[0].value == comment.resource_id){
        $(this).children('div.postArea').children("div.comment")[0].remove();
      }
    })
  }

  $("body").on("submit", "form.submitCategory", function(event) {
    event.preventDefault();
    let selectedCategoryID = $(this).children('#select-category').val();
    let resourceID = $(this).children('#categoryFormResourceID').val();
    $.ajax({
      method: "POST",
      url: "/api/resources/categorize",
      data: {
        resourceID: resourceID,
        categoryID: selectedCategoryID
      },
      success: (results) => {
        results.success ? alert("The categorization was successful!") : alert(`Error: ${results.error}`);
      }
    }).fail((error) => {
      alert(`${error.status}: ${error.statusText}`);
    })
  })

  // POST THE COMMENTS and RELOAD
  $("body").on("submit", "form.submitComment", function(event) {
    event.preventDefault();
    let userComment = event.target.commentInput.value;
    let resourceID  = event.target.commentFormResourceID.value;
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
      url: "api/users/comment",
      data: newCommentData,
      success: () => {
        $("form.submitComment")[0].reset();
      }
    })
    .fail((error) => {
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

