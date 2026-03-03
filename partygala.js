// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2601-ftb-ct-web-pt";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let parties = [];
let selectedParty;

/** Updates state with all parties from the API */ 
//fetch all parties data
async function getParties() {
  //TODO
  try{
    const response = await fetch(API);//fetch Parties data from the API location
    const result= await response.json();//parse the respponse as a JSON object
    parties = result.data; //get the data property into a separate variable
    render();//render it on the screen
  }catch(error){//error case
    console.error("Could not fetch parties", error);
  }
}

//Updates state with a single party from the API 
//fetch data for a specific party using their id
async function getParty(id){
    try{
        const response = await fetch(`${API}/${id}`); //fetch part date using id
        const result = await response.json();//parase the output into a json object
        selectedParty = result.data;//store the data property into the selectedParty variable
        render(); //call render to update this info on the page

    }catch(error){
        console.error("Could not fetch party",error);
        selectedParty = null;
    }
}
//when you click on a party, it should show specific details about that party.
function PartyListItem(party){
    const list = document.createElement("li"); //creates a list item element
    list.textContent = party.name; //sets the text content of the list to the party's name
    list.addEventListener("click", async function(){ //adds a click event listener to the list item so that when it is clicked, it will fetch the details of the party and update the state with the party details.
        await getParty(party.id);
        render();
    });
    return list;
}

/**A list of names of all parties**/
function PartyList(){
  const ul = document.createElement("ul");
  ul.classList.add("lineup");
  for (let i = 0; i < parties.length; i++) { //iterates through the parties array and creates a list item for each party using the PartyListItem component, then appends it to the unordered list
    const party = parties[i];//get the current party from the parties array
    const listItem = PartyListItem(party);//create a list item for the current party using the PartyListItem component
    ul.appendChild(listItem);//Appends the list item to the unordered list
  }
  return ul;
}

function PartyDetails(){
  if(!selectedParty){
      const $p = document.createElement("p");
      $p.textContent = "Select a party to see details";
      return $p;
    }
  const div = document.createElement("div");
  const name = document.createElement("h3");//create a heading element to display the artist's name
  name.textContent = selectedParty.name;//sets the text content of the heading to the selected artist's name

  const image = document.createElement("img");//create an image element to display the artist's image
  image.src = selectedParty.imageUrl;//sets the source of the image to the selected artist's image URL
  image.alt = selectedParty.name;//sets the alt text of the image to the selected artist's name
  image.width = 300;//sets the width of the image to 300 pixels

  const description = document.createElement("p");//create a paragraph element to display the artist's description
  description.textContent = selectedParty.description;//sets the text content of the paragraph to the selected artist's description

  div.appendChild(name);//appends the name heading to the div element
  div.appendChild(image);//appends the image to the div element
  div.appendChild(description);//appends the description paragraph to the div element

  return div;//returns the div element containing the artist details to be displayed in the artist details section
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party planner</h1>
    <main>
      <section>
        <h2>Lineup</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <PartyDetails></PartyDetails>
      </section>
    </main>
  `;
  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("PartyDetails").replaceWith(PartyDetails());
}

async function init() {
  await getParties();
  render();
}

init();
