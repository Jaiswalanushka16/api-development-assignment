const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");
const axios = require("axios");

function csvJSON(csv) {
  var lines = csv.split("\n");

  var result = [];
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return result; //JSON
}

const app = express();
app.use(bodyParser.json());
const url =
  "https://drive.google.com/uc?export=download&id=1YfhCPZbofAekMy9tPH_7ZXChVX8w_OUF";

// API 1: Total items sold in Marketing for last Q3 of the year
app.get("/api/total_items", async (req, res) => {
  const schema = Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required(),
    department: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { start_date, end_date, department } = value;

  console.log("making API all to", url);
  const response = await axios.get(url);
  const JSON_response = csvJSON(response.data);
  const total_seats = JSON_response.filter(
    (item) =>
      department === item.department &&
      new Date(start_date) <= new Date(item.date) &&
      new Date(end_date) >= new Date(item.date)
  ).reduce((acc, item) => {
    return (acc += Number(item.seats));
  }, 0);
  res.json(total_seats);
});

// API 2: Nth most sold item in terms of quantity/price in a given quarter
app.get("/api/nth_most_total_item", async (req, res) => {
  const schema = Joi.object({
    item_by: Joi.string().valid("quantity", "price").required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required(),
    n: Joi.number().integer().required(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { item_by, start_date, end_date, n } = value;

  console.log("making API all to", url);
  const response = await axios.get(url);
  const JSON_response = csvJSON(response.data);
  const filteredItems = JSON_response.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(start_date) && itemDate <= new Date(end_date);
  });
  const sortingFactor = item_by === "quantity" ? "seats" : "amount";
  const sortedItems = filteredItems.sort(
    (a, b) => b[sortingFactor] - a[sortingFactor]
  );
  // Retrieve the nth most sold item
  const nthItem = sortedItems[n - 1];
  // console.log(nthItem);
  //   return nthItem ? nthItem.name : null;
  res.json(nthItem ? nthItem.software : null);
});

// API 3: Percentage of sold items (seats) department-wise
app.get("/api/percentage_of_department_wise_sold_items", async (req, res) => {
  const schema = Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { start_date, end_date } = value;

  const departmentCounts = {};

  console.log("making API all to", url);
  const response = await axios.get(url);
  const JSON_response = csvJSON(response.data);
  // Calculate the total seats sold by department
  JSON_response.filter((item) => {
    const itemDate = new Date(item.date);
    const start = new Date(start_date);
    const end = new Date(end_date);

    return itemDate >= start && itemDate <= end;
  }).forEach((item) => {
    const department = item.department;
    const seats = parseInt(item.seats);

    if (departmentCounts[department]) {
      departmentCounts[department] += seats;
    } else {
      departmentCounts[department] = seats;
    }
  });

  // Calculate the total seats sold
  const totalSeatsSold = Object.values(departmentCounts).reduce(
    (total, count) => total + count,
    0
  );

  // Calculate the percentage of sold items department-wise
  const departmentPercentages = {};
  for (const department in departmentCounts) {
    const seatsSold = departmentCounts[department];
    const percentage = (seatsSold / totalSeatsSold) * 100;
    departmentPercentages[department] = percentage.toFixed(2);
  }
  res.json(departmentPercentages);
});

// API 4: Monthly sales for a product
app.get("/api/monthly_sales", async (req, res) => {
  const schema = Joi.object({
    product: Joi.string().required(),
    year: Joi.number().integer().required(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { product, year } = value;

  console.log("making API all to", url);
  const response = await axios.get(url);
  const JSON_response = csvJSON(response.data);

  const monthlySales = Array(12).fill(0);

  JSON_response.forEach((sale) => {
    const saleDate = new Date(sale.date);
    const saleYear = saleDate.getFullYear();
    const saleMonth = saleDate.getMonth();

    if (sale.software === product && saleYear === year) {
      monthlySales[saleMonth] += Number(sale.amount);
    }
  });
  res.json(monthlySales);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
