const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//customers
//create
app.post("/customers", async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, account_creation_date, notes } = req.body;

    const newCustomer = await pool.query(
      "INSERT INTO customers VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, account_creation_date, notes]
    );

    res.json(newCustomer.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
})

//return all customers
app.get("/customers", async (req, res) => {
  try {
    const allCustomers = await pool.query("SELECT * FROM customers");

    res.json(allCustomers.rows);
  } catch (error) {
    console.error(error.message);
  }
})

app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);

    res.json(customer.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
})

//get all comic pulls from a customer id
app.get("/customers/:id/comic-pulls", async (req, res) => {
  try {
    const { id } = req.params;

    const comicPulls = await pool.query("SELECT * FROM comic_pull_list WHERE customer_id = $1", [id]);

    res.json(comicPulls.rows);
  } catch (error) {
    console.error(error.message);
  }
})

//update
app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, account_creation_date, notes } = req.body;

    const customer = await pool.query("UPDATE customers SET first_name = $2, last_name = $3, phone_number = $4, email = $5, birth_date = $6, comic_discount = $7, store_credit = $8, account_creation_date = $9, notes = $10 WHERE id = $1 RETURNING *",
      [id, first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, account_creation_date, notes]
    );

    res.json(customer.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
})

//delete
app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCustomer = await pool.query("DELETE FROM customers WHERE id = $1", [id]);

    res.json("Deleted");
  } catch (error) {
    console.error(error.message);
  }
})


//comic pull list
//create
app.post("/comic-pull-list", async (req, res) => {
  try {
    const { customer_id, comic_title, issue_number, custom_item } = req.body;

    const newComicPulls = await pool.query(
      "INSERT INTO comic_pull_list VALUES(DEFAULT, $1, $2, $3, $4) RETURNING *",
      [customer_id, comic_title, issue_number, custom_item]
    );

    res.json(newComicPulls.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
})

//return
app.get("/comic-pull-list", async (req, res) => {
  try {
    const comicPulls = await pool.query("SELECT * FROM comic_pull_list");

    res.json(comicPulls.rows);
  } catch (error) {
    console.error(error.message);
  }
})



//update
app.put("/comic-pull-list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, comic_title, issue_number, custom_item } = req.body;

    const comic_pulls = await pool.query("UPDATE comic_pull_list SET customer_id = $2, comic_title = $3, issue_number = $4, custom_item = $5 WHERE id = $1 RETURNING *",
      [id, customer_id, comic_title, issue_number, custom_item]
    );

    res.json(comic_pulls.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
})

//delete
app.delete("/comic-pull-list/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletePull = await pool.query("DELETE FROM comic_pull_list WHERE id = $1", [id]);

    res.json("Deleted");
  } catch (error) {
    console.error(error.message);
  }
})

app.listen(5000, () => {
  console.log("server port 5000");
});