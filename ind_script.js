//Place id: 155264
const obsContainer = document.getElementById('obs-accordion');
const loadMoreBtn = document.getElementById('load-more-btn');
const observations = [];

class Observation {
  constructor(comName, sciName, taxon, lat, lng, date) { 
    this.comName = comName;
    this.sciName = sciName;
    this.taxon = taxon;
    this.lat = lat;
    this.lng = lng;
    this.date = date;
  }
}
class iNatObs extends Observation {
  constructor(comName, sciName, taxon, lat, lng, date, uri, img){
    super(comName, sciName, taxon, lat, lng, date);
    this.uri = uri;
    this.img = img;
  }
}

//image, uri

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
    case "Aves":
        return '<i class="fa-solid fa-dove"></i>';
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
let rawData = [];

//MAKE REQUEST, STORE DATA IN ARRAY, WRITE TO PAGE 
//https://api.inaturalist.org/v1/observations?order=desc&order_by=created_at
fetch("https://api.inaturalist.org/v1/observations?place_id=155264&order_by=created_at&order=desc")
    .then((res) => res.json())
    .then((data) => {
        //STORE
        rawData = data["results"];
        addToObsiNat(rawData);
        //WRITE
        //displayAuthors(rawData);
      }).then((data) =>{
        displayAuthors(observations); //CALL FUNCTION TO WRITE DATA TO PAGE
        })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });



//REQUEST MORE:  
const fetchMoreAuthors = () => {
    startingIndex += 10;
    endingIndex += 10;
  
    displayAuthors(rawData.slice(startingIndex, endingIndex));
    if (rawData.length <= endingIndex) {
      loadMoreBtn.disabled = true;
  
      loadMoreBtn.textContent = 'No more data to load';
    }
  };

  const addToObsiNat = (data) => {
    data.forEach(({identifications, observed_on_details, geojson, uri, taxon}, index) => {
      //constructor(comName, sciName, lat, lng, taxon)
      if (identifications.length > 0){
        let group = identifications[0].taxon.iconic_taxon_name;
        if (taxon != "Aves"){
          let comName = identifications[0].taxon.preferred_common_name;
          let sciName = identifications[0].taxon.name;
          let lat = geojson.coordinates[0];
          let lng = geojson.coordinates[1];
          let date = new Date(observed_on_details.year,observed_on_details.month-1, observed_on_details.day, observed_on_details.hour);
          let link = uri;
          console.log(taxon.default_photo);
          let img = taxon.default_photo.medium_url;
          observations.push(new iNatObs(comName, sciName, group, lat, lng, date, link, img));
        }
    }
    });
  };
  
  const displayAuthors = (obs) => {
    obs = obs.sort((a,b)=>b.date - a.date);
    obs.forEach((ob, index) => {
      obsContainer.innerHTML += `
      <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
        #${index+1}: ${ob.comName} ${get_Icon(ob.taxon)}
      </button>
    </h2>
    <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#obs-accordion">
      <div class="accordion-body">
      ${ob.sciName}
      <br />
      ${ob.taxon}
      Coordinates: ${ob.lat}, ${ob.lng}
      <a href="${ob.uri}" target="_blank">${ob.date.toString()}</a>
      <p><img class="img-fluid" src="${ob.img}" /></p>
      </div>
    </div>
  </div>
    `;
    });
  };
  