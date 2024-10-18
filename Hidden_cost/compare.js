//compare.js

document.addEventListener('DOMContentLoaded', function() {
  var compareButton = document.getElementById('compareButton');
  compareButton.addEventListener('click', function() {
    comparePrices();
  });
});

function comparePrices() {
  // Show the loading indicator
  var loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block';

  chrome.storage.local.get(['amazonProductTitles', 'amazonProductPrices'], function (result) {
    let amazonProductTitles = result.amazonProductTitles;
    let amazonProductPrices = result.amazonProductPrices;

    // Filter out any empty product titles
    amazonProductTitles = amazonProductTitles.filter(title => title.trim() !== "");

    if (!amazonProductTitles.length || !amazonProductPrices.length) {
      alert('Amazon product data is not available. Please set the product title and price.');
      loadingIndicator.style.display = 'none'; // Hide loading indicator
      return;
    }

    console.log({
      amazon_product_title: amazonProductTitles,
      amazon_product_price: amazonProductPrices
    });

    fetch('http://localhost:5010/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amazon_product_title: amazonProductTitles,
        amazon_product_price: amazonProductPrices
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response to check what data you are getting
      displayComparison(data);
      loadingIndicator.style.display = 'none'; // Hide loading indicator after results are displayed
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while fetching data. Please try again later.');
      loadingIndicator.style.display = 'none'; // Hide loading indicator
    });
  });
}




function displayComparison(data) {
  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  var flipkartData = data.flipkart_data || [];
  var amazonPrices = data.amazon_prices || [];
  var comparisonResults = data.comparison_results || [];

  if (flipkartData.length === 0 || amazonPrices.length === 0 || comparisonResults.length === 0) {
    alert("No data available for comparison.");
    return;
  }

  // Loop through the data and display results for each product
  for (let i = 0; i < flipkartData.length; i++) {
    let flipkartInfo = flipkartData[i];

    // Display Amazon price
    var amazonResult = document.createElement("div");
    amazonResult.classList.add("result");
    amazonResult.innerHTML = "<h3>Amazon</h3><p>" + amazonPrices[i] + "</p>";
    resultsDiv.appendChild(amazonResult);

    // Display Flipkart price, MRP, and offer percentage
    var flipkartResult = document.createElement("div");
    flipkartResult.classList.add("result");
    flipkartResult.innerHTML = `
      <h3>Flipkart</h3>
      <p>Price: ${flipkartInfo.price}</p>
      <p>MRP: ${flipkartInfo.mrp}</p>
      <p>Offer: ${flipkartInfo.offer_percentage}</p>
    `;
    resultsDiv.appendChild(flipkartResult);

    // Calculate price difference
    var priceDifference = document.createElement("div");
    priceDifference.classList.add("result");
    var difference = Math.abs(parseFloat(amazonPrices[i]) - parseFloat(flipkartInfo.price));
    priceDifference.innerHTML = "<h3>Price Difference</h3><p>" + difference + "</p>";
    resultsDiv.appendChild(priceDifference);

    // Display comparison result
    var comparisonMessage = document.createElement("div");
    comparisonMessage.classList.add("result");
    comparisonMessage.innerHTML = "<h3 class='compare'>Comparison Result</h3><p>" + comparisonResults[i] + "</p>";
    resultsDiv.appendChild(comparisonMessage);
  }
}
