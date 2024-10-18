let isHighlighting = false;

function highlightElements(elements, backgroundColor, padding, borderRadius, fontWeight) {
  elements.forEach(element => {
    element.style.backgroundColor = isHighlighting ? backgroundColor : '';
    element.style.padding = isHighlighting ? padding : '';
    element.style.borderRadius = isHighlighting ? borderRadius : '';
    element.style.fontWeight = isHighlighting ? fontWeight : '';
  });
}

function highlightAmazonProductDetails() {
  const productPrices = document.querySelectorAll('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole');
  const productTitles = document.querySelectorAll('#productTitle');
  const discountPrices = document.querySelectorAll('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-size-large.a-color-price.savingPriceOverride.aok-align-center.reinventPriceSavingsPercentageMargin.savingsPercentage');
  const fullPrice = document.querySelectorAll('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-small.aok-align-center > span > span.aok-relative > span.a-size-small.a-color-secondary.aok-align-center.basisPrice > span');
  const productTotal = document.querySelectorAll('#subtotals-marketplace-table > tbody > tr:nth-child(4) > td.a-color-price.a-size-medium.a-text-right.grand-total-price.aok-nowrap.a-text-bold.a-nowrap');

  highlightElements(productPrices, '#4F6F52', '2px 5px', '3px', 'bold');
  highlightElements(productTitles, '#BFD8AF', '2px 5px', '3px', 'bold');
  highlightElements(discountPrices, '#D2E3C8', '2px 5px', '3px', 'bold');
  highlightElements(fullPrice, '#D2E3C8', '2px 5px', '3px', 'bold');
  highlightElements(productTotal, '#D2E3C8', '2px 5px', '3px', 'bold');

  function amazoncompareprice(productPrice, amazonPriceDifference) {
    if (productPrice > amazonPriceDifference) {
      return "There is hidden cost";
    } else {
      return "There is no hidden cost";
    }
  }

  let amazonPriceDifferenceArray = Array.from(fullPrice).map((price, index) => {
    let fullPriceValue = parseFloat(price.textContent.replace(/,/g, '').replace('₹', '').split('₹')[0]);
    let discountPrice = parseFloat(discountPrices[index]?.textContent.replace(/,/g, '').replace('-', '').replace('%', '')) / 100;
    let amazonPriceDifference = fullPriceValue - (fullPriceValue * discountPrice);
    return amazonPriceDifference;
  });

  let amazonComparePriceArray = amazonPriceDifferenceArray.map((amazonPriceDifference, index) => {
    let productPriceValue = parseFloat(productPrices[index]?.textContent.replace(/,/g, '').replace('₹', ''));
    return amazoncompareprice(productPriceValue, amazonPriceDifference);
  });

  let discountDifferenceArray = amazonPriceDifferenceArray.map((amazonPriceDifference, index) => {
    let productPriceValue = parseFloat(productPrices[index]?.textContent.replace(/,/g, '').replace('₹', ''));
    let ans = productPriceValue - amazonPriceDifference;
    return ans.toFixed(2);
  });

  chrome.storage.local.set({
    'amazonProductPrices': Array.from(productPrices).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('₹', ''))),
    'amazonProductTitles': Array.from(productTitles).map(title => title.textContent),
    'amazonDiscountPrices': Array.from(discountPrices).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('-', ''))),
    'amazonFullPrice': Array.from(fullPrice).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('₹', '').split('₹')[0])),
    'amazonProductTotal': Array.from(productTotal).map(total => total.textContent),
    'amazonPriceDifference': amazonPriceDifferenceArray,
    'amazonComparePrice': amazonComparePriceArray,
    'discountDifference': discountDifferenceArray
  });

  function updateStoredValues() {
    chrome.storage.local.get(['deliveryAmount', 'itemsAmount', 'orderTotalAmount', 'promotionAppliedAmount', 'totalAmount'], function (result) {
      document.getElementById('deliveryAmount').textContent = 'Delivery Amount: ₹' + (result.deliveryAmount || 0).toFixed(2);
      document.getElementById('itemsAmount').textContent = 'Items Amount: ₹' + (result.itemsAmount || 0).toFixed(2);
      document.getElementById('orderTotalAmount').textContent = 'Order Total Amount: ₹' + (result.orderTotalAmount || 0).toFixed(2);
      document.getElementById('promotionAppliedAmount').textContent = 'Promotion Applied Amount: ₹' + (result.promotionAppliedAmount || 0).toFixed(2);
      document.getElementById('totalAmount').textContent = 'Total Amount: ₹' + (result.totalAmount || 0).toFixed(2);

      const deliveryAmount = parseFloat(result.deliveryAmount) || 0;
      const itemsAmount = parseFloat(result.itemsAmount) || 0;
      const orderTotalAmount = parseFloat(result.orderTotalAmount) || 0;
      const promotionAppliedAmount = parseFloat(result.promotionAppliedAmount) || 0;
      const totalAmount = parseFloat(result.totalAmount) || 0;

      const updatedTotalAmount = totalAmount - deliveryAmount;

      document.getElementById('totalAmount').textContent = 'Total Amount: ₹' + updatedTotalAmount.toFixed(2);
    });
  }

  chrome.storage.local.get(['totalAmount', 'amazonProductPrices'], function (result) {
    document.getElementById('totalAmount').textContent = 'Total Amount: ₹' + (result.totalAmount || 0).toFixed(2);
    const totalAmount = parseFloat(result.totalAmount) || 0;
    const amazonProductPrices = result.amazonProductPrices || [];

    const updatedPrices = amazonProductPrices.map(price => {
      return price - totalAmount;
    });

    chrome.storage.local.get(['totalAmount', 'discountDifference'], function (result) {
      document.getElementById('totalAmount').textContent = 'Total Amount: ₹' + (result.totalAmount || 0).toFixed(2);

      const discountDifference = result.discountDifference || [];
      const sumDiscountDifference = discountDifference.reduce((acc, cur) => acc + parseFloat(cur), 0);

      const totalAmount = parseFloat(result.totalAmount) || 0;
      const newTotalAmount = totalAmount + sumDiscountDifference;

      document.getElementById('totalAmount').textContent = 'Total Amount: ₹' + newTotalAmount.toFixed(2);

      chrome.storage.local.set({
        'AmazonProductFinalPrices': updatedPrices,
        'amazontotalHiddenCost': newTotalAmount
      });
    });
  });

  updateStoredValues();
}


