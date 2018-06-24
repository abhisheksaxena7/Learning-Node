const placeOrder = (orderNumber) => {
    console.log(`Customer Order: ${orderNumber}`);
    setTimeout(() => {
        // Callback
        console.log(`Order Delivered:  ${orderNumber}`);
    }, 5000);
};

// Simulate user's web request
placeOrder(1);
placeOrder(2);
placeOrder(3);
placeOrder(4);
placeOrder(5);
placeOrder(6);
