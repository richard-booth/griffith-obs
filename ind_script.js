
const obsContainer = document.getElementById('obs-accordion');
const loadMoreBtn = document.getElementById('load-more-btn');
//ebird hotspot keys
const hotspots = ['L1041285', 'L3058433','L1622759','L380915','L2198410','L22937810','L823886','L16320572','L6528214'];
//initialize list of observations
const observations = [];

//set ebird headers and options
var myHeaders = new Headers();
myHeaders.append('X-eBirdApiToken', TOKEN);
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
};

//observation classes
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
    this.type = "iNat";
  }
}
class eBirdObs extends Observation {
  constructor(comName, sciName, taxon, lat, lng, date, hotspot,locName){
    super(comName, sciName, taxon, lat, lng, date);
    this.hotspot=hotspot;
    this.uri = "https://ebird.org/hotspot/"+hotspot;
    this.locName = locName;
    this.img = "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/134118971/480";
    this.type = "eBird"
  }
}

//image, uri





let rawData = [];

//MAKE REQUEST, STORE DATA IN ARRAY, WRITE TO PAGE 
//https://api.inaturalist.org/v1/observations?order=desc&order_by=created_at
fetch("https://api.inaturalist.org/v1/observations?place_id=155264&order_by=created_at&order=desc")
    .then((res) => res.json())
    .then((data) => {
        //STORE
        rawData = data["results"];
        addToObsiNat(rawData);
        return Promise.all(hotspots.map(hot=>fetch('https://api.ebird.org/v2/data/obs/'+hot+'/recent', requestOptions)))
        .then(responses =>
          Promise.all(responses.map(res => res.json())) //READ RESPONSES AS JSON
        ).then((data) => {
          rawData = data.flat(); //ABOVE RETURNS LIST OF LISTS (each hotspot), FLATTEN TO SINGLE LIST
          addToObseBird(rawData); //CALL FUNCTION TO FORMAT DATA 
        })
      })
      .then((data) =>{
        displayAuthors(observations.slice(0,100)); //CALL FUNCTION TO WRITE DATA TO PAGE
        })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });



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
  const addToObseBird = (data) => {
    data.slice(0,30).forEach(({ comName, sciName, lat, lng, obsDt,taxon,locId,locName }, index) => {
      let date = new Date(obsDt);
      observations.push(new eBirdObs(comName, sciName, "Aves", lat, lng, date,locId,locName));
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