function highlightFlipkartProductDetails() {
  const productPrices = document.querySelectorAll('#container div._30jeq3._16Jk6d, #container > div > div._1Er18h > div > div._1YokD2._2GoDe3.col-12-12 > div:nth-child(1) > div > div:nth-child(3) > div > div._2nQDXZ > div._3fSRat > span._2-ut7f._1WpvJ7');
  const productTitles = document.querySelectorAll('#container h1 span.B_NuCI');
  const fullPrices = document.querySelectorAll('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(2) > div > div.dyC4hf > div.CEmiEU > div > div._3I9_wc._2p6lqe, #container > div > div._1Er18h > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div._2nQDXZ > div._3fSRat > span._2-ut7f._2xc6hH');
  const discountPercentages = document.querySelectorAll('#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(2) > div > div.dyC4hf > div.CEmiEU > div > div._3Ay6Sb._31Dcoz, #container > div > div._1Er18h > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div._2nQDXZ > div._3fSRat > span.dML6Ak');
  const finalPrices = document.querySelectorAll('#container > div > div._1Er18h > div > div._1YokD2._2GoDe3.col-12-12 > div._1YokD2._3Mn1Gg.col-4-12._78xt5Y > div._1AtVbE.col-12-12 > div > div > div > div._3LxTgx > div > div.z4Ha90 > span > div > div > div.z4Ha90');

  highlightElements(productPrices, '#4F6F52', '2px 5px', '3px', 'bold');
  highlightElements(productTitles, '#BFD8AF', '2px 5px', '3px', 'bold');
  highlightElements(fullPrices, '#D2E3C8', '2px 5px', '3px', 'bold');
  highlightElements(discountPercentages, '#D4E7C5', '2px 5px', '3px', 'bold');
  highlightElements(finalPrices, '#D2E3C8', '2px 5px', '3px', 'bold');

  function flipkartcompareprice(productPrice, offerPrice) {
    if (productPrice > offerPrice) {
      return "There is hidden cost";
    } else {
      return "There is no hidden cost";
    }
  }

  let offerPricesArray = Array.from(fullPrices).map((price, index) => {
    let fullPriceValue = parseFloat(price.textContent.replace(/,/g, '').replace('₹', '').split('₹')[0]);
    let discountPercentage = parseFloat(discountPercentages[index]?.textContent.replace(/,/g, '').replace('-', '').replace('%', ''));
    let offerPrice = fullPriceValue - (fullPriceValue * discountPercentage / 100);
    return offerPrice.toFixed(2);
  });

  let flipkartComparePriceArray = offerPricesArray.map((offerPrice, index) => {
    let productPriceValue = parseFloat(productPrices[index]?.textContent.replace(/,/g, '').replace('₹', ''));
    return flipkartcompareprice(productPriceValue, offerPrice);
  });


  let discountDifferenceArray = offerPricesArray.map((offerPrice, index) => {
    let productPriceValue = parseFloat(productPrices[index]?.textContent.replace(/,/g, '').replace('₹', ''));
    let ans = productPriceValue - offerPrice;
    return ans.toFixed(2);
  });

  chrome.storage.local.set({
    'flipkartProductPrices': Array.from(productPrices).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('₹', ''))),
    'flipkartProductTitles': Array.from(productTitles).map(title => title.textContent),
    'flipkartFullPrices': Array.from(fullPrices).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('₹', '').split('₹')[0])),
    'flipkartOfferPrices': Array.from(discountPercentages).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('-', ''))),
    'flipkartPriceDifference': offerPricesArray,
    'flipkartFinalPrices': Array.from(finalPrices).map(price => price.textContent),
    'flipkartComparePrice': flipkartComparePriceArray,
    'flipkartdiscountDifference': discountDifferenceArray
  });
}

