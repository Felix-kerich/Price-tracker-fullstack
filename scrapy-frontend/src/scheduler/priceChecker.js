import axios from 'axios';
import db from '../db/db.js'; // Ensure this import is correct
import { getTargetPrice } from '../db/db.js';
import { sendEmailNotification } from '../utils/sendEmail.js';

const getLatestPrice = (products) => {
  // Sort the products by timestamp in descending order
  const sortedProducts = products.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  // Return the price of the most recent product
  return sortedProducts[0] ? sortedProducts[0].price : null;
};

const fetchProductDetails = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.products;
  } catch (error) {
    console.error(`Error fetching product details from ${url}:`, error);
    return null;
  }
};

const checkPrice = async (productId) => {
  try {
    const targetRecord = getTargetPrice(productId);
    
    if (!targetRecord) {
      console.log(`No target found for product ID: ${productId}`);
      return;
    }

    const { target_price: targetPrice } = targetRecord;

    // Try fetching from Amazon first
    let products = await fetchProductDetails(`http://127.0.0.1:8080/amazon/graph_details/${productId}`);

    // If no data from Amazon, try fetching from Jumia
    if (!products || products.length === 0) {
      console.log(`No data found on Amazon for product ID: ${productId}, checking Jumia...`);
      products = await fetchProductDetails(`http://127.0.0.1:8080/jumia/graph_details/${productId}`);
    }

    // If no data is available from both sources, log and return
    if (!products || products.length === 0) {
      console.log(`No price data available for product ID: ${productId} on both Amazon and Jumia.`);
      return;
    }

    // Extract the price and timestamp
    const price = getLatestPrice(products);

    // If price is null or undefined, handle accordingly
    if (price === null) {
      console.log(`No valid price data available for product ID: ${productId}`);
      return;
    }

    if (price <= targetPrice) {
      console.log(`Target price met current (${price}) set target (${targetPrice}) for product ID: ${productId}. Sending notification...`);
      
      // The email fetching is now handled within sendEmailNotification
      await sendEmailNotification(productId, price); // Call with productId and current price 
    } else {
      console.log(`Current price (${price}) has not reached the target (${targetPrice}) for product ID: ${productId}`);
    }
  } catch (error) {
    console.error(`Error checking price for product ID: ${productId}`, error);
  }
};

const schedulePriceCheck = () => {
  console.log("Database instance:", db); // Log the db instance
  const productRecords = db.prepare('SELECT product_id FROM price_checks').all();

  if (productRecords.length > 0) {
    productRecords.forEach(({ product_id }) => {
      checkPrice(product_id);
    });
  } else {
    console.log('No products found in the database for price tracking.');
  }
};

setInterval(schedulePriceCheck, 60 * 60 * 1000); // 1 hour interval
schedulePriceCheck();

export { checkPrice }; // Export if needed elsewhere
