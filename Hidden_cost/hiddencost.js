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

        // Get the current tab's URL and send it to the backend Flask server
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const currentTabUrl = tabs[0].url;

          // Send the URL to the Flask backend using a fetch request
          fetch(`http://localhost:5123/automate?url=${encodeURIComponent(currentTabUrl)}`)
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
              // Store the delivery amount and order total amount in local storage
              chrome.storage.local.set({
                delivery_Amount: data["Delivery Amount"],
                orderTotal_Amount: data["Order Total Amount"]
              });
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });

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

        // Get the current tab's URL and send it to the backend Flask server
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const currentTabUrl = tabs[0].url;

          // Send the URL to the Flask backend using a fetch request
          fetch(`http://localhost:5123/automate?url=${encodeURIComponent(currentTabUrl)}`)
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
              // Store the delivery amount and order total amount in local storage
              chrome.storage.local.set({
                delivery_Amount: data["Delivery Amount"],
                orderTotal_Amount: data["Order Total Amount"]
              });
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });

      } else {
        hideAllValues();
        chrome.runtime.sendMessage({ action: 'setIcon', path: 'images/default.png' }); // Set icon to default
      }
    });
  } else {
    console.error("Checkbox element not found.");
  }

  function fetchAndDisplayValues() {
    loader.style.display = 'block';

    // Set a timeout for 10 seconds
    setTimeout(() => {
      const amazonElements = ['amazonFullPrice', 'amazonProductPrices', 'amazonPriceDifference', 'discountDifference', 'amazonComparePrice', 'delivery_Amount', 'orderTotal_Amount'];
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
          'amazonPriceDifference', 'amazonFullPrice', 'amazonProductPrices', 'discountDifference', 'delivery_Amount', 'orderTotal_Amount',
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
    }, 35000); // Wait for 35 seconds (35000 milliseconds)
  }

  function displayAmazonValues(result) {
    const amazonElements = ['amazonFullPrice', 'amazonProductPrices', 'amazonPriceDifference', 'discountDifference', 'amazonComparePrice', 'delivery_Amount', 'orderTotal_Amount'];

    document.getElementById('amazonFullPrice').innerHTML = '<h2>MRP on Amazon:</h2><p>₹' + result.amazonFullPrice.join(', ') + '</p>';
    document.getElementById('amazonProductPrices').innerHTML = '<h2>Displayed Prices on Amazon:</h2><p>₹' + result.amazonProductPrices.join(', ') + '</p>';
    document.getElementById('amazonPriceDifference').innerHTML = '<h2>Correct Calculation:</h2><p>₹' + result.amazonPriceDifference.join(', ') + '</p>';
    const amazonPriceDifference = parseFloat(result.amazonPriceDifference.join(', ').replace(/₹|,/g, '').trim());
    const orderTotal_Amount = parseFloat(result.orderTotal_Amount.replace(/₹|,/g, '').trim());
    const discountDifference = amazonPriceDifference - orderTotal_Amount;
    document.getElementById('discountDifference').innerHTML = '<h2>Amazon Discount Difference:</h2><p>₹' + discountDifference.toFixed(2) + '</p>';
    document.getElementById('delivery_Amount').innerHTML = '<h2>Amazon Delivery Amount:</h2><p>' + result.delivery_Amount + '</p>';
    document.getElementById('orderTotal_Amount').innerHTML = '<h2>Amazon Total Amount:</h2><p>' + result.orderTotal_Amount + '</p>';
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
      'amazonFullPrice', 'amazonProductPrices', 'amazonPriceDifference', 'discountDifference', 'amazonComparePrice', 'delivery_Amount', 'orderTotal_Amount',
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
});
