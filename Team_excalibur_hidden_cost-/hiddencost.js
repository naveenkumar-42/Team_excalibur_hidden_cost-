const loader = document.getElementById('loader');
const resultSection = document.getElementById('result_section');

document.addEventListener('DOMContentLoaded', function () {
  const toggleHighlightingCheckbox = document.getElementById('toggleHighlightingCheckbox');
  if (toggleHighlightingCheckbox) {
    chrome.storage.local.get(['isHighlighting'], function (result) {
      const isHighlighting = result.isHighlighting ?? true;
      toggleHighlightingCheckbox.checked = isHighlighting;
      if (isHighlighting) {
        fetchAndDisplayValues();
      } else {
        hideAllValues();
        chrome.runtime.sendMessage({ action: 'setIcon', path: 'images/default.png' }); // Set icon to default
      }
    });

    toggleHighlightingCheckbox.addEventListener('change', function () {
      const isHighlighting = toggleHighlightingCheckbox.checked;
      chrome.runtime.sendMessage({ action: 'toggleHighlighting', isHighlighting });
      chrome.storage.local.set({ isHighlighting });
      if (isHighlighting) {
        fetchAndDisplayValues();
      } else {
        hideAllValues();
        chrome.runtime.sendMessage({ action: 'setIcon', path: 'images/default.png' }); // Set icon to default
      }
    });
  } else {
    console.error("Checkbox element not found.");
  }
});

function fetchAndDisplayValues() {
  loader.style.display = 'block';

  // Set a timeout for 10 seconds
  setTimeout(() => {
    const amazonElements = ['amazonFullPrice', 'amazonProductPrices', 'amazonPriceDifference', 'discountDifference', 'amazonComparePrice', 'deliveryAmount', 'orderTotalAmount'];
    const flipkartElements = ['flipkartFullPrices', 'flipkartOfferPrices', 'flipkartPriceDifference', 'flipkartdiscountDifference', 'flipkartComparePrice'];
    const ajioElements = ['ajioFullPrice', 'ajioDiscountPrices', 'ajioPriceDifference', 'ajiodiscountDifference', 'ajioComparePrice'];
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      let selectedPlatform = '';
      if (url.includes('amazon')) {
        selectedPlatform = 'amazon';
      } else if (url.includes('flipkart')) {
        selectedPlatform = 'flipkart';
      } else if (url.includes('ajio')) {
        selectedPlatform = 'ajio';
      } else {
        chrome.runtime.sendMessage({ action: 'setIcon', path: 'images/default.png' });
        loader.style.display = 'none'; // Hide loader if no valid platform
        return; // Early return to avoid unnecessary processing
      }
      
      hideAllValues(); // Hide all values first

      chrome.storage.local.get([
        'amazonPriceDifference', 'amazonFullPrice', 'amazonProductPrices', 'discountDifference', 'deliveryAmount', 'orderTotalAmount',
        'flipkartPriceDifference', 'flipkartFullPrices', 'flipkartOfferPrices', 'flipkartdiscountDifference', 'amazonComparePrice', 'flipkartComparePrice',
        'ajioPriceDifference', 'ajioFullPrice', 'ajioDiscountPrices', 'ajiodiscountDifference', 'ajioComparePrice'
      ], function (result) {
        if (selectedPlatform === 'amazon') {
          displayAmazonValues(result);
        } else if (selectedPlatform === 'flipkart') {
          displayFlipkartValues(result);
        } else if (selectedPlatform === 'ajio') {
          displayAjioValues(result);
        }
      });
    });
  }, 10000); // Wait for 10 seconds (10000 milliseconds)
}

function displayAmazonValues(result) {
  const amazonElements = ['amazonFullPrice', 'amazonProductPrices', 'amazonPriceDifference', 'discountDifference', 'amazonComparePrice', 'deliveryAmount', 'orderTotalAmount'];
  document.getElementById('amazonFullPrice').innerHTML = '<h2>Amazon Full Price:</h2><p>₹' + result.amazonFullPrice.join(', ') + '</p>';
  document.getElementById('amazonProductPrices').innerHTML = '<h2>Amazon Displayed Prices:</h2><p>₹' + result.amazonProductPrices.join(', ') + '</p>';
  document.getElementById('amazonPriceDifference').innerHTML = '<h2>Amazon Price Difference:</h2><p>₹' + result.amazonPriceDifference.join(', ') + '</p>';
  document.getElementById('discountDifference').innerHTML = '<h2>Amazon Discount Difference:</h2><p>₹-80</p>';
  document.getElementById('deliveryAmount').innerHTML = '<h2>Amazon Delivery Amount:</h2><p>₹40</p>';
  document.getElementById('orderTotalAmount').innerHTML = '<h2>Amazon Total Amount:</h2><p>₹16999</p>';
  document.getElementById('amazonComparePrice').innerHTML = '<h1>' + result.amazonComparePrice.join(', ') + '</h1>';
  updateIconAndTextColor(result.amazonComparePrice, 'amazonComparePrice');
  toggleElementsDisplay(amazonElements, 'block');
  loader.style.display = 'none';
}

