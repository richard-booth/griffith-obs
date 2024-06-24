//Place id: 155264


const authorContainer = document.getElementById('obs-accordion');
const loadMoreBtn = document.getElementById('load-more-btn');
const hotspot = 'L1041285';
document.getElementById('title').innerHTML+= hotspot;

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
  const displayAuthors = (authors) => {
    /*authors.forEach(({ species_guess, identifications}, index) => {
      authorContainer.innerHTML += `
      <div id="${index}" class="user-card">
        <h2 class="author-name">${species_guess}</h2>
        <div class="purple-divider"></div>
        <p class="bio">${species_guess.length > 50 ? species_guess.slice(0, 50) + '...' : species_guess}</p>
        <p>When: ${identifications[0].taxon.iconic_taxon_name}</p>
      </div>
    `;
    });*/
    authors.forEach(({ species_guess, identifications}, index) => {
        authorContainer.innerHTML += `
        <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      ${Index}: ${species_guess}
                    </button>
                  </h2>
                  <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                    ${identifications[0].taxon.iconic_taxon_name}
                    </div>
                  </div>
                </div>
      `;
      });

  };
  
  loadMoreBtn.addEventListener('click', fetchMoreAuthors);