const Joi = require("joi");
const _ = require('lodash');
const { Client } = require("../models/client");
const { State } = require("../models/state");
const { Property } = require("../models/property");
const { Mls } = require("../models/mls");
const { User } = require("../models/user");
const { Payment } = require("../models/payment");
const { Chart } = require("../models/chart");
const { ApiToken } = require("../models/apitoken");
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer')
const config = require("config");
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk');
var https = require('https');
var querystring = require('querystring');
var request = require('request');
var syncrequest = require('sync-request');
var handlebars = require('handlebars');
const fs = require('fs');
const RetsHelpers = require("../helpers/retsrabbit");
const BridgeHelpers = require("../helpers/bridge");
const CorelogicHelpers = require("../helpers/corelogic");
const mongoose = require('mongoose');

const stripe = require("stripe")(config.get("stripe_sk"));

const promisecreatesubscription = data => {
    return new Promise((resolve, reject) => {

        stripe.subscriptions.create(data, (err, customer) => {

            if (err) {
                console.log(err)
                reject(err);
            }

            resolve(customer)
        });
    })
}

const promiseretsubscription = data => {

    return new Promise((resolve, reject) => {

        stripe.subscriptions.retrieve(data, (err, customer) => {

            if (err) {
                console.log(err)
                reject(err);
            }

            resolve(customer)
        });
    })
}

const promisegetcustomer = data => {

    return new Promise((resolve, reject) => {

        stripe.customers.retrieve(data, (err, customer) => {

            if (err) {
                console.log(err)
                reject(err);
            }

            resolve(customer)
        });
    })
}

const promisecreatecustomer = data => {
    return new Promise((resolve, reject) => {
        stripe.customers.create(data, (err, customer) => {
            if (err) {
                throw err;
            }
            resolve(customer)
        });
    })
}

const promisedelsub = data => {

    return new Promise((resolve, reject) => {
        stripe.subscriptions.del(data, (err, confirmation) => {
            if (err) {
                throw err;
            }
            resolve(confirmation)
        });
    })
    //stripe.subscriptions.del(subscription
}

const promisepaydetails = data => {

    return new Promise((resolve, reject) => {

        stripe.paymentMethods.create(data, (err, paymentMethod) => {

            if (err) {
                //console.log(err)
                reject(err);
            }

            resolve(paymentMethod)
        });

    })

}

const promisepaydetailsret = data => {

    return new Promise((resolve, reject) => {

        stripe.paymentMethods.retrieve(data, (err, paymentMethod) => {

            if (err) {
                //console.log(err)
                reject(err);
            }

            resolve(paymentMethod)
        });

    })

}

const promiseaddpaymentmethod = (data1, data2) => {

    return new Promise((resolve, reject) => {

        stripe.paymentMethods.attach(data1, data2, (err, paymentMethod) => {

            if (err) {
                //console.log(err)
                reject(err);
            }

            resolve(paymentMethod)
        });

    })

}

const promiseupdatesub = (data1, data2) => {

    return new Promise((resolve, reject) => {

        stripe.subscriptions.update(data1, data2, (err, customer) => {

            if (err) {
                //console.log(err)
                reject(err);
            }

            resolve(customer)
        });

    })

}

const promisegetsub = data => {

    return new Promise((resolve, reject) => {
        stripe.subscriptions.retrieve(data, (err, subscription) => {
            if (err) {
                throw err;
            }
            resolve(subscription)
        });
    });
}

const promiseupdatepaymentmethod = (data) => {

    return new Promise((resolve, reject) => {

        stripe.paymentMethods.update(data, (err, paymentMethod) => {

            console.log("Updating...")

            if (err) {
                console.log(err)
                reject(err);
            }

            console.log(paymentMethod)


            resolve(paymentMethod)
        });

    })

}



