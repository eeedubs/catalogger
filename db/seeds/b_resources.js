exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('resources').insert({
          title: 'Bernese Mountain Dogs',
          description: "The Bernese Mountain Dog is a large, sturdy worker who can stand over 27 inches at the shoulder. The thick, silky, and moderately long coat is tricolored: jet black, clear white, and rust. The distinctive markings on the coat and face are breed hallmarks and, combined with the intelligent gleam in the dark eyes, add to the Berner’s aura of majestic nobility.", 
          resourceURL: 'https://www.akc.org/dog-breeds/bernese-mountain-dog/',
          imageURL: "http://www.thefurrtographer.com/wp-content/uploads/2015/03/03-519-post/FUR_3398-XL-1024x683.jpg", 
          created_by: 1,
          time_created: Date.now()
        }),
        knex('resources').insert({
          title: "Sony A7R III Review: The New King of Mirrorless Cameras", 
          description: "Read the latest gizmodo review on the Sony A7Riii mirrorless camera. Article includes: sample images from low-light, high-ISO testing; sample images from crop mode (AKA super 35mm mode); and feedback from professionals in the field.", 
          resourceURL: "https://gizmodo.com/sony-a7r-iii-review-the-new-king-of-mirrorless-cameras-1822321331", 
          imageURL: "https://i.kinja-img.com/gawker-media/image/upload/s--xLTY559r--/c_scale,f_auto,fl_progressive,q_80,w_800/j8ohiwbflexgwh7j9rc1.jpg", 
          created_by: 1,
          time_created: Date.now()
        }),
        knex('resources').insert({
          title: 'Opening day for new Whistler Blackcomb gondola pushed back', 
          description: "The winter season starts at one of Canada's largest ski resorts next week, a month before winter officially begins. But when the lifts start up on Nov. 22, one of the routes uphill will not be available. The new Blackcomb gondola was supposed to be up and running by the start of the season, but the company behind the new lift said it's expected to take another three weeks.", 
          resourceURL: "https://bc.ctvnews.ca/opening-day-for-new-whistler-blackcomb-gondola-pushed-back-1.4179009", 
          imageURL: "https://media1.fdncms.com/pique/imager/u/zoom/2800114/news_mtnnews1-bc6c6ed161bffdba.jpg", 
          created_by: 1,
          time_created: Date.now()
        }),
        knex('resources').insert({
          title: 'BC government to announce rideshare legislation on Monday', 
          description: "In just over 24 hours, British Columbia will be receiving more news about bringing rideshare to the province. The provincial government has announced that on Monday, November 19, they’ll be unveiling their “next step” to enable ridesharing in the form of the “passenger transportation amendment act.", 
          resourceURL: "http://dailyhive.com/vancouver/bc-rideshare-announcement-november-2018", 
          imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToI9Dudri-p3KECequwG2jiBlYqM5DedQxRE-qNZ22Lo9eC4RY", 
          created_by: 1,
          time_created: Date.now()
        }),
        knex('resources').insert({
          title: 'FBI joining DoT investigation into the Boeing 737 Max plane',
          description: "The FBI is joining the Department of Transportation's investigation into the Boeing 737 Max plane, the Seattle Times reported Wednesday.  People familiar with the matter told reporter Steve Miletich that the investigation is focused on how the plane, which has crashed twice in the past five months, was certified to fly. Department of Transportation Secretary Elaine Chao formally requested an audit of the FAA's certification for the process in a letter sent to the agency on Tuesday.  The FBI did not immediately respond to a request for comment.",
          resourceURL: "https://www.businessinsider.com/boeing-737-max-fbi-joins-investigation-into-plane-certification-report-2019-3",
          imageURL: "https://amp.businessinsider.com/images/5c92a91d69e11c721269ddb4-2560-1280.jpg",
          created_by: 4,
          time_created: Date.now()
        }),
      ]);
    });
};