function highlightAjioProductDetails() {
  const productPrices = document.querySelectorAll('#appContainer > div.content > div > div > div.prod-container > div > div.col-4 > div > div.prod-price-section > div.prod-sp');
  const productTitles = document.querySelectorAll('#appContainer > div.content > div > div > div.prod-container > div > div.col-4 > div > h1');
  const fullPrices = document.querySelectorAll('#appContainer > div.content > div > div > div.prod-container > div > div.col-4 > div > div.prod-price-section > div.prod-price-sec > span.prod-cp');
  const discountPercentages = document.querySelectorAll('#appContainer > div.content > div > div > div.prod-container > div > div.col-4 > div > div.prod-price-section > div.prod-price-sec > span.prod-discnt');
  const finalPrices = document.querySelectorAll('#orderTotal > span.price-value.bold-font');

  highlightElements(productPrices, '#4F6F52', '2px 5px', '3px', 'bold');
  highlightElements(productTitles, '#BFD8AF', '2px 5px', '3px', 'bold');
  highlightElements(fullPrices, '#D2E3C8', '2px 5px', '3px', 'bold');
  highlightElements(discountPercentages, '#D4E7C5', '2px 5px', '3px', 'bold');
  highlightElements(finalPrices, '#D2E3C8', '2px 5px', '3px', 'bold');

  function ajioComparePrice(productPrice, offerPrice) {
    if (productPrice > offerPrice) {
      return "There is hidden cost";
    } else {
      return "There is no hidden cost";
    }
  }

   let offerPricesArray = Array.from(fullPrices).map((price, index) => {
    let fullPriceValue = parseFloat(price.textContent.replace(/,/g, '').replace('₹', '').split('₹')[0]);
    let discountPercentage = parseFloat(discountPercentages[index]?.textContent.replace(/,/g, '').replace('-', '').replace('%', ''));
    let offerPrice = fullPriceValue - (fullPriceValue * discountPercentage / 100);
    return offerPrice.toFixed(2);
  });

  let ajioComparePriceArray = offerPricesArray.map((offerPrice, index) => {
    let productPriceValue = parseFloat(productPrices[index]?.textContent.replace(/,/g, '').replace('₹', ''));
    return ajioComparePrice(productPriceValue, offerPrice);
  });


  let discountDifferenceArray = offerPricesArray.map((offerPrice, index) => {
    let productPriceValue = parseFloat(productPrices[index]?.textContent.replace(/,/g, '').replace('₹', ''));
    let ans = productPriceValue - offerPrice;
    return ans.toFixed(2);
  });

  chrome.storage.local.set({
    'ajioProductPrices': Array.from(productPrices).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('₹', ''))),
    'ajioProductTitles': Array.from(productTitles).map(title => title.textContent),
    'ajioFullPrice': Array.from(fullPrices).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('₹', '').split('₹')[0])),
    'ajioOfferPrice': Array.from(discountPercentages).map(price => parseFloat(price.textContent.replace(/,/g, '').replace('-', ''))),
    'ajioPriceDifference': offerPricesArray,
    'ajioFinalPrices': Array.from(finalPrices).map(price => price.textContent),
    'ajioComparePrice': ajioComparePriceArray,
    'ajiodiscountDifference': discountDifferenceArray
  });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleHighlighting') {
    isHighlighting = request.isHighlighting;
    const url = window.location.href;
    if (url.includes('amazon')) {
      highlightAmazonProductDetails();
    } else if (url.includes('flipkart')) {
      highlightFlipkartProductDetails();
    } else if (url.includes('ajio')) {
    highlightAjioProductDetails();
  }
    chrome.storage.local.set({ isHighlighting: isHighlighting });
  }
});

