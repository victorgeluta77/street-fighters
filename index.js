"use strict"
const API_URL = 'https://api.github.com/';

const rootElement = document.getElementById('root');
const loadingElement = document.getElementById('loading-overlay');
const fightersDetailsMap = new Map();
 

// start game

async function startApp() {
    try {
      loadingElement.style.visibility = 'visible';
      
      const endpoint = 'repos/sahanr/street-fighter/contents/fighters.json';
      const fighters = await callApi(endpoint, 'GET');
      const fightersElement = createFighters(fighters);
      
      rootElement.appendChild(fightersElement);
    } catch (error) {
      console.warn(error);
      rootElement.innerText = 'Failed to load data';
    } finally {
      loadingElement.style.visibility = 'hidden';
    }
  }
  
//   make query to the server and return file with information
  function callApi(endpoind, method = 'GET') {
    const url = API_URL + endpoind;
    const options = {
      method
    };
  
    return fetch(url, options)
      .then(response => response.ok ? response.json() : Promise.reject(Error('Failed to load')))
      .then(file => JSON.parse(atob(file.content)))
      .catch(error => {
        console.warn(error);
        rootElement.innerText = 'Failed to load data';
      })
      .finally(() => {
        loadingElement.remove();
      });
  }
 
 // create DOM elements 

  function createElement({ tagName, className = '', attributes = {} }) {
    const element = document.createElement(tagName);
    element.classList.add(className);
      
    Object
      .keys(attributes)
      .forEach(key => element.setAttribute(key, attributes[key]));
  
    return element;
  }  
// create Name of Elements
  function createName(name) {
    const nameElement = createElement({ tagName: 'span', className: 'name' });
    nameElement.innerText = name;
  
    return nameElement;
  }
// create Image Elements
  function createImage(source) {
    const attributes = { src: source };
    const imgElement = createElement({
      tagName: 'img',
      className: 'fighter-image',
      attributes
    });
  
    return imgElement;
  }

// create fighter

  function createFighter(fighter) {
    const { name, source } = fighter;
    const nameElement = createName(name);
    const imageElement = createImage(source);
    const element = createElement({ tagName: 'div', className: 'fighter' });

    element.addEventListener('click', (event) => handleFighterClick(event, fighter), false);
 
    element.append(imageElement,nameElement);
  
    return element;
  }
  
  function handleFighterClick(event, fighter) {
    const { _id } = fighter;
    console.log('fighter = ',fighter);

    if(!fightersDetailsMap.has(_id)) {
      // send request here
      fightersDetailsMap.set(_id, fighter);
    }
  
    console.log(fightersDetailsMap.get(_id));
    
   }

// add and create Fighters

  function createFighters(fighters) {
    const fighterElements = fighters.map(fighter => createFighter(fighter));
    const element = createElement({ tagName: 'div', className: 'fighters' });
  
    element.append(...fighterElements);
  
    return element;
  }

//    return fighter's name
  function getFightersNames(fighters) {
    const names = fighters.map(it => it.name).join('\n');
    return names;
  }
  
  startApp();