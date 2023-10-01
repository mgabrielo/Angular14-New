const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path')
var fs = require('fs');
var uuid = require('uuid')
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/generateReport', auth.authToken, (req, res) => {
    const generateUUid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails)
    var query = `insert into bill (name, uuid, email, contactNumber,paymentMethod,total,productDetails,createdBy)
     values(?,?,?,?,?,?,?,?)
    `
    connection.query(
        query,
        [
            orderDetails.name,
            generateUUid,
            orderDetails.email,
            orderDetails.contactNumber,
            orderDetails.paymentMethod,
            orderDetails.totalAmount,
            orderDetails.productDetails.toString(),
            res.locals.email
        ],
        (err, result) => {
            if (!err) {
                ejs.renderFile(
                    path.join(__dirname, '', "report.ejs"), {
                    productDetails: productDetailsReport,
                    name: orderDetails.name,
                    email: orderDetails.email,
                    contactNumber: orderDetails.contactNumber,
                    paymentMethod: orderDetails.paymentMethod,
                    totalAmount: orderDetails.totalAmount,
                }, (err, results) => {
                    if (err) {
                        res.status(500).json(err)
                    } else {
                        pdf.create(results).toFile(`./generated_pdf/${generateUUid}.pdf`, (err, data) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).json(err)
                            } else {
                                return res.status(200).json({ uuid: generateUUid })
                            }
                        })
                    }
                })
            } else {
                return res.status(500).json(err)
            }
        }
    )
})


router.post('/getPdf', auth.authToken, (req, res) => {
    const orderDetails = req.body
    const pdfPath = `./generated_pdf/${orderDetails.uuid}.pdf`;
    // console.log(pdfPath)

    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res)
    } else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails)
        ejs.renderFile(
            path.join(__dirname, '', "report.ejs"), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
        }, (err, results) => {
            if (err) {
                res.status(500).json(err)
            } else {
                pdf.create(results).toFile(`./generated_pdf/${orderDetails.uuid}.pdf`, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json(err)
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res)
                    }
                })
            }
        })
    }
})

router.get('/getBills', auth.authToken, (req, res) => {
    let query = "select * from bill order by id DESC"
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id', auth.authToken, (req, res) => {
    const id = req.params.id
    let query = "delete from bill where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'Bill not Found' });
            } else {
                return res.status(200).json({ message: 'Bill Deleted Successfully' });
            }
        } else {
            return res.status(500).json(err)
        }
    })
})
module.exports = router