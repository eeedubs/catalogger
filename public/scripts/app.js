// App.js handles the functionality of various components within the site, without reloading
// the web page (jQuery - client side)
$(() => {
  // 
  $(function () {
    let $buttons = $("div.resource").children("footer").children("button");
    let $postComment = $("section.comment-container").children("form").children(".commentPost");
    let $commentSection = $("section.comment-container").show();
    let $input = $(".commentInput");

    $buttons.click((event) => {
      event.preventDefault();
      $commentSection.slideToggle();
      $input.focus();
    })

    $.ajax({
      method: "GET",
      url: "api/users"
    }).done((resources) => {
      for(resource of resources) {
        // COPIES STRUCTURE FROM _feed.ejs
        const $newElement = $(`
        <div class="resource">
          <img class="card-img-top" src='${resource.imageURL}'>
          <h3>
          ${resource.title} - <a href="${resource.resourceURL}">Source</a>
          </h3>
          <p>
          ${resource.description}
          </p>
          <footer>
            <button class="btn btn-primary">Rate</button>
            <button class="btn btn-primary">Like</button>
            <button class="btn btn-primary commentFeed">Comment</button>
          </footer>
          <div class="comment-container">
                  <form class="submitComment" method="POST" action="/api/users/comment">
                      <textarea class="commentInput" type="text" name="commentInput" placeholder="Type your comment..."></textarea>
                      <input class="commentPost" type="submit" value="Comment">
                  </form>
                  <div class="postArea">
                  </div>
            </div>
          <div style="clear: both;">
          </div>
        </div>
          `).prependTo($(".all-resources"));
          const $commentFeedToggle = $newElement.find(".commentFeed");

          console.log("<a class='btn btn-primary commentFeed'>Comment</a> :  ====> ", $commentFeedToggle);
      }
      // makeNewEventHandlers(); // might not need
    });


    // handles the toggling of the comment section sliding
    $postComment.click((event) => {
      event.preventDefault();
      console.log("Button Clicked!");
      $.ajax({
        method: "POST",
        url: "api/users"
      }).done((comments) => {
        for(eachComment of comments){
          // COPIES STRUCTURE FROM _comments.ejs
          const $newComment = $(`
          <div class="comment">
            <header>
              <h4 class="username">${eachComment.userId}</h4>
            </header>
            <p>
              ${eachComment.newComment}
            </p>
            <footer>
              <span class="timestamp">
                19 seconds ago
              </span>
            </footer>
          </div>
          `).appendTo(".postArea");
        }
      })
    })
  });




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
  $(function() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active");
        renameCategory();
        $(this).children('button.list-group-item').addClass("active");
      }
    });
  });
});


//   $.ajax({
//     method: "GET",
//     url: "api/users"
//   }).done((users) => {
//     for(user of users) {
//       console.log("!!!!!!!!! user = ", user)
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
