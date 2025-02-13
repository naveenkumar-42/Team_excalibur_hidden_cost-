# app.py

from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
from flask import Flask, request, jsonify
from flask_cors import CORS


# Define Flask app instance
app = Flask(__name__)  
CORS(app)

def get_flipkart_price(product_titles):
    flipkart_data = []
    
    driver = webdriver.Edge()  # Edge WebDriver initialization
    
    for product_title in product_titles:
        flipkart_url = f"https://www.flipkart.com/search?q={product_title.replace(' ', '+')}"
        driver.get(flipkart_url)
        
        time.sleep(3)  # Allow time for the page to load
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Offered price selector
        price_element = soup.select_one('#container > div > div.nt6sNV.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div:nth-child(2) > div:nth-child(2) > div > div > div > a > div.yKfJKb.row > div.col.col-5-12.BfVC2z > div.cN1yYO > div.hl05eU > div.Nx9bqj._4b5DiR')
        # MRP selector
        mrp_element = soup.select_one('#container > div > div.nt6sNV.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div:nth-child(2) > div:nth-child(2) > div > div > div > a > div.yKfJKb.row > div.col.col-5-12.BfVC2z > div.cN1yYO > div.hl05eU > div.yRaY8j.ZYYwLA')
        # Offered percentage selector
        offer_percentage_element = soup.select_one('#container > div > div.nt6sNV.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div:nth-child(2) > div:nth-child(2) > div > div > div > a > div.yKfJKb.row > div.col.col-5-12.BfVC2z > div.cN1yYO > div.hl05eU > div.UkUFwK > span')
        
        if price_element:
            flipkart_price = price_element.text.strip().replace('₹', '').replace(',', '')
        else:
            flipkart_price = "Product not available on Flipkart"

        if mrp_element:
            flipkart_mrp = mrp_element.text.strip().replace('₹', '').replace(',', '')
        else:
            flipkart_mrp = "MRP not available"

        if offer_percentage_element:
            flipkart_offer_percentage = offer_percentage_element.text.strip()
        else:
            flipkart_offer_percentage = "Offered percentage not available"
        
        flipkart_data.append({
            "price": flipkart_price,
            "mrp": flipkart_mrp,
            "offer_percentage": flipkart_offer_percentage
        })
    
    driver.quit()
    
    return flipkart_data

@app.route('/compare', methods=['POST'])
def compare_prices():
    request_data = request.json
    amazonProductTitles = request_data.get('amazon_product_title')
    amazonProductPrices = request_data.get('amazon_product_price')

    flipkart_data = get_flipkart_price(amazonProductTitles)

    comparison_results = []

    for flipkart_info, amazon_price in zip(flipkart_data, amazonProductPrices):
        if amazon_price is None:
            comparison_result = "Unable to compare. Amazon price not available."
        elif flipkart_info["price"] == "Product not available on Flipkart":
            comparison_result = "Price not available on Flipkart"
        else:
            try:
                flipkart_price_float = float(flipkart_info["price"].replace(',', ''))
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
        'flipkart_data': flipkart_data,
        'amazon_prices': amazonProductPrices,
        'comparison_results': comparison_results
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5010)




#Perfomance -- 212ms 
