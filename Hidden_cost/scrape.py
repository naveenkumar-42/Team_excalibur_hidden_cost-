from flask import Flask, jsonify, request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.edge.options import Options as EdgeOptions
import time

# Replace these with your Amazon credentials
amazon_email = "sabarish.it22@bitsathy.ac.in"
amazon_password = "Sabarish@2005"

# Initialize Flask app
app = Flask(__name__)

def click_element_with_js(driver, element):
    driver.execute_script("arguments[0].scrollIntoView(true);", element)  # Scroll into view if needed
    driver.execute_script("arguments[0].click();", element)  # Click via JavaScript

@app.route('/automate', methods=['GET'])
def automate_amazon_purchase():
    # Get the product URL from the request parameters
    amazon_product_url = request.args.get('url')

    if not amazon_product_url:
        return jsonify({"error": "Product URL not provided"}), 400  # Return a 400 error if URL is missing

    # Initialize Edge WebDriver
    edge_options = EdgeOptions()
    edge_options.add_argument("--start-maximized")
    driver = webdriver.Edge(options=edge_options)

    try:
        # Step 1: Open the product page
        driver.get(amazon_product_url)

        # Step 2: Click on the 'Buy Now' button
        buy_now_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "buy-now-button"))
        )
        click_element_with_js(driver, buy_now_button)

        # Step 3: Login to Amazon (phone number/email and password)
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "ap_email"))
        )
        email_input.send_keys(amazon_email)

        continue_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "continue"))
        )
        continue_button.click()

        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "ap_password"))
        )
        password_input.send_keys(amazon_password)

        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "signInSubmit"))
        )
        click_element_with_js(driver, login_button)

        # Step 4: Handle iframes and COD payment method selection
        iframes = driver.find_elements(By.TAG_NAME, 'iframe')
        if iframes:
            driver.switch_to.frame(iframes[0])

        # Select Cash on Delivery (COD) payment method
        cod_payment_radio = WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//*[contains(@id, 'pp-') and contains(@id, '-162')]//div//div"))
        )
        click_element_with_js(driver, cod_payment_radio)

        # Switch back from iframe if necessary
        driver.switch_to.default_content()

        # Step 5: Click 'Use this payment method'
        use_this_payment_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//*[contains(@id, 'pp-') and contains(@id, '-165')]//span//input"))
        )
        click_element_with_js(driver, use_this_payment_button)

        # Wait for the page to load
        time.sleep(25)

        # Step 6: Scrape delivery and total order amounts
        delivery_amount = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#subtotals-marketplace-table > tbody > tr:nth-child(2) > td.a-text-right.aok-nowrap.a-nowrap"))
        ).text

        order_total = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#subtotals-marketplace-table > tbody > tr:nth-child(6) > td.a-color-price.a-size-medium.a-text-right.grand-total-price.aok-nowrap.a-text-bold.a-nowrap"))
        ).text
        



        print(delivery_amount)
        print(order_total)

        
        # Return the scraped amounts as JSON
        return jsonify({
            "Delivery Amount": delivery_amount,
            "Order Total Amount": order_total
        })
        

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        driver.quit()

# Run the Flask app on localhost port 5123
if __name__ == "__main__":
    app.run(debug=True, port=5123)