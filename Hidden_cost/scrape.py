from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.edge.options import Options as EdgeOptions
import time

# Replace these with your Amazon credentials
amazon_email = "sabarish.it22@bitsathy.ac.in"
amazon_password = "Sabarish@2005"

# Initialize Edge WebDriver
edge_options = EdgeOptions()
edge_options.add_argument("--start-maximized")
driver = webdriver.Edge(options=edge_options)

# URL of the Amazon product page (replace with the product's link)
amazon_product_url = "https://www.amazon.in/gp/product/B0B2WQFHB2/ref=ewc_pr_img_1?smid=AJ6SIZC8YQDZX&psc=1"

try:
    # Step 1: Open the product page
    driver.get(amazon_product_url)
    time.sleep(5)  # Wait for the page to load

    # Step 2: Click on the 'Buy Now' button
    buy_now_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "buy-now-button"))
    )
    buy_now_button.click()

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
    login_button.click()

    # Step 4: Wait for checkout page to load and select 'Cash on Delivery' payment method
    time.sleep(3)  # Adjust if necessary for page load time

    # Check for iframe and switch
    iframes = driver.find_elements(By.TAG_NAME, 'iframe')
    if iframes:
        print("Switching to iframe")
        driver.switch_to.frame(iframes[0])

    # Try clicking the COD radio button
    cod_payment_radio = WebDriverWait(driver, 40).until(
        EC.element_to_be_clickable((By.XPATH, "//input[@type='radio' and contains(@value, 'Cash on Delivery')]"))
    )
    driver.execute_script("arguments[0].scrollIntoView(true);", cod_payment_radio)  # Scroll into view if needed
    cod_payment_radio.click()

    # Switch back from iframe if necessary
    driver.switch_to.default_content()

    # Step 5: Click 'Use this payment method'
    use_this_payment_button = WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='ppw-widgetEvent:SetPaymentPlanSelectContinue']"))
    )
    driver.execute_script("arguments[0].scrollIntoView(true);", use_this_payment_button)  # Scroll into view if needed
    use_this_payment_button.click()

    time.sleep(3)  # Allow page to update

    # Step 6: Wait for delivery and total order amounts to be updated
    time.sleep(10)  # Add extra wait time to ensure the page updates fully

    # Step 7: Scrape delivery and total order amounts
    delivery_amount = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "#subtotals-marketplace-table > tbody > tr:nth-child(2) > td.a-text-right.aok-nowrap.a-nowrap"))
    ).text

    order_total = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "#subtotals-marketplace-table > tbody > tr:nth-child(4) > td.a-color-price.a-size-medium.a-text-right.grand-total-price.aok-nowrap.a-text-bold.a-nowrap"))
    ).text

    # Step 8: Print the scraped amounts
    print(f"Delivery Amount: {delivery_amount}")
    print(f"Order Total Amount: {order_total}")

finally:
    # Close the browser
    driver.quit()
