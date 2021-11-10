const browserPause = 1500;

describe('Automation Testing', () => {
  // Init consts and browser
  let siteURL;

  let usernameInput;
  let passwordInput;

  const username = 'standard_user';
  const password = 'secret_sauce';
  // End Init consts and browser

  before(async () => {
    siteURL = 'https://www.saucedemo.com/';

    await browser.url(siteURL);

    usernameInput = await $('input#user-name');
    passwordInput = await $('input#password');
  });

  // LOGIN

  it('should verify inputs are empty', async () => {
    // Verify input are empty
    const currentUsername = await usernameInput.getValue();
    await expect(currentUsername).toEqual('');

    const currentPassword = await passwordInput.getValue();
    await expect(currentPassword).toEqual('');
  });

  it('Set inputs respective values', async () => {
    // Set values
    await usernameInput.setValue(username);
    await passwordInput.setValue(password);

    await browser.pause(browserPause);
  });

  it('should verify that the input contains their respective values', async () => {
    // Verify input are empty
    const currentUsername = await usernameInput.getValue();
    await expect(currentUsername).toEqual(username);

    const currentPassword = await passwordInput.getValue();
    await expect(currentPassword).toEqual(password);
  });

  it('Verify user was logged in successfully', async () => {
    await $('input#login-button').click();

    const usernameCookie = await browser.getCookies(['session-username']);

    // Verify user was logged in successfully
    await expect(usernameCookie[0].value).toEqual(username);

    await browser.pause(browserPause);
  });

  // END LOGIN

  // DASHBOARD

  const addedProducts = [];

  it('should add 2 items in dashboard', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

    const inventoryItems = await $$('.inventory_list .inventory_item');

    if (inventoryItems.length >= 2) {
      for (let i = 0; i < 2; i++) {
        const item = await inventoryItems[i];
        await item.$('.btn_inventory').click();

        addedProducts.push(await item.$('.inventory_item_name').getText());
      }
    }

    await browser.pause(browserPause);

    // Click in shopping cart button
    await $('#shopping_cart_container .shopping_cart_link').click();
  });

  // END DASHBOARD

  //  CART

  it('should have the respective 2 products in the Your Cart form', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');

    const cartItems = await $$('.cart_list .cart_item');

    // Count the number of items in the cart
    await expect(cartItems.length).toEqual(2);

    for (let i = 0; i < 2; i++) {
      const item = await cartItems[i];

      const productName = await item.$('.inventory_item_name').getText();

      // Verify the product name is the same as the one added
      await expect(addedProducts.includes(productName)).toEqual(true);
    }

    await browser.pause(browserPause);
  });

  it('should click on the checkout button in Your Cart form', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');

    // Click in Checkout button
    await $('#checkout').click();

    await browser.pause(browserPause);
  });

  // END CART

  // CHECKOUT

  let firstNameInput;
  let lastNameInput;
  let postalCodeInput;

  it('should complete checkout form', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');

    firstNameInput = await $('#first-name');
    lastNameInput = await $('#last-name');
    postalCodeInput = await $('#postal-code');

    await firstNameInput.setValue('John');
    await lastNameInput.setValue('Doe');
    await postalCodeInput.setValue('12345');

    await browser.pause(browserPause);
  });

  it('should validate that required fields in the checkout form', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');

    const currentFirstName = await firstNameInput.getValue();
    await expect(currentFirstName).not.toEqual('');

    const currentLastName = await lastNameInput.getValue();
    await expect(currentLastName).not.toEqual('');

    const currentPostalCode = await postalCodeInput.getValue();
    await expect(currentPostalCode).not.toEqual('');
  });

  it('should click on the Continue button', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');

    await $('#continue').click();

    await browser.pause(browserPause);
  });

  it('should validate the sum of the item total', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');

    const cartItems = await $$('.cart_list .cart_item');

    // Count the number of items in the cart
    await expect(cartItems.length >= 2).toEqual(true);

    let totalSum = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const item = await cartItems[i];

      let productPrice = await item.$('.inventory_item_price').getText();

      // Remove $ from the price
      productPrice = productPrice.trim().replace('$', '');

      totalSum += parseFloat(productPrice);
    }

    let totalSumText = await $('.summary_total_label').getText();

    // Remove unnecessary characters from the price
    totalSumText = totalSumText.trim().replace('Total: $', '');

    const totalSumInApp = parseFloat(totalSumText);

    const totalWithTax = parseFloat((totalSum * 1.08).toFixed(2)); // 8% tax

    // Check if the sum of the products is the same as the one in the app
    await expect(totalSumInApp).toEqual(totalWithTax);

    await browser.pause(browserPause);
  });

  it('should click on the finish button', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');

    await $('#finish').click();

    await browser.pause(browserPause);
  });

  it('should validate that THANK YOU FOR YOUR ORDER is displayed', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-complete.html');

    const thankYouMessage = 'THANK YOU FOR YOUR ORDER';
    const thankYouText = await $('.complete-header').getText();

    await expect(thankYouText).toEqual(thankYouMessage);
  });

  // END CHECKOUT
});
