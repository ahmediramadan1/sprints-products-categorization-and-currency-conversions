import fetch from "node-fetch";

const products = async () => {
  try {
    const [response, exchangeRate] = await Promise.all([
      fetch("https://api.escuelajs.co/api/v1/products?offset=1&limit=3"),
      fetch("https://api.exchangerate.host/convert?from=USD&to=EGP")
    ]);

    if (!response.ok || !exchangeRate.ok) {
      throw new Error("Unable to fetch data from API");
    }

    const productsResponse = await response.json();
    const exchangeRateResponse = await exchangeRate.json();

    const conversionRate = exchangeRateResponse.result;

    const transformedProducts = productsResponse.reduce((acc, product) => {
      if (!acc[product.category?.id]) {
        acc[product.category?.id] = {
          category: {
            id: product.category?.id,
            name: product.category?.name,
          },
          products: [],
        };
      }

      const transformedProduct = { ...product, price: product.price * conversionRate };
      acc[product.category?.id].products.push(transformedProduct);

      return acc;
    }, {});

    console.log(JSON.stringify(Object.values(transformedProducts), null, 2));
  } catch (error) {
    console.log(error);
  }
};

products();
