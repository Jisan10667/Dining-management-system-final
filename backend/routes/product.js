const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const role = require("../services/checkRole");

const router = express.Router();

router.post("/add", auth.authenticate, role.checkRole, (req, res) => {
  let product = req.body;
  let query =
    'insert into product (name, categoryID, description, price, imageURL, status) values(?,?,?,?,?, "true")';

  connection.query(
    query,
    [product.name, product.categoryID, product.description, product.price, product.imageURL],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "খাবারটি সফলভাবে যোগ করা হয়েছে" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});


router.get("/get", auth.authenticate, (req, res, next) => {
  let query =
    "select p.id, p.name, p.description, p.price, p.status, p.imageURL,c.id as categoryID, c.name as categoryName from product as p INNER JOIN category as c where p.categoryID=c.id ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/getByCategoryID/:id", auth.authenticate, (req, res, next) => {
  const id = req.params.id;
  let query =
    'select id, name from product where categoryID=? and status="true"';
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/getByID/:id", (req, res, next) => {
  const id = req.params.id;
  let query = "select id,name,description,price from product where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results[0] });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.patch("/update", auth.authenticate, role.checkRole, (req, res, next) => {
  let product = req.body;
  let query =
    "update product set name=?, categoryID=?, description=?, price=?, imageURL=? where id=?";
  connection.query(
    query,
    [product.name, product.categoryID, product.description, product.price, product.imageURL, product.id],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "আইটেমটি খুঁজে পাওয়া যায় নি" });
        }
        return res.status(200).json({ message: "আইটেমটি সফলভাবে আপডেট করা হয়েছে" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});


router.delete(
  "/delete/:id",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const id = req.params.id;
    let query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "আইটেমটি খুঁজে পাওয়া যায় নি" });
        }
        return res
          .status(200)
          .json({ message: "আইটেমটি সফলভাবে মুছে ফেলা হয়েছে" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const product = req.body;
    let query = "update product set status=? where id=?";
    connection.query(query, [product.status, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "আইটেমটি খুঁজে পাওয়া যায় নি" });
        }
        return res
          .status(200)
          .json({ message: "আইটেমটি সফলভাবে যুক্ত করা হয়েছে" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

module.exports = router;
