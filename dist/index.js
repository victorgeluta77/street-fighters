"use strict";

const API_URL = 'https://api.github.com/';

const rootElement = document.getElementById('root');
const loadingElement = document.getElementById('loading-overlay');
const fightersDetailsMap = new Map();

//   make query to the server and return file with information
function callApi(endpoind, method = 'GET') {
  const url = API_URL + endpoind;
  const options = {
    method
  };

  return fetch(url, options).then(response => response.ok ? response.json() : Promise.reject(Error('Failed to load'))).catch(error => {
    throw error;
  });
}

// this class get data
class FighterService {
  async getFighters() {
    try {
      const endpoint = 'repos/sahanr/street-fighter/contents/fighters.json';
      const apiResult = await callApi(endpoint, 'GET');

      return JSON.parse(atob(apiResult.content));
    } catch (error) {
      throw error;
    }
  }
}

const fighterService = new FighterService();

// this class make DOM's elements
class View {
  element;

  createElement({ tagName, className = '', attributes = {} }) {
    const element = document.createElement(tagName);
    element.classList.add(className);

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    return element;
  }
}

// this class shows Fighters
class FighterView extends View {
  constructor(fighter, handleClick) {
    super();

    this.createFighter(fighter, handleClick);
  }

  createFighter(fighter, handleClick) {
    const { name, source } = fighter;
    const nameElement = this.createName(name);
    const imageElement = this.createImage(source);

    this.element = this.createElement({ tagName: 'div', className: 'fighter' });
    this.element.append(imageElement, nameElement);
    this.element.addEventListener('click', event => handleClick(event, fighter), false);
  }

  createName(name) {
    const nameElement = this.createElement({ tagName: 'span', className: 'name' });
    nameElement.innerText = name;

    return nameElement;
  }

  createImage(source) {
    const attributes = { src: source };
    const imgElement = this.createElement({
      tagName: 'img',
      className: 'fighter-image',
      attributes
    });

    return imgElement;
  }
}
// this class shows all fighters
class FightersView extends View {
  constructor(fighters) {
    super();

    this.handleClick = this.handleFighterClick.bind(this);
    this.createFighters(fighters);
  }

  // fightersDetailsMap = new Map();

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(fighter, this.handleClick);
      return fighterView.element;
    });

    this.element = this.createElement({ tagName: 'div', className: 'fighters' });
    this.element.append(...fighterElements);
  }

  handleFighterClick(event, fighter) {
    this.fightersDetailsMap.set(fighter._id, fighter);
    console.log('clicked', this.fightersDetailsMap.set(fighter._id, fighter));

    // get from map or load info and add to fightersMap
    // show modal with fighter info
    // allow to edit health and power in this modal
  }
}

// this class app other classes and start game
class App {
  constructor() {
    this.startApp();
  }

  // static rootElement = document.getElementById('root');
  // static loadingElement = document.getElementById('loading-overlay');

  async startApp() {
    try {
      const rootElement = document.getElementById('root');
      const loadingElement = document.getElementById('loading-overlay');
      loadingElement.style.visibility = 'visible';

      const fighters = await fighterService.getFighters();
      const fightersView = new FightersView(fighters);
      const fightersElement = fightersView.element;

      rootElement.appendChild(fightersElement);
    } catch (error) {
      console.warn(error);
      rootElement.innerText = 'Failed to load data';
    } finally {
      loadingElement.style.visibility = 'hidden';
    }
  }
}

new App();