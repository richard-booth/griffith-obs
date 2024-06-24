

const authorContainer = document.getElementById('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const hotspot = 'L1041285';
document.getElementById('title').innerHTML+= hotspot;
var myHeaders = new Headers();
myHeaders.append('X-eBirdApiToken', TOKEN);

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
        displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
      })
  .catch((err) => {
    console.error(`There was an error: ${err}`);
  });
  
const fetchMoreAuthors = () => {
    startingIndex += 8;
    endingIndex += 8;
  
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
    if (authorDataArr.length <= endingIndex) {
      loadMoreBtn.disabled = true;
  
      loadMoreBtn.textContent = 'No more data to load';
    }
  };
  
  const displayAuthors = (authors) => {
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
  };
  
  loadMoreBtn.addEventListener('click', fetchMoreAuthors);