
const obsContainer = document.getElementById('obs-accordion');
const loadMoreBtn = document.getElementById('load-more-btn');
//ebird hotspot keys
const hotspots = ['L1041285', 'L3058433','L1622759','L380915','L2198410','L22937810','L823886','L16320572','L6528214'];
//initialize list of observations
const observations = [];

//set ebird headers and options
var myHeaders = new Headers();
myHeaders.append('X-eBirdApiToken', ebird_TOKEN);
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
  constructor(comName, sciName, taxon, lat, lng, date, hotspot,locName,speciesCode){
    super(comName, sciName, taxon, lat, lng, date);
    this.hotspot=hotspot;
    this.uri = "https://ebird.org/hotspot/"+hotspot;
    this.locName = locName;
    this.img = (typeof imgs[speciesCode] !== 'undefined')? imgs[speciesCode].src : "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/134118971/480";
    this.type = "eBird";
    this.code = speciesCode;
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
        displayObs(observations.slice(0,100)); //CALL FUNCTION TO WRITE DATA TO PAGE
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
          let lat = geojson.coordinates[1];
          let lng = geojson.coordinates[0];
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
    data.slice(0,30).forEach(({ comName, sciName, lat, lng, obsDt,taxon,locId,locName, speciesCode }, index) => {
      let date = new Date(obsDt);
      observations.push(new eBirdObs(comName, sciName, "Aves", lat, lng, date,locId,locName, speciesCode));
    });
  };
  
  const displayObs = (obs) => {
    obs = obs.sort((a,b)=>b.date - a.date);
    obs.forEach((ob, index) => {
      obsContainer.innerHTML += `
      <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed justify-content-between" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
      ${get_Icon(ob.taxon)}  &nbsp;  &nbsp; ${toTitleCase(ob.comName)} 
      </button>
    </h2>
    <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#obs-accordion">
      <div class="accordion-body">
      <p> Scientific name: <em>${ob.sciName}</em>.</p>
      <p>
        <a href="#" onclick="mapUpdate(`+ob.lat+','+ob.lng+`);return false;">Show map location</a>.
        </p>
      <p>Date: ${ob.date.toString()}</p>
      <p>
      <a href="${ob.uri}" target="_blank">Open ${ob.type === 'iNat'? 'observation on iNaturalist' : 'hotspot on eBird'}</a>.
      </p>
      <p><img class="img-fluid" src="${ob.img}" /></p>
      </div>
    </div>
  </div>
    `;
    });
  };
function mapUpdate(lat, lng){
  frame = document.getElementById('map-frame');
  frame.src="https://www.google.com/maps/embed/v1/place?key="+google_KEY+"&zoom=14&q="+lat.toString()+","+lng.toString();
}

  function reloadObs(obs, type){
    obsContainer.innerHTML = "";
    switch(type){
      case 'eBird':
        displayObs(obs.filter((ob) =>ob.type==='eBird')); 
        document.getElementById("obs-title").innerHTML="eBird:";
        break;
      case 'iNat':
        displayObs(obs.filter((ob) =>ob.type==='iNat'));
        document.getElementById("obs-title").innerHTML="iNaturalist:";
        break;
      default:
        displayObs(obs);
        document.getElementById("obs-title").innerHTML="iNaturalist + eBird:";
       
    }
  }

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

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }