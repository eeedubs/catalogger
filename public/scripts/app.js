$(() => {

  $(function () {
    const $button = $("#postNewComment");
    const $commentSection = $("#comments").hide();
    const $input = $("#commentInput");

    $button.click((event) => {
      event.preventDefault();
      
      $commentSection.slideToggle();
      $input.focus();
    })
  })
  $(function () {
    //still selects all forms for some reason
    const $form = $("#submitNew");
    const $text = $(".form-control");

    const $url = $text[1];
    const $title = $text[2];
    const $imageURL = $text[3];
    const $description = $text[4];
    

    $form.submit((event) => {
      event.preventDefault();
      console.log("Button Clicked!");

      $.ajax({
        method: "POST",
        url: "/submit",
        data: $form.serialize()
      })
      .then(
        createResource({
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


  //|============== Functions for handling post creation (not finished yet) ==============|
  function loadResources(){

  };
  function renderResources(posts){
    for(let i = 0; i < posts.length; i++){
     const $resourcePost = createResource(posts[i]);
     let $prependedResource = $(".postArea").prepend($resourcePost);
    }
  };
  function createResource({
    resourceURL,
    title,
    imageURL,
    description
  }) {
    const $resourceElm = $("<div>").addClass("resource");

    const $imgElm = $("<img>").addClass("card-img-top").prop("src", imageURL).appendTo($resourceElm);
    const $title = $("<h5>").appendTo($resourceElm).text(`${title} - `);
    const $source = $("<a>").prop("href", resourceURL).appendTo($title);
    const $description = $("<p>").appendTo($resourceElm).text(description);

    const $footer = $("<footer>").appendTo($resourceElm);
    //|============== this may cause issues with buttons (.prop("/") needs to be proper route) ==============|
    const $like = $("<a>").addClass("btn btn-primary")
    .prop("href", "/").text("Like").appendTo($footer);
    const $comment = $("<a>").addClass("btn btn-primary")
    .prop("href", "/").text("Comment").appendTo($footer);
    const $rate = $("<a>").addClass("btn btn-primary")
    .prop("href", "/").text("Rate").appendTo($footer);

    const $articleSeperator = $("<div>").prop("style", "clear:both;").appendTo($resourceElm);


    // return $resourceElm;
    console.log("Resource Found!", $resourceElm);
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