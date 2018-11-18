$(() => {

  $(function () {
    const $button = $("#commentFeed");
    const $commentSection = $("#comments").hide();
    const $input = $("#commentInput");

    $button.click((event) => {
      event.preventDefault();
      console.log("Button Clicked!!");
    })
  })

  $.ajax({
    method: "GET",
    url: "api/users"
  }).done((resources) => {
    for(resource of resources) {
      $(`
      <div class="resource">
        <img class="card-img-top" src='${resource.imageURL}'>
        <h3>
        ${resource.title} - <a href="${resource.resourceURL}">Source</a>
        </h3>
        <p>
        ${resource.description}
        </p>
        <footer>
          <a class="btn btn-primary">Rate</a>
          <a class="btn btn-primary">Like</a>
          <a id="commentFeed" class="btn btn-primary">Comment</a>
          <% include _comments.ejs %>
        </footer>
        <div style="clear: both;"></div>
        `).prependTo($(".category"));
    }
  });

 // Handles the renaming of the category titles
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
