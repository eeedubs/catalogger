// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)

$(document).ready(function(){
  //CREATES THE RESOURCE DOM TREE
  function createResource (resource){
    var $allResources = $("<div>").addClass("all-resources");
      var $singleResource = $("<div>").addClass("resource").appendTo($allResources);
        var $img = $(`<img class="card-img-top" src="${resource.imageURL}"></img>`).appendTo($singleResource);
        var $title = $(`<h3> ${resource.title} - <a href="${resource.resourceURL}">Source</a>`).appendTo($singleResource);
        // $resourceId contains the id to each resource
        var $createdBy = $(`<input type="hidden" id="createdBy" name="createdBy" value="${resource.created_by}">`).appendTo($singleResource);
        // var $resourceId = $(`<input type="hidden" id="resourceId" name="resourceId" value="${resource.id}">`).appendTo($singleResource);
        var $description = $(`<p> ${resource.description}</p>`).appendTo($singleResource);
        // footer contains the social buttons, including the button to toggle comments
        var $footer = $("<footer>").appendTo($singleResource);
          var $rateButton = $("<button>").addClass("social-buttons rate").text("Rate").appendTo($footer);
          var $likeButton = $("<button>").addClass("social-buttons like").text("Like").appendTo($footer);
          var $commentButton = $("<button>").addClass("social-buttons comment").text("Comment").appendTo($footer);
          // commentContainer contains all of the posted comments
        var $commentContainer = $("<div>").addClass("comment-container").appendTo($singleResource);
          var $commentForm = $(`<form class="submitComment" method="POST" action="/api/users/comment">`).appendTo($commentContainer);
            var $resourceId = $(`<input type="hidden" id="resourceId" name="resourceId" value="${resource.id}">`).appendTo($commentForm);        
            var $textArea = $(`<textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>`).appendTo($commentForm);
            var $postButton = $(`<input class="commentPost" type="submit" value="Post">`).appendTo($commentForm);
          var $commentSection = $("<div>").addClass("postArea").appendTo($commentContainer);
    return $allResources;
  }

  // CREATES THE COMMENT DOM TREE
  function createComment (comment) {
    var $eachComment = $("<div>").addClass("comment");
      var $header = $("<header>").appendTo($eachComment);
        var $commentId = $(`<input type="hidden" id="commentId" name="commentId" value="${comment.id}">`).appendTo($eachComment);
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

  //RENDERS (appends) THE RESOURCES
  // 
  function renderResources(resourceData){
    resourceData.forEach(function(resource) {
      // console.log("Rendering resources: ", resource);
      var $resource = createResource(resource);
      $("section.feed").prepend($resource);
    });
  };


  //RENDERS (appends) THE COMMENTS

  // for each comment
    // for each div.comment-container
      // let target equal the hidden resourceId
      // if the target value equals the comment's resouce id
        // build the comment and prepend it to the resource's post area
  function renderComments(commentData){
    commentData.forEach(function(comment) {
      $("div.comment-container").each(function (index, value){
        let target = $(this).children('form').children("input#resourceId");
        if (target[0].value == comment.resource_id){
          let $comment = createComment(comment);
          $(this).children('div.postArea').prepend($comment);
        }
      })
    });
  };

  //LOADS THE RESOURCES ON PAGE LOAD - this works
  $(function loadResources() {
    if (document.location.pathname === '/'){
      $.ajax({
        method: "GET",
        url: "api/users/resources"
      }).done((resources) => {
        renderResources(resources);
      })
      .fail(() => {
        alert("Error: resources not rendering properly!");
      });
    }
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
      let target = $(this).children('form').children("input#resourceId");
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
      let target = $(this).children('form').children("input#resourceId");
      if (target[0].value == comment.resource_id){
        $(this).children('div.postArea').children("div.comment")[0].remove();
      }
    })
  }

  
  
  //   $.ajax({
  //     method: "GET",
  //     url: "api/users"
  //   }).done((users) => {
  //     for(user of users) {
  //       console.log("!!!!!!!!! user = ", user)
  //       $("<div>").text(user.name).appendTo($("body"));
  //     }
  //   });;



  // POST THE COMMENTS and RELOAD
  $("body").on("submit", "form.submitComment", function(event) {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "api/users/user_id",
      success: function(data){
        let newComment = {
          comment: event.target.commentInput.value,
          user_name: data[0].name,
          time_created: Date.now(),
          resource_id: event.target.resourceId.value
        }
        appendComment(newComment);
        let formData = $(this).serialize();
        $.ajax({
          method: "POST",
          url: "api/users/comment",
          data: formData,
          success: function(){
            $("form.submitComment")[0].reset();
          }
        })
        .fail((error) => {
          removeComment(newComment);
          alert(`${error.status}: ${error.statusText}`);
        });
      }
    })
    .fail((error) => {
      alert(`${error.status}: ${error.statusText}`);
    })
  })

    // Handles the naming of the category titles
  function renameCategory() {
    let extension = window.location.pathname.split('/');
    for (let i in extension){
      extension[i] = extension[i].charAt(0).toUpperCase() + extension[i].slice(1);
    }
    $('.display-4').text(extension.join(" "));
  };

    // Highlights the selected page as blue on the sidebar
    // Changes the header for each category by calling on renameCategory
  $(function changePageName() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active");
        renameCategory();
        $(this).children('button.list-group-item').addClass("active");
      }
    });
  });
})

