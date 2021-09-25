/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // store coffee counter element
  const counter = document.querySelector("#coffee_counter");

  // update text to match coffeeQty
  counter.innerText = coffeeQty;
}

function clickCoffee(data) {
  // update value of coffee property
  data.coffee++;

  // pass updated coffee value to updateCoffeeView
  updateCoffeeView(data.coffee);

  // pass updated data obj to renderProducers
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // check each 'producer' obj of 'producers' arr
  producers.forEach((producer) => {
    // store value at which this producer is unlocked
    const unlockValue = producer.price / 2;
    if (coffeeCount >= unlockValue) {
      // if coffeeCount >= unlockValue, update 'unlocked'
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  // store 'producers' arr of objs
  const producers = data.producers;
  // filter producers which have 'true' as value for 'unlocked' property
  return producers.filter((producer) => {
    return producer.unlocked === true;
  });
}

function makeDisplayNameFromId(id) {
  // split id using underscore as delimiter
  let words = id.split("_");

  // for each 'word' in 'words',
  words.forEach((word, idx) => {
    // capitalize first letter of current word
    // and update current element of 'words' arr
    words[idx] = `${word[0].toUpperCase()}${word.slice(1)}`;
  });

  // join 'words' back, separated by space
  return words.join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  let html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // store firstChild of 'parent'
  const child = parent.firstChild;

  // if child is null,
  if (child === null) {
    // return 0
    return 0;
  }
  // otherwise,
  else {
    // remove 'child'
    parent.removeChild(child);

    // call this function recursively
    deleteAllChildNodes(parent);
  }
}

function renderProducers(data) {
  // store 'producer_container' id element
  const container = document.getElementById("producer_container");

  // remove existing children of the 'container'
  deleteAllChildNodes(container);

  // unlock the producers which qualify
  unlockProducers(data.producers, data.coffee);

  // store unlocked producers
  const unlockedProducers = getUnlockedProducers(data);

  // for each 'producer' in 'unlockedProducers' arr,
  unlockedProducers.forEach((producer) => {
    // make a producer div for current 'producer'
    let currentProducerDiv = makeProducerDiv(producer);
    // if current producer can be sold, add a sell button to the div
    if (producer.qty > 0) {
      currentProducerDiv = makeProducerDivWithSellButton(producer);
    }
    // append the div to the 'container'
    container.appendChild(currentProducerDiv);
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  const allProducers = data.producers;
  // loop through 'allProducers' arr of objs
  for (let i = 0; i < allProducers.length; i++) {
    // if current obj has a matching id, return it
    if (allProducers[i].id === producerId) {
      return allProducers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  // get producer obj by calling getProducerById
  const producerData = getProducerById(data, producerId);

  // if 'producerData' has a 'price' value <= user's coffee value, return true
  if (producerData.price <= data.coffee) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  // store cps element
  const cpsView = document.getElementById("cps");

  // change text of 'cpsView' to value of 'cps'
  cpsView.innerText = cps;
}

function updatePrice(oldPrice) {
  // return newly inflated price
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // store producer obj
  const producerData = getProducerById(data, producerId);

  // determine if user can afford producer
  const canAfford = canAffordProducer(data, producerId);

  if (canAfford) {
    // increment qty of producer
    producerData.qty++;
    // decrement user's coffee value
    data.coffee -= producerData.price;
    // update price of producer
    producerData.price = updatePrice(producerData.price);
    // update total cps
    data.totalCPS += producerData.cps;
  }

  return canAfford;
}

function buyButtonClick(event, data) {
  // determine if click event was triggered by a buy button
  const buttonWasClicked =
    event.target.tagName === "BUTTON" && event.target.id.slice(0, 3) === "buy";

  if (buttonWasClicked) {
    // store event id, removing 'buy_' prefix
    const producerId = event.target.id.slice(4);

    // store result of attempting to buy producer
    const successfulPurchase = attemptToBuyProducer(data, producerId);

    // if the purchase was unsuccessful,
    if (successfulPurchase === false) {
      // display alert box
      window.alert("Not enough coffee!");
    } else {
      // otherwise, if the purchase was successful:
      // render producers
      renderProducers(data);
      // update coffee count displayed on screen
      updateCoffeeView(data.coffee);
      // update total CPS displayed on screen
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // increase coffee count
  data.coffee += data.totalCPS;

  // update coffee count displayed on screen
  updateCoffeeView(data.coffee);

  // update producers displayed on screen
  renderProducers(data);
}

function makeProducerDivWithSellButton(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column sell-btn">
    <button type="button" id="sell_${producer.id}">Sell</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function attemptToSellProducer(data, producerId) {
  // store producer obj
  const producerData = getProducerById(data, producerId);

  // determine if this producer can be sold
  const canSell = producerData.qty > 0;

  if (canSell) {
    // decrement this producer's qty value
    producerData.qty--;
    // increase user's coffee by half of this producer's price
    data.coffee += Math.floor(producerData.price * 0.5);
    // decrease user's totalCPS by this producer's cps value
    data.totalCPS -= producerData.cps;
  }
}

function sellButtonClick(event, data) {
  // determine if sell button was clicked
  const sellButtonWasClicked =
    event.target.tagName === "BUTTON" && event.target.id.slice(0, 4) === "sell";

  if (sellButtonWasClicked) {
    // store event id, removing 'sell_' prefix
    const producerId = event.target.id.slice(5);

    // sell the producer and update its data
    attemptToSellProducer(data, producerId);

    // render producers
    renderProducers(data);
    // update coffee count displayed on screen
    updateCoffeeView(data.coffee);
    // update total CPS displayed on screen
    updateCPSView(data.totalCPS);
  }
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
    sellButtonClick(event, data);
  });

  // create functionality to update the player as they progress through the game
  function updateGameStatus(data) {
    // store total number of unlocked producers
    const allUnlockedProducers = getUnlockedProducers(data);

    // store 'directions' element
    const directions = document.getElementById("directions");

    // store minimum upgrade price
    const allPrices = data.producers.map((producer) => {
      return producer.price;
    });
    const cheapestUpgrade = Math.min(...allPrices);

    // change the text of 'directions' depending on number of upgrades,
    if (allUnlockedProducers.length === 5) {
      // if all producers are unlocked:
      directions.innerText = "So much coffee!!!";
    } else if (allUnlockedProducers.length && data.coffee >= cheapestUpgrade) {
      // if producers are available and the user can afford at least one:
      directions.innerText = "Click to buy an upgrade! →";
    } else {
      // otherwise, display default text:
      directions.innerText = "↑  Click on the coffee! ↑";
    }
  }

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  // Call updateGameStatus periodically to simulate real-time updates
  setInterval(() => updateGameStatus(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
