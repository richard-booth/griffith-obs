//Place id: 155264


const authorContainer = document.getElementById('author-container');
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
    /*authors.forEach(({ comName, sciName,obsDt }, index) => {
      authorContainer.innerHTML += `
      <div id="${index}" class="user-card">
        <h2 class="author-name">${comName}</h2>
        <div class="purple-divider"></div>
        <p class="bio">${sciName.length > 50 ? sciName.slice(0, 50) + '...' : sciName}</p>
        <p>When: ${obsDt}</p>
      </div>
    `;
    });*/
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
    //authorContainer.innerHTML += JSON.stringify(authors);
  };
  
  loadMoreBtn.addEventListener('click', fetchMoreAuthors);