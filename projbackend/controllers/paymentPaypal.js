var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "snk9pry6vzfrnytv",
  publicKey: "srqmshsnc5qxz62y",
  privateKey: "6916908da6a1f82f4db9a0777dbb323e"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(response)
        }
    });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(result)
        }
    });
}