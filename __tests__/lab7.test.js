describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    let allArePopulated = true;

    const prodItemsData = await page.$$eval('product-item', prodItems =>
      prodItems.map(item => item.data)
    );

    for (const data of prodItemsData) {
      if (data.title.length === 0 || data.price.length === 0 || data.image.length === 0) {
        allArePopulated = false;
      }
    }

    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    const prodItem = await page.$('product-item');
    const shadow = await prodItem.getProperty('shadowRoot');
    const button = await shadow.$('button');

    await button.click();
    const innerText = await (await button.getProperty('innerText')).jsonValue();
    expect(innerText).toBe('Remove from Cart');
  }, 2500);


  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
   it('Checking number of items in cart on screen', async () => {
    const prodItems = await page.$$('product-item');

    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const btn = await shadow.$('button');
      const txt = await (await btn.getProperty('innerText')).jsonValue();
      if (txt === 'Add to Cart') await btn.click();
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    await page.reload({ waitUntil: 'networkidle0' });

    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const btnText = await shadow.$eval('button', btn => btn.innerText);
      expect(btnText).toBe('Remove from Cart');
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
 it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    const prodItems = await page.$$('product-item');

    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const btn = await shadow.$('button');
      const txt = await (await btn.getProperty('innerText')).jsonValue();
      if (txt === 'Remove from Cart') await btn.click();
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);
  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    await page.reload({ waitUntil: 'networkidle0' });

    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const btnText = await shadow.$eval('button', btn => btn.innerText);
      expect(btnText).toBe('Add to Cart');
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);


  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it.skip('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
  });
});
