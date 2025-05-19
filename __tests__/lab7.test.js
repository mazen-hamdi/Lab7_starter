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
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return item.data; // Corrected: directly return item.data
      });
    });

    // Loop through each product item's data
    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const itemData = prodItemsData[i];
      if (!itemData || itemData.title.length == 0 || itemData.price.length == 0 || itemData.image.length == 0) {
        allArePopulated = false;
        break; // Exit loop if any item is not populated
      }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const firstProdItem = await page.$('product-item');
    const shadowRoot = await firstProdItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    
    // Ensure button is "Add to Cart" before clicking, or click twice if it's "Remove from Cart"
    let currentButtonText = await button.evaluate(btn => btn.innerText);
    if (currentButtonText === 'Remove from Cart') {
        await button.click(); // Click to change to "Add to Cart"
        await page.waitForTimeout(100); // Brief pause for UI update
    }
    await button.click(); // Click to change to "Remove from Cart" (or from "Add to Cart")

    const buttonTextAfterClick = await button.evaluate(btn => btn.innerText);
    expect(buttonTextAfterClick).toBe('Remove from Cart');
  }, 5000); // Increased timeout slightly

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Adding all items to cart updates cart count to 20', async () => {
    console.log('Checking number of items in cart on screen...');
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.evaluate(btn => btn.innerText);
      if (buttonText === 'Add to Cart') {
        await button.click();
        // await page.waitForTimeout(50); // Optional small delay
      }
    }
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 30000); // Increased timeout for iterating 20 items

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('After adding all items and reload, buttons are "Remove from Cart" and cart count is 20', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.evaluate(btn => btn.innerText);
      expect(buttonText).toBe('Remove from Cart');
    }
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 20000); // Increased timeout

  // Check to make sure that the cart in localStorage is what you expect
  it('After adding all items, localStorage cart contains all 20 item IDs', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    const expectedCart = JSON.stringify(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(cart).toBe(expectedCart);
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Removing all items from cart updates cart count to 0', async () => {
    console.log('Checking number of items in cart on screen after removing from cart...');
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.evaluate(btn => btn.innerText);
      if (buttonText === 'Remove from Cart') {
        await button.click();
        // await page.waitForTimeout(50); // Optional small delay
      }
    }
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 30000); // Increased timeout

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('After removing all items and reload, buttons are "Add to Cart" and cart count is 0', async () => {
    console.log('Checking number of items in cart on screen after reload (post-removal)...');
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.evaluate(btn => btn.innerText);
      expect(buttonText).toBe('Add to Cart');
    }
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 20000); // Increased timeout

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('After removing all items, localStorage cart is empty', async () => {
    console.log('Checking the localStorage for an empty cart...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});