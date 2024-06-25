

const authorContainer = document.getElementById('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const hotspot = 'L1041285';
document.getElementById('title').innerHTML+= hotspot;
var myHeaders = new Headers();
myHeaders.append('X-eBirdApiToken', TOKEN);

const hotspots = ['L1041285', 'L3058433','L1622759','L380915','L2198410','L22937810','L823886','L16320572','L6528214'];

const observations = [];

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  //redirect: 'follow'
};
let startingIndex = 0;
let endingIndex = 8;
let authorDataArr = [];

fetch("https://api.ebird.org/v2/data/obs/"+hotspot+"/recent", requestOptions)
    .then((res) => res.json())
    .then((data) => {
        authorDataArr = data;
        addToObs(authorDataArr);
        displayAuthors(observations);
      })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });
  /*
const fetchMoreAuthors = () => {
    startingIndex += 8;
    endingIndex += 8;
  
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
    if (authorDataArr.length <= endingIndex) {
      loadMoreBtn.disabled = true;
  
      loadMoreBtn.textContent = 'No more data to load';
    }
  };
  */
//add link, uri
class Observation {
  constructor(comName, sciName, lat, lng, date) { 
    this.comName = comName;
    this.sciName = sciName;
    this.lat = lat;
    this.lng = lng;
    this.date = date;
  }
}
const addToObs = (data) => {
  data.forEach(({ comName, sciName, lat, lng, obsDt }, index) => {
    observations.push(new Observation(comName, sciName, lat, lng, obsDt));
  });
};
const displayAuthors = (obs) => {
  console.log('Num: ' + obs.length);
  obs.forEach((ob) => {
    authorContainer.innerHTML += `
    <div id="" class="user-card">
      <h2 class="author-name">${ob.comName}</h2>
      <div class="purple-divider"></div>
      <p class="bio">${ob.sciName.length > 50 ? ob.sciName.slice(0, 50) + '...' : ob.sciName}</p>
      <p>When: ${ob.date}</p>
    </div>
  `;
  });
};
console.log(observations.length);
  
/*const displayAuthors = (authors) => {
    authors.forEach(({ comName, sciName,obsDt }, index) => {
      authorContainer.innerHTML += `
      <div id="${index}" class="user-card">
        <h2 class="author-name">${comName}</h2>
        <div class="purple-divider"></div>
        <p class="bio">${sciName.length > 50 ? sciName.slice(0, 50) + '...' : sciName}</p>
        <p>When: ${obsDt}</p>
      </div>
    `;
    });
  };*/
  
//loadMoreBtn.addEventListener('click', fetchMoreAuthors);
