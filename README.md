# API Development Assignment

This project implements a set of APIs for analyzing software purchase data. The APIs allow you to retrieve information such as total items sold, most sold items, percentage of sold items department-wise, and monthly sales for a specific product.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [API Reference](#api-reference)
- [Technology Stack](#technology-stack)
- [License](#license)

## Getting Started

### Prerequisites

Make sure you have the following software installed on your machine:

- Node.js (https://nodejs.org) - JavaScript runtime environment

### Installation

1. Clone the repository or download the source code:

   ```shell
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```shell
   cd api-development-assignment
   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

### Running the Server

To start the server, run the following command:

```shell
npm start
```

The server will start listening on port 3000.

## API Endpoints

The following API endpoints are available:

- `GET /api/total_items`: Retrieves the total items sold in marketing for the last quarter of the year.

- `GET /api/nth_most_total_item`: Retrieves the nth most sold item in terms of quantity or price within a given date range.

- `GET /api/percentage_of_department_wise_sold_items`: Retrieves the percentage of sold items department-wise.

- `GET /api/monthly_sales`: Retrieves the monthly sales for a specific product.

## API Reference

#### Get all items

```http
  GET /api/total_items
```

| Parameter    | Type     | Description                        |
| :----------- | :------- | :--------------------------------- |
| `start_date` | `date`   | **Required**. Start Date of search |
| `end_date`   | `date`   | **Required**. End Date of search   |
| `department` | `string` | **Required**. Department to filter |

#### Get all items

```http
  GET /api/nth_most_total_item
```

| Parameter    | Type      | Description                                     |
| :----------- | :-------- | :---------------------------------------------- |
| `item_by`    | `string`  | **Required**. Order factor ( quantity or price) |
| `start_date` | `date`    | **Required**. Start Date of search              |
| `end_date`   | `date`    | **Required**. End Date of search                |
| `n`          | `integer` | **Required**. n th most sold item               |

#### Get all items

```http
  GET /api/percentage_of_department_wise_sold_items
```

| Parameter    | Type   | Description                        |
| :----------- | :----- | :--------------------------------- |
| `start_date` | `date` | **Required**. Start Date of search |
| `end_date`   | `date` | **Required**. End Date of search   |

#### Get all items

```http
  GET /api/monthly_sales
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `product` | `string` | **Required**. Product to be queried |
| `year`    | `number` | **Required**. Year for sales report |

## Technology Stack

- Node.js - JavaScript runtime environment
- Express - Web application framework
- Joi - Data validation library
- Axios - HTTP client for making API requests
