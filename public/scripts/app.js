$(() => {

  $(function () {
    //still selects all forms for some reason
    $form = $("#submitNew");
    $text = $(".form-control");

    $url = $text[1];
    $title = $text[2];
    $imageURL = $text[3];
    $description = $text[4];
    

    $form.submit((event) => {
      event.preventDefault();
      console.log("Button Clicked!");

      $.ajax({
        method: "POST",
        url: "/submit",
        data: $form.serialize()
      })
      .then(
        createPost({
          resourceURL: $url.value,
          title: $title.value,
          imageURL: $imageURL.value,
          description: $description.value
        })
      )
    })
  })
  
  // .done(() => {
  //   for(id of resources) {
  //     $("<div>").addClass("resource").text(user.name).appendTo($("body"));
  //   }
  // });;

  function loadPosts(){

  };
  function renderPosts(){

  };
  function createPost({
    resourceURL,
    title,
    imageURL,
    description
  }) {

    console.log("Resource Found!", resourceURL, title, imageURL, description);
  };
});



$(document).ready(function($) {

  $(function() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active");        
      }
    });
  });
});