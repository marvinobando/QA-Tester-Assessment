describe('Application login', () => {
  it('should login with valid credentials', async () => {
      await browser.url(`https://www.saucedemo.com/`);

      await $('input#user-name').setValue('standard_user');
      await $('input#password').setValue('secret_sauce!');
      await $('input#login-button').click();

      // await expect($('#flash')).toBeExisting();
      // await expect($('#flash')).toHaveTextContaining(
      //     'You logged into a secure area!');
  });
});

