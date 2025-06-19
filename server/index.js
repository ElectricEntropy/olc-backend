const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//customers
//create
app.post("/api/customers", async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, notes } = req.body;
    const account_creation_date = new Date().toLocaleString();

    const newCustomer = await pool.query(
      "INSERT INTO customers VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, account_creation_date, notes]
    );

    res.json(newCustomer.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//return all customers
app.get("/api/customers", async (req, res) => {
  try {
    const allCustomers = await pool.query("SELECT * FROM customers");

    res.json(allCustomers.rows);
  } catch (error) {
    console.error(error.message);
  }
})

app.get("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);

    res.json(customer.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//update
app.put("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, notes } = req.body;

    const customer = await pool.query("UPDATE customers SET first_name = $2, last_name = $3, phone_number = $4, email = $5, birth_date = $6, comic_discount = $7, store_credit = $8, notes = $9 WHERE id = $1 RETURNING *",
      [id, first_name, last_name, phone_number, email, birth_date, comic_discount, store_credit, notes]
    );

    res.json(customer.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//delete
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCustomer = await pool.query("DELETE FROM customers WHERE id = $1", [id]);

    res.json("Deleted");
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})


//comics
//create
app.post("/api/comics", async (req, res) => {
  try {
    const { title, issue_number, publisher, distributor, release_date, is_custom } = req.body;
    //const added_at = new Date().toLocaleString();

    const newComic = await pool.query(
      "INSERT INTO comics VALUES(DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING *",
      [title, issue_number, publisher, distributor, release_date, is_custom]
    );

    res.json(newComic.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//return all comics
app.get("/api/comics", async (req, res) => {
  try {
    const allComics = await pool.query("SELECT * FROM comics");

    res.json(allComics.rows);
  } catch (error) {
    console.error(error.message);
  }
})

app.get("/api/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const comic = await pool.query("SELECT * FROM comics WHERE id = $1", [id]);

    res.json(comic.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//update
app.put("/api/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, issue_number, publisher, distributor, release_date, is_custom } = req.body;

    const comic = await pool.query("UPDATE comics SET title = $2, issue_number = $3, publisher = $4, distributor = $5, release_date = $6, is_custom = $7 WHERE id = $1 RETURNING *",
      [id, title, issue_number, publisher, distributor, release_date, is_custom]
    );

    res.json(comic.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//delete
app.delete("/api/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteComic = await pool.query("DELETE FROM comics WHERE id = $1", [id]);

    res.json("Deleted");
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//comic pulls
//create
app.post("/api/customers/:id/pulls", async (req, res) => {
  try {
    const customer_id = req.params.id;
    const comic_id = req.body.id;
    const quantity = req.body.quantity || 1;
    const date_added = new Date().toLocaleString();

    const newComicPulls = await pool.query(
      "INSERT INTO pulls VALUES(DEFAULT, $1, $2, $3, $4) RETURNING *",
      [customer_id, comic_id, quantity, date_added]
    );

    res.json(newComicPulls.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//get all comic pulls from a customer id
app.get("/api/customers/:id/pulls", async (req, res) => {
  try {
    const { id } = req.params;

    const comicPulls = await pool.query("SELECT * FROM pulls WHERE customer_id = $1", [id]);

    res.json(comicPulls.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//return all pulls
app.get("/api/pulls", async (req, res) => {
  try {
    const comicPulls = await pool.query("SELECT * FROM pulls");

    res.json(comicPulls.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//update
app.put("/api/pulls/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, comic_id, quantity } = req.body;

    const comic_pulls = await pool.query("UPDATE pulls SET customer_id = $2, comic_id = $3, quantity = $4 WHERE id = $1 RETURNING *",
      [id, customer_id, comic_id, quantity]
    );

    res.json(comic_pulls.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

//delete pull
app.delete("/api/pulls/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletePull = await pool.query("DELETE FROM pulls WHERE id = $1", [id]);

    res.json("Deleted");
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})

app.listen(5000, () => {
  console.log("server port 5000");
});