const express = require('express')
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    let query = "insert into product (name, categoryId, description, price, status) values(?,?,?,?, 'true')";
    connection.query(
        query,
        [product.name, product.categoryId, product.description, product.price],
        (err, result) => {
            if (!err) {
                return res.status(200).json({ message: 'product added successfully' })
            } else {
                return res.status(500).json(err)
            }
        }
    )
})

router.get('/get', auth.authToken, (req, res) => {
    var query = `select p.id, p.name, p.price, c.id as categoryId, c.name as categoryName
                 from product as p INNER JOIN category as c 
                 where p.categoryId= c.id`
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(err)
        }
    })

})

router.get('/getByCategory/:id', auth.authToken, (req, res) => {
    const id = req.params.id;
    let query = "select id, name from product where categoryId=? and status='true' "
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(err)
        }
    })
})


router.get('/getProductById/:id', auth.authToken, (req, res) => {
    const id = req.params.id;
    let query = "select id, name, description, price from product where id=?";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).json(result[0])
        } else {
            return res.status(500).json(err)
        }
    })
})


router.patch('/update', auth.authToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    let query = "update product set name=?, categoryId=?, description=?, price=? where id=?";
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(400).json({ message: 'Product Not Found' })
            }
            return res.status(200).json({ message: 'Product Update Successful' })
        } else {
            return res.status(500).json(err)
        }
    })
})


router.delete('/delete/:id', auth.authToken, (req, res) => {
    const id = req.params.id;
    let query = "delete from product where id=?"
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: 'Product Not Found' })
            } else {
                return res.status(200).json({ message: 'Product Delete successfully' })
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/updateStatus', auth.authToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    let query = "update product set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: 'Product Not Found' });
            } else {
                return res.status(200).json({ message: 'Product Update Successful' });
            }
        } else {
            return res.status(500).json(err)
        }
    })
})
module.exports = router