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
});
