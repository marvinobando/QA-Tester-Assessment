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

    usernameInput = $('input#user-name');
    passwordInput = $('input#password');

    await browser.url(siteURL);
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

    await $('.shopping_cart_link').click();

    // await browser.pause(3000);
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
  });

  // END CART
});