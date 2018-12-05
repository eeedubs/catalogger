// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)

//CREATES THE RESOURCE DOM TREE
function createResource (resource){
  var $allResources = $("<div>").addClass("all-resources");
    var $singleResource = $("<div>").addClass("resource").appendTo($allResources);
      var $img = $(`<img class="card-img-top" src="${resource.imageURL}"></img>`).appendTo($singleResource);
      var $title = $(`<h3> ${resource.title} - <a href="${resource.resourceURL}">Source</a>`).appendTo($singleResource);
      var $resourceId = $(`<input type="hidden" id="resourceId" name="resourceId" value="${resource.id}">`).appendTo($singleResource);
      var $description = $(`<p> ${resource.description}</p>`).appendTo($singleResource);
      // footer contains the social buttons, including the button to toggle comments
      var $footer = $("<footer>").appendTo($singleResource);
        var $rateButton = $("<button>").addClass("social-buttons rate").text("Rate").appendTo($footer);
        var $likeButton = $("<button>").addClass("social-buttons like").text("Like").appendTo($footer);
        var $commentButton = $("<button>").addClass("social-buttons comment").text("Comment").appendTo($footer);
        // commentContainer contains all of the posted comments
      var $commentContainer = $("<div>").addClass("comment-container").appendTo($singleResource);
        var $commentForm = $(`<form class="submitComment" method="POST" action="/api/users/comment">`).appendTo($commentContainer);
          var $textArea = $(`<textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>`).appendTo($commentForm);
          var $postButton = $(`<input class="commentPost" type="submit" value="Post">`).appendTo($commentForm);
        var $commentSection = $("<div>").addClass("postArea").appendTo($commentContainer);
  return $allResources;
}

// CREATES THE COMMENT DOM TREE
function createComment (comment) {
  var $eachComment = $("<div>").addClass("comment");
    var $header = $("<header>").appendTo($eachComment);
      var $description = $(`<input type="hidden" id="commentId" name="commentId" value="${comment.id}">`).appendTo($eachComment);
      var $userName = $(`<h4 class="username">${comment.user_id}</h4>`).appendTo($header);
    var $content = $("<p>").text(`${comment.comment}`).appendTo($eachComment);
    var $footer = $("<footer>").appendTo($eachComment);
      var $span = $("<span>").addClass("timestamp").text("19 seconds ago").appendTo($footer);
  return $eachComment;
}    

window.addEventListener("click", function(event){
  if (event.toElement.innerHTML === "Comment"){
    console.log(event);
    $("div .comment-container").slideToggle("slow");
    $(".commentInput").focus();
  }
});

$(document).ready(function(){

  //RENDERS THE RESOURCES
  // 
  function renderResources(resourceData){
    resourceData.forEach(function(resource) {
      // console.log("Rendering resources: ", resource);
      var $resource = createResource(resource);
      $("section.feed").prepend($resource);
    });
  };

  //RENDERS THE COMMENTS
  function renderComments(commentData){
    commentData.forEach(function(comment) {
      var $comment = createComment(comment);
      $("section.feed div.all-resources div.resource div.comment-container div.postArea").prepend($comment);
    });
  };

  //LOADS THE RESOURCES ON PAGE LOAD (GET)
  $(function loadResources() {
    $.ajax({
      method: "GET",
      url: "api/users"
    }).done((resources) => {
      renderResources(resources);
    })
    .fail(() => {
      alert("Error: resources not rendering properly!");
    });
  });

  // LOADS THE COMMENTS - this works
  $(function loadComments() {
    $.ajax({
      method: "GET",
      url: "api/users"
    }).done((comments) => {
      renderComments(comments);
    })
    .fail(() => {
      alert("Error: comments not rendering properly!");
    });
  });
  

    //HANDLES THE TOGGLING OF COMMENTS (NOT POSTING)
  // $(window).load(function () {
  //   $("#comment").on("click", function() {
  //       // event.preventDefault();
  //     console.log("Toggle comment button clicked!");
  //     $("footer").slideToggle("slow");
  //     $(".commentInput").focus();
  //   })
  // })

    // POST THE COMMENTS and RELOAD
  $(".submitComment").on("submit", function(event) {
    event.preventDefault();
    const formContent = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "api/users",
      data: formContent
    }).done((comments) => {
      console.log("Got comments: ", comments);
      loadComments();
    })
    .fail(() => {
      alert("Error: comments not rendering properly!");
    });
  });

    // For constructing the resource postings:
    // $.ajax({
    //   method: "GET",
    //   url: "api/users"
    // }).done((resources) => {
    //   for(resource of resources) {
    //     // COPIES STRUCTURE FROM _feed.ejs
    //     let $newElement = $(`
    //       <div class="all-resources">
    //         <div class="resource">
    //           <img class="card-img-top" src='${resource.imageURL}'>
    //           <h3>
    //              ${resource.title} - <a href="${resource.resourceURL}">Source</a>
    //           </h3>
    //           <p>
    //             ${resource.description}
    //           </p>
    //           <footer>
    //             <button class="btn btn-primary">Rate</button>
    //             <button class="btn btn-primary">Like</button>
    //             <button class="btn btn-primary commentFeed">Comment</button>
    //           </footer>
    //           <div class="comment-container">
    //           </div>
    //           <div style="clear: both;">
    //           </div>
    //         </div>
    //       </div>
    //     `).prependTo($("section.feed"));
    //     }
    //   });


      // COPIES STRUCTURE FROM _comments.ejs
  //   $commentForm.click((event) => {
  //     event.preventDefault();
  //     $commentSection.slideToggle();
  //     console.log("Button Clicked!");
  //     $.ajax({
  //       method: "POST",
  //       url: "api/users"
  //     }).done((comments) => {
  //       for(eachComment of comments){
  //         let $newComment = $(`
  //           <div class="comment">
  //             <form class="submitComment" method="POST" action="/api/users/comment">
  //               <textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>
  //               <input class="commentPost" type="submit" value="Post">
  //             </form>
  //           </div>
  //           <div class="postArea">
  //             <header>
  //               <h4 class="username">${eachComment.userId}</h4>
  //             </header>
  //             <p>
  //               ${eachComment.newComment}
  //             </p>
  //             <footer>
  //               <span class="timestamp">
  //                 19 seconds ago
  //               </span>
  //             </footer>
  //           </div>
  //         `).appendTo("div.commentContainer");
  //       }
  //     })
  //   })
  // });


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

//   $.ajax({
//     method: "GET",
//     url: "api/users"
//   }).done((users) => {
//     for(user of users) {
//       console.log("!!!!!!!!! user = ", user)
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