exports.charge = async (req, res) => {

    //console.log(req.body);

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    //
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    let filters = { _id: Id };

    let users;

    try {
        users = await User.findOne(filters);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    const customer = users.stripe_cus_id;

    const plan = req.body.plan;

    const stripetoken = req.body.source;

    const selected_mls = req.body.selected_mls;

    let subscription = null;

    let paymentHistory;

    try {
        paymentHistory = await Payment.findOne({ "user_id": Id, "mls_id": selected_mls });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    if (paymentHistory) {

        try {
            subscription = await promisecreatesubscription({
                customer: customer,
                //plan: plan,
                items: [{ plan: plan }],
                trial_period_days: 0,
                source: stripetoken
            });
        } catch (error) {
            console.log(error)
            res.status(400).send(error);
        }
    }
    else {

        try {
            subscription = await promisecreatesubscription({
                customer: customer,
                //plan: plan,
                items: [{ plan: plan }],
                trial_period_days: 30,
                source: stripetoken
            });
        } catch (error) {
            console.log(error)
            res.status(400).send(error);
        }
    }

    //console.log(subscription);

    if (subscription) {

        let data = {
            user_id: Id,
            mls_id: selected_mls,
            subscription_id: subscription.id,
            subscription_plan: subscription.plan.id,
            subscription_end_date: subscription.current_period_end,
            canceled_at_period_end: subscription.cancel_at_period_end,
            status: subscription.status
        };

        var payment = new Payment(data);
        payment.save(function (err) {
            if (err) res.status(400).send(err);;
            res.send({ 'success': 'payment successful.' });
        })
    }
    else {
        res.status(400).send({ 'error': 'unable to create subscription.' });
    }

};

exports.retrieve_plan = async (req, res) => {
    //console.log(req.params.plan)
    stripe.plans.retrieve(
        req.params.plan,
        function (err, plan) {
            if (err) {
                res.status(500).send(err);

            }
            //console.log(plan);
            res.status(200).send(plan);
        });

};

exports.create_customer = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;

    const Id = req.user._id;

    let filters = { _id: Id };

    let users;

    try {
        users = await User.findOne(filters);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    const selected_mls = req.body.f_mls;

    //console.log(users);

    if (!users.stripe_cus_id) {
        const email = users.email;

        let customer = null;
        try {
            customer = await promisecreatecustomer({
                description: 'Customer for ' + email,
                email: email,
            });
        } catch (error) {
            console.log(error)
            res.status(400).send(error);
        }
        res.status(200).send({ "customer_id": customer.id });
        //console.log(customer);

        if (customer) {

            let query = { _id: Id };
            let update = { stripe_cus_id: customer.id, updated: new Date() };
            //let options = { upsert: true, new: true, setDefaultsOnInsert: true };
            //console.log(update);
            await User.findOneAndUpdate(query, update);

        }
        else {
            res.status(400).send({ 'error': 'unable to create stripe customer' });
        }

    }
    else {

        res.status(200).send({ "customer_id": users.stripe_cus_id });

    }

};

exports.update_customer = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    let query = { _id: Id };
    let update = { stripe_cus_id: customer.id, updated: new Date() };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    console.log(update);
    let updateQuery = User.findOneAndUpdate(query, update);
    console.log(updateQuery);

};

exports.update_payment_details = async (req, res) => {

    var number = req.body.creditCard;
    var exp = req.body.expirationDate.split('/');
    var exp_month = exp[0];
    var exp_year = exp[1];
    var cvc = req.body.cvc;

    //console.log("Updating Full ...");

    //console.log(req.body);

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;

    const Id = req.user._id;

    let filters = { _id: Id };

    let users;

    try {
        users = await User.findOne(filters);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    const customer = users.stripe_cus_id;

    try {
        var response = await promisepaydetails({
            type: 'card',
            card: {
                number: number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc,
            },
        });

        if (response) {

            try {
                var addpayment = await promiseaddpaymentmethod(
                    response.id, { customer: customer });
                var updatepayment = await promiseupdatepaymentmethod(
                    response.id);
                console.log("Updated Pay");
                console.log(updatepayment);
                console.log("Added Pay");
                console.log(addpayment);
                //res.send(addpayment);
                if (addpayment) {
                    try {
                        console.log("Payment ID")
                        console.log(response.id);
                        var responseSub = await promiseupdatesub(
                            req.body.subscription_id,
                            { default_payment_method: addpayment.id });
                        console.log("Response")
                        console.log(responseSub)

                        res.send(responseSub);

                    } catch (e) {
                        console.log(33);
                        res.status(400).send(e.raw.message);
                    }
                }

            } catch (errorr) {
                console.log(22);
                res.status(400).send(errorr.raw.message);
            }

        }

    } catch (error) {
        console.log(11);
        res.status(400).send(error.raw.message);
    }

};

exports.get_subscriptions = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;

    const Id = req.user._id;

    const f_mls = req.body.f_mls;

    try {
        await Payment.findOne({ "user_id": Id, "mls_id": f_mls, status: { $nin: ["cancelled", "canceled", "expired"] } }, null, {
            sort: {
                subscription_end_date: -1 //Sort by Date Added DESC
            }
        }, function (err, payments) {
            //console.log(payments);

            if (err) {
                console.log(err);
                res.status(400).send({ "error": err });
            }

            res.send({ "payments": payments });
        });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

}

exports.get_subscriptions_admin = async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    const Id = req.body.id;

    const f_mls = req.body.f_mls;
    //console.log({ "user_id": Id,"mls_id":f_mls,status: { $nin: [ "cancelled", "expired" ]}  });

    try {
        await Payment.findOne({ "user_id": Id, "mls_id": f_mls, status: { $nin: ["cancelled", "expired"] } }, null, {
            sort: {
                subscription_end_date: -1 //Sort by Date Added DESC
            }
        }, function (err, payments) {
            //console.log(payments);

            if (err) {
                console.log(err);
                res.status(400).send({ "error": err });
            }

            res.send({ "payments": payments });
        });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

}

exports.un_subscribe = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    var subscription = req.params.sub_id;

    let confirmation = null;
    try {
        confirmation = await promisedelsub(subscription);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }

    if (confirmation) {
        let query = { user_id: Id, subscription_id: subscription };
        let update = { status: "cancelled", updated: new Date() };
        try {
            await Payment.findOneAndUpdate(query, update);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        res.status(200).send(confirmation);
    }
    else {
        res.status(400).send(error);
    }

}

exports.un_subscribe_offline = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    var mls_id = req.params.mls_id;
    let user;
    try {
        user = await User.findOne({ "_id": Id });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let newRoleArray = [];

    if (user) {

        user.roles.forEach(function (item) {

            if (item.role == 'member') {
                //console.log('if1');
                let newRoleAssocArray = [];

                //console.log(item.association.length);
                var matched = false;
                if (item.association.length > 0) {
                    //console.log('if2');

                    item.association.forEach(function (item1) {

                        if (JSON.stringify(item1.mls_id) == JSON.stringify(mls_id)) {
                            //console.log('if3');
                            matched = true;
                            newRoleAssocArray.push({
                                "expiry": item1.expiry,
                                "mls_id": item1.mls_id,
                                "payer_type_online": true
                            });
                        }
                        else {
                            //console.log('else1');
                            newRoleAssocArray.push({
                                "expiry": item1.expiry,
                                "mls_id": item1.mls_id,
                                "payer_type_online": item1.payer_type_online
                            });
                        }

                    });
                }

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });

            }
            else {
                //console.log('else3');
                let newRoleAssocArray = [];

                item.association.forEach(function (item1) {
                    newRoleAssocArray.push({
                        "expiry": item1.expiry,
                        "mls_id": item1.mls_id,
                        "payer_type_online": item1.payer_type_online
                    });
                });

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });
            }

        });

        let query = { _id: Id };

        let update = { roles: newRoleArray, updated: new Date() };

        let options = { upsert: true, new: true, setDefaultsOnInsert: true };

        try {
            await User.findOneAndUpdate(query, update, options);
        } catch (error) {
            res.status(400).send(error)
        }

        res.send({ "message": "User updated", newRoleArray: newRoleArray, data: user.getSafe() });
    }
}

