import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './models/user';
import Garden from './models/garden';
import Product from './models/product';
import Order from './models/order';


const app = express();
const router = express.Router();

const request = require('request');


const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'farmahead.info@gmail.com',
        pass: 'farmahead009134info'
    }
});


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/farmahead');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('mongo open');
});



setInterval(function () {
    let curDate = new Date();
    let dateStr = curDate.toISOString();
    Garden.updateMany(
        {},
        {
            $set: {
                lastUpdate: dateStr
            },
            $inc: {
                water: -1,
                temperature: -1
            }
        },
        (err, result) => {
            if (err) {
                //console.log(err);
            } else {
                //console.log(result);
            }
        });
    Garden.find(
        {
            $or: [
                {
                    water: {
                        $lt: 75
                    }
                },
                {
                    temperature: {
                        $lt: 12
                    }
                }
            ]
        }).select('name owner ownerEmail water temperature').lean().exec(
            (err, gardens) => {
                gardens.forEach((g: any) => {
                    let mailOptions = {
                        from: 'farmahead.info@mail.com',
                        to: g.ownerEmail,
                        subject: 'FarmAhead upozorenje - ' + g.name + ' zahteva održavanje',
                        text: 'Poštovani,\n\nVaš rasadnik \'' + g.name + '\' zahteva održavanje.\nTrenutni nivo vode: ' + g.water + 'l.\nTrenutna temperatura: ' + g.temperature + '\u00B0C.\n\nVaš FarmAhead'
                    };

                    transporter.sendMail(mailOptions, (err: any, info: any) => {
                        if (err) {
                            //console.log(err);
                        } else {
                            //console.log('Email sent: ' + info.response);
                        }
                    })
                });
            });

}, 60 * 60 * 1000);



router.route('/login').post(
    (req, res) => {
        let username = req.body.username;
        let password = req.body.password;

        User.find({ 'username': username, 'password': password, 'approved': true },
            (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(user);
                }
            });
    }
);

router.route('/change-password').post(
    (req, res) => {
        let username = req.body.username;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        User.findOneAndUpdate(
            {
                'username': username,
                'password': oldPassword,
                'approved': 'true'
            },
            {
                $set: { 'password': newPassword }
            },
            {
                new: true
            },
            (err, result) => {
                if (err) {
                    res.status(400).json({ 'success': false });
                } else {
                    if (result == null) {
                        res.status(200).json({ 'success': false });
                    } else {
                        res.status(200).json({ 'success': true });
                    }
                }
            });
    }
);

router.route('/registration').post(
    (req, res) => {
        let user = JSON.parse(JSON.stringify(req.body));
        let username = user.username;
        if (user.type == 'preduzece') {
            let firstDate = new Date(0);
            let firstDateStr = firstDate.toISOString();
            user.transporters = []
            for (let i = 0; i < 5; i++) {
                user.transporters.push(firstDateStr);
            }
        }

        User.countDocuments({ 'username': username }, (err, count) => {
            if (count > 0) {
                res.json({ 'success': false });
            } else {
                User.create([user], (err, result) => {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        res.json({ 'success': true });
                    }
                });
            }
        });
    }
);

