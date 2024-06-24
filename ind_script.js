//Place id: 155264
const authorContainer = document.getElementById('obs-accordion');
const loadMoreBtn = document.getElementById('load-more-btn');
const hotspot = 'L1041285';

function get_Icon(tax){
  switch(tax){
    case "Plantae":
      return '<i class="fa-solid fa-leaf"></i>';
      break;
    case "Insecta":
      return '<i class="fa-solid fa-bugs"></i>';
      break;
    case "Mammalia":
      return '<i class="fa-solid fa-paw"></i>';
      break;
    case "Reptilia":
      return '<i class="fa-solid fa-worm"></i>';
      break;
    default:
      return '<i class="fa-solid fa-dragon"></i>';
  }
}

//REQUEST HEADERS AND OPTIONS
var myHeaders = new Headers();
myHeaders.append('X-eBirdApiToken', 'h7ef2kl07ipp');
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  //redirect: 'follow'
};
//HOW MANY TO PRINT INITIALLY?
let startingIndex = 0;
let endingIndex = 10;
//INITIALIZE DATA ARRAY
let authorDataArr = [];
//MAKE REQUEST, STORE DATA IN ARRAY, WRITE TO PAGE 
//https://api.inaturalist.org/v1/observations?order=desc&order_by=created_at
fetch("https://api.inaturalist.org/v1/observations?place_id=155264&order_by=created_at&order=desc")
    .then((res) => res.json())
    .then((data) => {
        //STORE
        authorDataArr = data["results"];
        //WRITE
        displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
      })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });



//REQUEST MORE:  
const fetchMoreAuthors = () => {
    startingIndex += 10;
    endingIndex += 10;
  
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
    if (authorDataArr.length <= endingIndex) {
      loadMoreBtn.disabled = true;
  
      loadMoreBtn.textContent = 'No more data to load';
    }
  };

  //WRITE TO PAGE:

  /*
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapse${index}" class="accordion-collapse collapse show" data-bs-parent="#obs-accordion">
      <div class="accordion-body">
        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  */
  const displayAuthors = (authors) => {

    authors.forEach(({ species_guess, identifications, geojson, uri}, index) => {
      let taxon = identifications[0].taxon.iconic_taxon_name;
      let img_url = identifications[0].taxon.default_photo.url;
      let coord = geojson.coordinates;
      authorContainer.innerHTML += `
      <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
        #${index+1}: ${species_guess} ${get_Icon(taxon)}
      </button>
    </h2>
    <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#obs-accordion">
      <div class="accordion-body">
      ${taxon}
      <img src="${img_url}" />
      Coordinates: ${coord}
      <a href="${uri}" target="_blank">Link</a>
      </div>
    </div>
  </div>
    `;
    });


/*
    authors.forEach(({ species_guess, identifications}, index) => {
      authorContainer.innerHTML += `
      <div id="${index}" class="user-card">
        <h2 class="author-name">${species_guess}</h2>
        <div class="purple-divider"></div>
        <p class="bio">${species_guess.length > 50 ? species_guess.slice(0, 50) + '...' : species_guess}</p>
        <p>When: ${identifications[0].taxon.iconic_taxon_name}</p>
      </div>
    `;
    });
*/


  };
  
  //loadMoreBtn.addEventListener('click', fetchMoreAuthors);