function displayFlipkartValues(result) {
  const flipkartElements = ['flipkartFullPrices', 'flipkartOfferPrices', 'flipkartPriceDifference', 'flipkartdiscountDifference', 'flipkartComparePrice'];
  document.getElementById('flipkartFullPrices').innerHTML = '<h2>Flipkart Full Price:</h2><p>' + result.flipkartFullPrices.join(', ') + '</p>';
  document.getElementById('flipkartOfferPrices').innerHTML = '<h2>Flipkart Offer Prices:</h2><p>' + result.flipkartOfferPrices.join(', ') + '% </p>';
  document.getElementById('flipkartPriceDifference').innerHTML = '<h2>Flipkart Price Difference:</h2><p>' + result.flipkartPriceDifference.join(', ') + '</p>';
  document.getElementById('flipkartdiscountDifference').innerHTML = '<h2>Flipkart Discount Difference:</h2><p>' + result.flipkartdiscountDifference.join(', ') + '</p>';
  document.getElementById('flipkartComparePrice').innerHTML = '<h1>' + result.flipkartComparePrice.join(', ') + '</h1>';
  updateIconAndTextColor(result.flipkartComparePrice, 'flipkartComparePrice');
  toggleElementsDisplay(flipkartElements, 'block');
  loader.style.display = 'none';
}

function displayAjioValues(result) {
  const ajioElements = ['ajioFullPrice', 'ajioDiscountPrices', 'ajioPriceDifference', 'ajiodiscountDifference', 'ajioComparePrice'];
  document.getElementById('ajioFullPrice').innerHTML = '<h2>Ajio Full Price:</h2><p>' + result.ajioFullPrice.join(', ') + '</p>';
  document.getElementById('ajioDiscountPrices').innerHTML = '<h2>Ajio Discount Prices:</h2><p>' + result.ajioDiscountPrices.join(', ') + '% </p>';
  document.getElementById('ajioPriceDifference').innerHTML = '<h2>Ajio Price Difference:</h2><p>' + result.ajioPriceDifference.join(', ') + '</p>';
  document.getElementById('ajiodiscountDifference').innerHTML = '<h2>Ajio Discount Difference:</h2><p>' + result.ajiodiscountDifference.join(', ') + '</p>';
  document.getElementById('ajioComparePrice').innerHTML = '<h1>' + result.ajioComparePrice.join(', ') + '</h1>';
  updateIconAndTextColor(result.ajioComparePrice, 'ajioComparePrice');
  toggleElementsDisplay(ajioElements, 'block');
  loader.style.display = 'none';
}

function updateIconAndTextColor(prices, elementId) {
  const element = document.getElementById(elementId);
  element.innerHTML = '<h1>' + prices.join(', ') + '</h1>';
  if (prices.some(price => price.includes('no'))) {
    element.style.color = '#00FA9A';
    chrome.runtime.sendMessage({ action: 'setIcon', path: 'images/green.png' });
  } else if (prices.some(price => !price.includes('no'))) {
    element.style.color = 'red';
    chrome.runtime.sendMessage({ action: 'setIcon', path: 'images/red.png' });
  }
}

function hideAllValues() {
  const allElements = [
    'amazonFullPrice', 'amazonProductPrices', 'amazonPriceDifference', 'discountDifference', 'amazonComparePrice', 'deliveryAmount', 'orderTotalAmount',
    'flipkartFullPrices', 'flipkartOfferPrices', 'flipkartPriceDifference', 'flipkartdiscountDifference', 'flipkartComparePrice',
    'ajioFullPrice', 'ajioDiscountPrices', 'ajioPriceDifference', 'ajiodiscountDifference', 'ajioComparePrice'
  ];
  toggleElementsDisplay(allElements, 'none');
}

function toggleElementsDisplay(elementIds, display) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = display;
    } else {
      console.error(`Element with ID ${id} not found.`);
    }
  });
}

window.onload = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

  document.getElementsByClassName("analyze-button")[0].onclick = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
    });
  };

  document.getElementsByClassName("link")[0].onclick = function () {
    chrome.tabs.create({
      url: document.getElementsByClassName("link")[0].getAttribute("href"),
    });
  };
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "update_current_count") {
    document.getElementsByClassName("number")[0].textContent = (request.count/10).toFixed(0);
  }
});

document.querySelector('.analyze-button').addEventListener('click', function () {
  document.querySelector('.number').textContent = 'Detecting...';
});