router.route('/validate-captcha').post(
    (req, res) => {
        let token = req.body.captcha;
        const secretKey = "YOUR_SECRET_KEY_HERE";

        //token validation url is URL: https://www.google.com/recaptcha/api/siteverify 
        // METHOD used is: POST

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`

        if (token === null || token === undefined) {
            console.log("token empty");
            res.json({ 'success': false });
        }

        request(url, (err: any, response: any, body: any) => {
            body = JSON.parse(body);

            if (body.success !== undefined && !body.success) {
                res.json({ 'success': false });
                return console.log('captcha validation failed')
            } else {
                res.json({ 'success': true });
            }
        });
    }
);

router.route('/admin/requests').get(
    (req, res) => {
        User.find({ 'approved': false },
            (err, users) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(users);
                }
            })
    }
);

router.route('/admin/users').get(
    (req, res) => {
        User.find({ 'approved': true },
            (err, users) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(users);
                }
            })
    }
);

router.route('/admin/accept-user').post(
    (req, res) => {
        let username = req.body.username;

        User.findOneAndUpdate(
            {
                'username': username
            },
            {
                $set: { 'approved': true }
            },
            {
                new: true
            },
            (err, result) => {
                if (err) {
                    res.status(400).json({ 'success': false });
                } else {
                    if (result == null) {
                        res.status(200).json({ 'success': false });
                    } else {
                        res.status(200).json({ 'success': true });
                    }
                }
            });
    }
);

router.route('/admin/delete-user').post(
    (req, res) => {
        let username = req.body.username;

        User.deleteOne(
            {
                'username': username
            },
            (err) => {
                if (err) {
                    res.status(400).json({ 'success': false });
                } else {
                    res.status(200).json({ 'success': true });
                }
            });
    }
);

router.route('/admin/update-user').post(
    (req, res) => {
        let username = req.body.username;

        User.findOneAndUpdate(
            {
                'username': username
            },
            {
                $set: {
                    'firstName': req.body.firstName,
                    'lastName': req.body.lastName,
                    'fullName': req.body.fullName,
                    'phone': req.body.phone,
                    'email': req.body.email
                }
            },
            {
                new: true
            },
            (err, result) => {
                if (err) {
                    res.status(400).json({ 'success': false });
                } else {
                    if (result == null) {
                        res.status(200).json({ 'success': false });
                    } else {
                        res.status(200).json({ 'success': true });
                    }
                }
            });
    }
);

router.route('/farmer/gardens').get(
    (req, res) => {
        let username = req.query.username;

        Garden.find({ 'owner': username }).select('owner name place rows cols free water temperature lastUpdate').lean().exec(
            (err, gardens) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(gardens);
                }
            }
        );
    }
);

router.route('/farmer/gardens/data').get(
    (req, res) => {
        let _id = req.query._id;

        Garden.find({ '_id': _id }).select('plants products').lean().exec(
            (err, plants) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(plants);
                }
            }
        );
    }
);

router.route('/shop/products').get(
    (req, res) => {
        Product.find({}).select('_id id name type companyName companyUsername amount time ratingSum ratingCount price').lean().exec(
            (err, products) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(products);
                }
            }
        )
    }
);

router.route('/shop/products/details').get(
    (req, res) => {
        let id = Number(req.query.id);

        Product.find({ id: id }).select('buyers comments').lean().exec(
            (err, details) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(details);
                }
            }
        );
    }
);

router.route('/shop/product/comment').post(
    (req, res) => {
        let id = req.body.id;
        let comment = req.body.comment;

        Product.findOneAndUpdate(
            {
                id: id
            },
            {
                $push: {
                    comments: comment
                },
                $inc: {
                    ratingCount: 1,
                    ratingSum: comment.rating
                }
            },
            (err, result) => {
                if (err) {
                    res.status(400).json({ 'success': false });
                } else {
                    if (result == null) {
                        res.status(200).json({ 'success': false });
                    } else {
                        res.status(200).json({ 'success': true });
                    }
                }
            });
    }
);

router.route('/farmer/gardens/update-water-and-temperature').post(
    (req, res) => {
        let _id = req.body._id;
        let water = req.body.water;
        let temperature = req.body.temperature;

        Garden.findOneAndUpdate(
            {
                _id: _id
            },
            {
                $set: {
                    water: water,
                    temperature: temperature
                }
            },
            (err, result) => {
                if (err) {
                    res.status(400).json({ 'success': false });
                } else {
                    if (result == null) {
                        res.status(200).json({ 'success': false });
                    } else {
                        res.status(200).json({ 'success': true });
                    }
                }
            });
    }
);

router.route('/farmer/gardens/newplant-addpreparation').post(
    (req, res) => {
        let gardenId = req.body.gardenId;
        let productId = req.body.productId;
        let plant = req.body.plant;
        let product = req.body.product;

        let freeSpotsIncrease = product.type == 'sadnica' ? -1 : 0;

        Garden.findOneAndUpdate(
            {
                _id: gardenId
            },
            {
                $pull: {
                    plants: {
                        row: plant.row,
                        col: plant.col
                    }
                },
                $inc: {
                    free: freeSpotsIncrease
                }
            }).then(() => {
                Garden.findOneAndUpdate(
                    {
                        _id: gardenId
                    },
                    {
                        $push: {
                            plants: plant
                        }
                    }).lean().exec(
                        (err, result: any) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let ind = result.products.findIndex((p: any) => p.id == productId);
                                if (ind >= 0) {
                                    if (result.products[ind].amount > 1) {
                                        Garden.findOneAndUpdate(
                                            {
                                                _id: gardenId,
                                            },
                                            {
                                                $pull: {
                                                    products: {
                                                        id: productId
                                                    }
                                                }
                                            }
                                        ).then(() => {
                                            Garden.findOneAndUpdate(
                                                {
                                                    _id: gardenId
                                                },
                                                {
                                                    $push: {
                                                        products: product
                                                    }
                                                },
                                                (err3, result3) => {
                                                    if (err3) {
                                                        console.log(err3);
                                                    } else {
                                                        //console.log(result3);
                                                    }
                                                });
                                        });
                                    } else {
                                        Garden.findOneAndUpdate(
                                            {
                                                _id: gardenId
                                            },
                                            {
                                                $pull: {
                                                    products: {
                                                        _id: productId
                                                    }
                                                }
                                            },
                                            (err, result) => {
                                                if (err) {
                                                    res.status(400).json({ 'success': false });
                                                    console.log(err);
                                                } else {
                                                    if (result == null) {
                                                        res.status(200).json({ 'success': false });
                                                        console.log(err);
                                                    } else {
                                                        res.status(200).json({ 'success': true });
                                                        console.log('new plant planted');
                                                    }
                                                }
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    )
            }
            )
    }
);

router.route('/farmer/gardens/takeout').post(
    (req, res) => {
        let gardenId = req.body.gardenId;
        let plant = req.body.plant;

        Garden.findOneAndUpdate(
            {
                _id: gardenId
            },
            {
                $pull: {
                    plants: {
                        row: plant.row,
                        col: plant.col
                    }
                },
                $inc: {
                    free: 1
                }
            }).then(() => {
                Garden.findOneAndUpdate(
                    {
                        _id: gardenId
                    },
                    {
                        $push: {
                            plants: plant
                        }
                    },
                    (err, result) => {
                        if (err) {
                            res.status(400).json({ 'success': false });
                        } else {
                            if (result == null) {
                                res.status(200).json({ 'success': false });
                            } else {
                                res.status(200).json({ 'success': true });
                            }
                        }
                    }
                )
            });
    }
);

router.route('/farmer/new-garden').post(
    (req, res) => {
        let garden = req.body.garden;

        Garden.create([garden], (err, result: any) => {
            if (err) {
                res.json({ 'success': false });
            } else {
                res.json({ 
                    'success': true,
                    '_id': result[0]._id
                });
            }
        });
    }
);

router.route('/company/remove-product').post(
    (req, res) => {
        let id = req.body.id;

        Product.deleteOne(
            {
                id: id
            },
            (err) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        )
    }
);

router.route('/company/set-amount').post(
    (req, res) => {
        let id = req.body.id;
        let amount = req.body.amount;

        Product.findOneAndUpdate(
            {
                id: id
            },
            {
                $set: {
                    amount: amount
                }
            },
            (err) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        )
    }
);

router.route('/company/new-product').post(
    (req, res) => {
        let product = req.body.product;

        Product.create([product], (err, result) => {
            if (err) {
                res.json({ 'success': false });
            } else {
                res.json({ 'success': true });
            }
        });
    }
);

router.route('/company/new-order').post(
    (req, res) => {
        let orders = req.body.orders;

        Order.insertMany(orders, (err, result) => {
            if (err) {
                res.json({ 'success': false });
            } else {
                res.json({ 'success': true });
            }
        });
    }
);

router.route('/farmer/new-order').post(
    (req, res) => {
        let _id = req.body._id;
        let products = req.body.products;

        Garden.findOneAndUpdate(
            {
                _id: _id
            },
            {
                $push: {
                    products: {
                        $each: products
                    }
                }
            },
            (err, result) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        );
    }
);

router.route('/shop/product/new-buyer').post(
    (req, res) => {
        let farmer = req.body.farmer;
        let productIds = req.body.productIds;

        Product.updateMany(
            {
                id: {
                    $in: productIds
                }
            },
            {
                $push: {
                    buyers: {
                        farmer: farmer
                    }
                }
            },
            (err, result) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        );
    }
);

router.route('/company/orders').get(
    (req, res) => {
        let companyUsername = req.query.username;

        Order.find(
            {
                companyUsername: companyUsername
            },
            (err, orders) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(orders);
                }
            }
        );
    }
);

router.route('/company/update-transporters').post(
    (req, res) => {
        let username = req.body.username;
        let transporters = req.body.transporters;

        User.findOneAndUpdate(
            {
                username: username
            },
            {
                $set: {
                    transporters: transporters
                }
            },
            (err, result) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        );
    }
);

router.route('/company/update-order-dates').post(
    (req, res) => {
        let id = req.body.id;
        let deliveryStartDate = req.body.deliveryStartDate;
        let deliveryDate = req.body.deliveryDate;

        Order.findOneAndUpdate(
            {
                id: id
            },
            {
                $set: {
                    deliveryStartDate: deliveryStartDate,
                    deliveryDate: deliveryDate
                }
            },
            (err, result) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        );
    }
);

router.route('/company/update-farmer-products').post(
    (req, res) => {
        let orderId = req.body.orderId;
        let gardenId = req.body.gardenId;
        let deliveryDate = req.body.deliveryDate;

        Garden.findOne(
            {
                _id: gardenId
            },
            (err1, result1: any) => {
                if (err1) {
                    console.log(err1);
                    res.json({ 'success': false });
                } else {
                    let products = result1.products;
                    products.forEach((p: any) => {
                        if (p.orderId == orderId) {
                            p.deliveryDate = deliveryDate
                        }
                    });
                    Garden.findOneAndUpdate(
                        {
                            _id: gardenId
                        },
                        {
                            $set: {
                                products: products
                            }
                        },
                        (err2, result2) => {
                            if (err2) {
                                res.json({ 'success': false });
                            } else {
                                res.json({ 'success': true });
                            }
                        }
                    );
                }
            }
        );
    }
);

router.route('/company/delete-farmer-products').post(
    (req, res) => {
        let orderId = req.body.orderId;
        let gardenId = req.body.gardenId;

        Garden.findOneAndUpdate(
            {
                _id: gardenId
            },
            {
                $pull: {
                    products: {
                        orderId: orderId
                    }
                }
            },
            (err, result: any) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        );
    }
);

router.route('/farmer/cancel-order').post(
    (req, res) => {
        let orderId = req.body.orderId;

        Order.findOneAndUpdate(
            {
                id: orderId
            },
            {
                $set: {
                    deliveryDate: 'otkazano'
                }
            },
            (err, result: any) => {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    res.json({ 'success': true });
                }
            }
        );
    }
);


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));