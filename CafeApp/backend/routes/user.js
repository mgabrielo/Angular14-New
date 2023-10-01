const express = require('express');
const connection = require('../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config()
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole')

router.post('/signup', (req, res) => {
    let user = req.body
    var query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "INSERT INTO user(name,contactnumber,email,password, status,role) VALUES(?,?,?,?,'false', 'user');"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: 'registration successful' })
                    }
                    return res.status(500).json({ message: err })
                })
            } else {
                return res.status(400).json({ message: 'email already exist' })
            }
        } else {
            return res.status(500).json(err)
        }
    })

})



router.post('/login', (req, res) => {
    const user = req.body
    let query = "select email,password,role, status from user  where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password !== user.password) {
                return res.status(401).json({ message: ' Incorrect user email or password ' })
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: 'wait for admin approval' })
            } else if (results[0].password === user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken })
            } else {
                return res.status(400).json({ message: 'Something Went Wrong. Please Try Again Later' });
            }
        } else {
            res.status(500).json(err)
        }
    })
})

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
    }
});

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    let query = "select email,password from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: 'Password Reset Sent to Email' })
            } else {
                var mailOptions = {
                    from: 'adminverification@email.com',
                    to: results[0].email,
                    subject: 'Password Cafe Reset',
                    html: `<p><b> Your Login Details </b></br><b>Email:</b>${results[0].email}
                    </br>
                    <b>password:</b>
                    ${results[0].password}
                    </br>
                    <a href="http://localhost:4200">Click to Reset</a>
                    </p>`
                }
                transport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('email sent: ', info.response)
                    }
                })
                return res.status(200).json({ message: 'Password Reset Sent to Email' })
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/get', auth.authToken, checkRole.checkRole, (req, res) => {
    var query = " select id, name , email, contactnumber, status from user where role='user' ";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update', auth.authToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: 'user id does not exist' })
            }
            return res.status(200).json({ message: 'user updated successfully' })
        } else {
            return res.status(500).json(err)
        }

    })
})

router.get('/checkToken', auth.authToken, checkRole.checkRole, (req, res) => {
    return res.status(200).json({ message: 'true' })
})

router.post('/changePassword', auth.authToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email
    var query = "select  *  from user where email=? and password=?"
    connection.query(query, [email, user.oldPassword], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                return res.status(400).json({ message: 'Incorrect Password' })
            } else if (result[0].password === user.oldPassword) {
                var query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: ' password updated successfully ' })
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(400).json({ message: 'something wrong, try again later' })
            }

        } else {
            return res.status(500).json(err)
        }
    })
})
module.exports = router; 