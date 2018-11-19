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

    // handles the toggling of the comment section sliding
    $postComment.click((event) => {
      event.preventDefault();
      console.log("Button Clicked!");
    })
  })

  $.ajax({
    method: "GET",
    url: "api/users"
  }).done((resources) => {
    for(resource of resources) {
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
        <section id="comments" class="comment-container">
                <form id="submitComment" method="POST" action="/comment">
                    <textarea type="text" id="commentInput" name="commentInput" placeholder="Type your comment..."></textarea>
                    <input class="btn-primary commentPost" type="submit" value="Comment">
                </form>
                <div class="postArea">
                </div>
          </section>
        <div style="clear: both;"></div>
      </div>
        `).prependTo($(".category"));
        const $commentFeedToggle = $newElement.find(".commentFeed");

        console.log("<a class='btn btn-primary commentFeed'>Comment</a> :  ====> ", $commentFeedToggle);
    }
    // makeNewEventHandlers(); // might not need
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
// });