chrome.storage.local.get(['isHighlighting'], function (result) {
  isHighlighting = result.isHighlighting || false;
  const url = window.location.href;
  if (url.includes('amazon')) {
    highlightAmazonProductDetails();
  } else if (url.includes('flipkart')) {
    highlightFlipkartProductDetails();
  }  else if (url.includes('ajio')) {
    highlightAjioProductDetails();
  }
});

window.addEventListener('load', function () {
  const url = window.location.href;
  if (url.includes('amazon')) {
    highlightAmazonProductDetails();
  } else if (url.includes('flipkart')) {
    highlightFlipkartProductDetails();
  }  else if (url.includes('ajio')) {
    highlightAjioProductDetails();
  }
});





// content.js

// Function to send a message to the background script with the current URL
function sendUrlToBackgroundScript() {
  chrome.runtime.sendMessage({ action: 'sendUrl', url: window.location.href });
}

// Function to open a new tab with the provided URL
function openNewTab(url) {
  chrome.tabs.create({ url: url });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'openNewTab') {
    openNewTab(request.url);  // Change 'request.data' to 'request.url'
  }
});

// Call the function to send the current URL to the background script
sendUrlToBackgroundScript();





const endpoint = "http:/127.0.0.1:5000/";
const descriptions = {
  "Sneaking": "Coerces users to act in ways that they would not normally act by obscuring information.",
  "Urgency": "Places deadlines on things to make them appear more desirable",
  "Misdirection": "Aims to deceptively incline a user towards one choice over the other.",
  "Social Proof": "Gives the perception that a given action or product has been approved by other people.",
  "Scarcity": "Tries to increase the value of something by making it appear to be limited in availability.",
  "Obstruction": "Tries to make an action more difficult so that a user is less likely to do that action.",
  "Forced Action": "Forces a user to complete extra, unrelated tasks to do something that should be simple.",
};

function scrape() {
  // website has already been analyzed
  if (document.getElementById("insite_count")) {
    return;
  }

  // aggregate all DOM elements on the page
  let elements = segments(document.body);
  let filtered_elements = [];

  for (let i = 0; i < elements.length; i++) {
    let text = elements[i].innerText.trim().replace(/\t/g, " ");
    if (text.length == 0) {
      continue;
    }
    filtered_elements.push(text);
  }

  // post to the web server
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filtered_elements }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      data = data.replace(/'/g, '"');
      json = JSON.parse(data);
      let dp_count = 0;
      let element_index = 0;

      for (let i = 0; i < elements.length; i++) {
        let text = elements[i].innerText.trim().replace(/\t/g, " ");
        if (text.length == 0) {
          continue;
        }

        if (json.result[i] !== "Not Dark") {
          highlight(elements[element_index], json.result[i]);
          dp_count++;
        }
        element_index++;
      }

      // store number of dark patterns
      let g = document.createElement("div");
      g.id = "insite_count";
      g.value = dp_count;
      g.style.opacity = 0;
      g.style.position = "fixed";
      document.body.appendChild(g);
      sendDarkPatterns(g.value);
    })
    .catch((error) => {
      alert(error);
      alert(error.stack);
    });
}

function highlight(element, type) {
  element.classList.add("insite-highlight");

  let body = document.createElement("span");
  body.classList.add("insite-highlight-body");

  /* header */
  let header = document.createElement("div");
  header.classList.add("modal-header");
  let headerText = document.createElement("h1");
  headerText.innerHTML = type + " Pattern";
  header.appendChild(headerText);
  body.appendChild(header);

  /* content */
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = descriptions[type];
  body.appendChild(content);

  element.appendChild(body);
}

function sendDarkPatterns(number) {
  chrome.runtime.sendMessage({
    message: "update_current_count",
    count: number,
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "analyze_site") {
    scrape();
  } else if (request.message === "popup_open") {
    let element = document.getElementById("insite_count");
    if (element) {
      sendDarkPatterns(element.value);
    }
  }
});