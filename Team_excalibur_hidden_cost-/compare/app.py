from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def get_flipkart_price(product_titles):
    flipkart_prices = []
    for product_title in product_titles:
        flipkart_url = f"https://www.flipkart.com/search?q={product_title.replace(' ', '+')}"
        flipkart_selector = "._30jeq3"
        response = requests.get(flipkart_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        price_element = soup.select_one(flipkart_selector)
        if price_element:
            # Extract text and remove currency symbol and commas
            flipkart_price = price_element.text.strip().replace('₹', '').replace(',', '')
            flipkart_prices.append(flipkart_price)
        else:
            flipkart_prices.append("Product not available on Flipkart")
    return flipkart_prices


@app.route('/compare', methods=['POST'])
def compare_prices():
    # Retrieve data from the request JSON
    request_data = request.json
    amazonProductTitles = request_data.get('amazon_product_title')
    amazonProductPrices = request_data.get('amazon_product_price')

    # Fetch the Flipkart prices for the stored Amazon product titles
    flipkart_prices = get_flipkart_price(amazonProductTitles)

    # Initialize lists to store comparison results
    comparison_results = []

    # Compare each Flipkart price with the corresponding Amazon price
    for flipkart_price, amazon_price in zip(flipkart_prices, amazonProductPrices):
        if amazon_price is None:
            comparison_result = "Unable to compare. Amazon price not available."
        elif flipkart_price == "Product not available on Flipkart":
            comparison_result = "Price not available on Flipkart"
        else:
            try:
                flipkart_price_float = float(flipkart_price.replace(',', ''))
                if flipkart_price_float < amazon_price:
                    comparison_result = "Flipkart price is lower than Amazon price."
                elif flipkart_price_float > amazon_price:
                    comparison_result = "Flipkart price is higher than Amazon price."
                else:
                    comparison_result = "Flipkart price is the same as Amazon price."
            except ValueError:
                comparison_result = "Error: Unable to convert Flipkart price to float."

        comparison_results.append(comparison_result)

    response_data = {
        'flipkart_prices': flipkart_prices,
        'amazon_prices': amazonProductPrices,
        'comparison_results': comparison_results
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5010)
