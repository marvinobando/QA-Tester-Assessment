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

    await browser.pause(1500);
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

    await browser.pause(1500);
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

    await browser.pause(1500);

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

    await browser.pause(1500);
  });

  it('should click on the checkout button in Your Cart form', async () => {
    await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');

    // Click in Checkout button
    await $('#checkout').click();

    await browser.pause(1500);
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

    await browser.pause(1500);

    // await $('#continue').click();
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

  // END CHECKOUT
});
