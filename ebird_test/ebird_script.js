

const authorContainer = document.getElementById('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const hotspot = 'L1622759';
document.getElementById('title').innerHTML+= hotspot;
var myHeaders = new Headers();
myHeaders.append('X-eBirdApiToken', TOKEN);

const hotspots = ['L1041285', 'L3058433','L1622759','L380915','L2198410','L22937810','L823886','L16320572','L6528214'];



//INITIALIZE STORE OF FETCHED DATA
let rawData = [];
const observations = [];
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  //redirect: 'follow'
};
//CALL TO EBIRD
Promise.all(hotspots.map(hot=>fetch('https://api.ebird.org/v2/data/obs/'+hot+'/recent', requestOptions)))
.then(responses =>
  Promise.all(responses.map(res => res.json())) //READ RESPONSES AS JSON
).then((data) => {
  rawData = data.flat(); //ABOVE RETURNS LIST OF LISTS (each hotspot), FLATTEN TO SINGLE LIST
  addToObs(rawData); //CALL FUNCTION TO FORMAT DATA 
})
.then((data) =>{
displayAuthors(observations); //CALL FUNCTION TO WRITE DATA TO PAGE
})
.catch((err) => {
console.error(`There was an error: ${err}`);
});


/*
//FETCH JUST ONE HOTSPOT
fetch("https://api.ebird.org/v2/data/obs/"+hotspot+"/recent", requestOptions)
    .then((res) => res.json())
    .then((data) => {
        rawData = data;
        addToObs(rawData);
      })
    .then((data) =>{
      displayAuthors(observations);
    })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });
*/

//add link, uri
class Observation {
  constructor(comName, sciName, lat, lng, date, taxon) { 
    this.comName = comName;
    this.sciName = sciName;
    this.lat = lat;
    this.lng = lng;
    this.date = date;
    this.taxon = 'Aves'
  }
}
const addToObs = (data) => {
  data.forEach(({ comName, sciName, lat, lng, obsDt,taxon }, index) => {
    observations.push(new Observation(comName, sciName, lat, lng, obsDt,taxon));
  });
};
const displayAuthors = (obs) => {
  console.log('Num: ' + obs.length);
  obs.forEach((ob, index) => {
    authorContainer.innerHTML += `
    <div id="" class="user-card">
      <h2 class="author-name">${index}. ${ob.comName}</h2>
      <div class="purple-divider"></div>
      <p class="bio">${ob.sciName.length > 50 ? ob.sciName.slice(0, 50) + '...' : ob.sciName}</p>
      <p>When: ${ob.date}</p>
    </div>
  `;
  });
};