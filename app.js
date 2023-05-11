function app(people) {
  displayWelcome();
  runSearchAndMenu(people);
  return exitOrRestart(people);
}

function displayWelcome() {
  alert("Hello and welcome to the Most Wanted search application!");
}

function runSearchAndMenu(people) {
  const searchResults = searchPeopleDataSet(people);

  if (searchResults.length > 1) {
    displayPeople("Search Results", searchResults);
  } else if (searchResults.length === 1) {
    const person = searchResults[0];
    mainMenu(person, people);
  } else {
    alert("No one was found in the search.");
  }
}

function searchPeopleDataSet(people) {
  const searchTypeChoice = validatedPrompt(
    "Please enter in what type of search you would like to perform.",
    [
      "id",
      "name",
      "traits",
    ]
  );

  let results = [];
  switch (searchTypeChoice) {
    case "id":
      results = searchById(people);
      break;
    case "name":
      results = searchByName(people);
      break;
    case "traits":
      results = searchByTrait(people);
      break;
    default:
      return searchPeopleDataSet(people);
  }

  return results;
}

function searchById(people) {
  const idToSearchForString = prompt(
    "Please enter the id of the person you are searching for."
  );
  const idToSearchForInt = parseInt(idToSearchForString);
  const idFilterResults = people.filter(
    (person) => person.id === idToSearchForInt
  );
  return idFilterResults;
}

function searchByName(people) {
  const firstNameToSearchFor = prompt(
    "Please enter the the first name of the person you are searching for."
  );
  const lastNameToSearchFor = prompt(
    "Please enter the the last name of the person you are searching for."
  );
  const fullNameSearchResults = people.filter(
    (person) =>
      person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() &&
      person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()
  );
  return fullNameSearchResults;
}

function searchByTrait(people) {
  let results = people;

  while (true) {
    const traitToSearchFor = validatedPrompt(
      "What trait do you want to search by?",
      ["gender", "height", "weight", "eyeColor", "occupation", "dob"]
    );

    const query = prompt(
      `Please enter the ${traitToSearchFor} of the person you are searching for`
    );

    results = results.filter(function (person) {
      return person[traitToSearchFor] == query;
    });

    displayPeople(`Results for ${traitToSearchFor}: ${query}`, results);

    const continueFiltering = prompt("Do you want to filter by another trait? (yes/no)");

    if (continueFiltering.toLowerCase() !== "yes") {
      return results;
    }
  }
}




function mainMenu(person, people) {
  const mainMenuUserActionChoice = validatedPrompt(
    `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
    ["info", "family", "descendants", "quit"]
  );

  switch (mainMenuUserActionChoice) {
    case "info":
      let info = displayPersonInfo(person)
      alert(info);
      return;
      
    case "family":
      //! TODO
      let personFamily = findPersonFamily(person, people);
      displayPeople('Family', personFamily);
      return;

    case "descendants":
      //! TODO
      let personDescendants = findPersonDescendants(person, people);
      displayPeople('Descendants', personDescendants);
      return;
    
    case "quit":
      return;
    default:
      alert("Invalid input. Please try again.");
  }
  return mainMenu(person, people);
} 

function displayPersonInfo(person){
  let results = `
  Name: ${person.firstName} ${person.lastName}
  Gender: ${person.gender}
  Date of Birth: ${person.dob}
  Height: ${person.height}
  Weight: ${person.weight}
  Eye Color: ${person.eyeColor}
  Occupation: ${person.occupation}
  Parents: ${person.parents}
  Spouse: ${person.currentSpouse}`; 
  return results;
}


function findPersonFamily(person, people) {
  let parentResults = people.filter(function (p) {
    return p.id === person.parents[0] || p.id === person.parents[1];
  });
  displayPeople("Parents", parentResults);

  let spouseResults = people.filter(function (p) {
    return p.id === person.currentSpouse;
  });
  displayPeople("Spouse", spouseResults);


  let siblingResults = people.filter(function (p) {
    //removes person duplicating in siblings
    if(p.id === person.id){
      return false;}
    
    if (person.parents == undefined) { 
    return false} 
      
    else {
      return p.parents[0] === person.parents[0] || p.parents[1] === person.parents[1]  && person.parents != [''];
    }   
  });
  displayPeople("Siblings", siblingResults);
}


function findPersonDescendants(person, people){

  let childDescendant = people.filter(function (child) {
    return child.parents[0] === person.id || child.parents[1] === person.id;

  });
  displayPeople("Child", childDescendant);
  
  
  let grandChildDescendant = people.filter(function(grandChild){
    if (grandChild.parents.length === 0) {
      return false;
    } else {
      for ( let i = 0; i < childDescendant.length; i++){
        if(grandChild.parents[0] === childDescendant[i].id || grandChild.parents[1] === childDescendant[i].id){
          return true;
        }
      }
      return false;
    }
  });
  displayPeople("Grandchildren", grandChildDescendant);}

      
//Starter Code Below

function displayPeople(displayTitle, peopleToDisplay) {
  const formatedPeopleDisplayText = peopleToDisplay
    .map((person) => `${person.firstName} ${person.lastName}`)
    .join("\n");
  alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
  // acceptableAnswers = acceptableAnswers.map((aa) => aa.toLowerCase());

  const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers
    .map((aa) => `\n-> ${aa}`)
    .join("")}`;

  const userResponse = prompt(builtPromptWithAcceptableAnswers);
 
  if (acceptableAnswers.includes(userResponse)) {
    return userResponse;
  } else {
    alert(
      `"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers
        .map((aa) => `\n-> ${aa}`)
        .join("")} \n\nPlease try again.`
    );
    return validatedPrompt(message, acceptableAnswers);
  }
}

function exitOrRestart(people) {
  const userExitOrRestartChoice = validatedPrompt(
    "Would you like to exit or restart?",
    ["exit", "restart"]
  );

  switch (userExitOrRestartChoice) {
    case "exit":
      return;
    case "restart":
      return app(people);
    default:
      alert("Invalid input. Please try again.");
      return exitOrRestart(people);
  }
}
