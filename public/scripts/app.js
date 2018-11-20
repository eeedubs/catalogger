// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)
$(() => {

  $(function () {
    // let $buttons = $("div.resource").children(".comment-container").children("form.submitContent").children("button.btn.btn-primary.commentFeed");
    // let $commentForm = $("div.resource").children("div.comment-container").children("form.submitContent");
    // let $commentSection = $("div.resource").children("div.comment-container");
    // let $commentInput = $("div.resource").children("div.comment-container").children("form.submitContent").children(".commentInput");
    
    // $buttons.click((event) => {
    //   // event.preventDefault();
    //   // console.log("Comment toggle button clicked!");
    //   $commentSection.slideToggle();
    //   $commentInput.focus();
    // })

    //CREATES THE RESOURCE DOM TREE
    function createResource (resource){
      var $allResources = $("<div>").addClass("all-resources");
      var $singleResource = $("<div>").addClass("resource").appendTo($allResources);
      var $img = $("<img>").addClass("card-img-top").attr("src", "`${resources.imageURL}`").appendTo($singleResource);
      var $title = $("<h3>").text("`${resources.title}` - <a href='`${resources.resourceURL}`'>Source</a></h3>").appendTo($singleResource);
      var $description = $("<p>").text("`$(resources.description}`").appendTo($singleResource);
      var $footer = $("<footer>").appendTo($singleResource);
      var $rateButton = $("<button>").addClass("social-buttons rate").text("Rate").appendTo($footer);
      var $likeButton = $("<button>").addClass("social-buttons like").text("Like").appendTo($footer);
      var $commentButton = $("<button>").addClass("social-buttons comment").text("Comment").appendTo($footer);
      return $allResources;
    }

    //RENDERS THE RESOURCES
    function renderResources(resourceData){
      resourceData.forEach(function(resource) {
        var $resource = createResource(resource);
        $("section.feed").prepend($resource);
      });
    };

    //LOADS THE RESOURCES ON PAGE LOAD (GET)
    $(function loadResources() {
      $.ajax({
        method: "GET",
        url: "api/users"
      }).done((resources) => {
        console.log("Got resources! Rendering...");
        renderResources(resources);
      })
      .fail(() => {
        alert("Error: resources not rendering properly!");
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
    //           <h3>${resource.title} - <a href="${resource.resourceURL}">Source</a></h3>
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

    // CREATES THE COMMENT DOM TREE
    function createComment (comment) {
      var $eachComment = $("<div>").addClass("comment");
      var $header = $("<header>").appendTo($eachComment);
      var $userName = $("<h4>").addClass("username").text("`${user_comments.userId}`").appendTo($header);
      var $content = $("<p>").text(`${user_comments.comment}`).appendTo($eachComment);
      var $footer = $("<footer>").appendTo($eachComment);
      var $span = $("<span>").addClass("timestamp").text("19 seconds ago").appendTo($footer);
      return $eachComment;
    }

    //HANDLES THE TOGGLING OF COMMENTS (NOT POSTING)
    $(function toggleComments() {
      let $commentToggleButton = $(".feed .all-resources .resource footer .social-buttons .comment");
      $commentToggleButton.on("click", function() {
        $(".feed .all-resources .resource .comment-container").slideToggle("slow");
        $(".feed .all-resources .resource .comment-container .comment form.submitComment .commentInput").focus();
      })
    });

    //RENDERS THE COMMENTS
    function renderComments(commentData){
      commentData.forEach(function(comment) {
        var $comment = createComment(comment);
        $("div.comment-container").prepend($comment);
      });
    };

    //LOADS THE COMMENTS
    // function loadComments() {
    $(".feed .all-resources .resource .comment-container .comment form").on("submit", function(event) {
      event.preventDefault();
      const formContent = $(this).serialize();
      $.ajax({
        method: "GET",
        url: "api/users"
      }).done((comments) => {
        console.log("Got comments! Rendering...");
        renderComments(comments);
      })
      .fail(() => {
        alert("Error: comments not rendering properly!");
      });
    });
  })

  //   $(".feed .all-resources .resource .comment-container .comment form").on("submit", function(event) {
  //     event.preventDefault();
  //     const formContent = $(this).serialize();
  //     $.ajax({
  //       method: "POST",
  //       url: "api/users"
  //     }).done((comments) =

  // })

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