exports.get_sub_payment = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    let filters = { _id: Id };

    let users;
    try {
        users = await User.findOne(filters);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    const customer = users.stripe_cus_id;

    var sub_id = req.params.sub_id;

    //console.log(sub.default_payment_method)
    let sub;
    try {
        sub = await promiseretsubscription(sub_id)
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    if (sub.default_payment_method) {
        let card;
        try {
            card = await promisepaydetailsret(sub.default_payment_method);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        var body = {
            'last4': card.card.last4,
            'exp_month': card.card.exp_month,
            'exp_year': card.card.exp_year
        }
        //console.log(body);

        res.send(body)
    }
    else {
        res.send(sub)
    }

}

exports.get_user_all_subscriptions = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    //console.log(Id);
    //let paymentsvar;
    try {
        await Payment.find({ "user_id": Id, status: { $ne: "cancelled" } }, null, {
            sort: {
                subscription_end_date: -1 //Sort by Date Added DESC
            }
        }, function (err, payments) {
            //console.log(payments);

            if (err) {
                console.log(err);
                res.status(400).send({ "error": err });
            }

            //paymentsvar = payments;

            payments.forEach(async (item, index) => {
                //console.log(item.subscription_end_date);
                let subscription;
                //if((item.subscription_end_date < (Date.now() / 1000))){
                //console.log(item);
                try {
                    subscription = await promisegetsub(item.subscription_id);
                    //console.log(subscription);
                } catch (error) {
                    console.log(error);
                }

                if (subscription.current_period_end > (Date.now() / 1000)) {
                    fields = {
                        subscription_end_date: subscription.current_period_end,
                        plan: subscription.plan.id,
                        canceled_at_period_end: subscription.cancel_at_period_end,
                        status: subscription.status,
                        updated: new Date()
                    }
                    // if no subscriptions are found on the accound AND no error occured,
                    // that means that the user is not subscribed for any plan currently.
                } else {
                    fields = {
                        subscription_end_date: (Date.now() / 1000),
                        //plan: "No Plan Active",
                        canceled_at_period_end: false,
                        status: "expired",
                        updated: new Date()
                    }
                }

                let query = { user_id: Id, subscription_id: item.subscription_id };
                //let update = { status: "cancelled", updated: new Date() };
                try {
                    await Payment.findOneAndUpdate(query, fields);
                    //console.log(subscription);
                } catch (error) {
                    console.log(error);
                }
                //console.log(fields);
                //}

            });

            res.send({ "payments": payments });
        });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }


}
