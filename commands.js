const User = require("./user");
const gaCustomers = {};
const gaAdmins = {};
var gnThreshold = 5;
var gnCouponAmount = 10;

function SignIn(data) {
    let currentUser = gaCustomers[data.username];
    const response = {sMessage : ""};

    if (currentUser === undefined) {

        currentUser = gaAdmins[data.username];

        if (currentUser === undefined) {
            response.sMessage = "no user with that username";
            return (JSON.stringify(response));
        }
        response.threshold = gnThreshold;
        response.couponamount = gnCouponAmount;
    }

    if (currentUser.sPassword !== data.password) {
        response.sMessage = "Password did not match.";
        return (JSON.stringify(response));
    }

    response.user = currentUser;
    return (JSON.stringify(response));
}

function NewUser(data) {
    let response = { user: {}};
    switch (data.usertype) {
        case "admin":
            response.user = gaAdmins[data.username] = new User.Admin(data);
            response.threshold = gnThreshold;
            response.couponamount = gnCouponAmount;
            break;
        case "customer":
            response.user = gaCustomers[data.username] = new User.Customer(data);
            break;
        default:
            response.sMessage = "Failed to add new user.";
    }
    return (JSON.stringify(response));
}

function SetCouponThreshold(data) {
    gnThreshold = data.threshold;
    gnCouponAmount = data.couponamount;
    var result = {sMessage : "success"};
    return (JSON.stringify(result));
}

function GetReport(data) {
    var Customers = [];
    for(user in gaCustomers) {
        var customer = gaCustomers[user];
        Customers.push({            
            "username": customer.sUsername,
            "transactions": customer.nTransactions,
            "transactionstowardsnextcoupon": customer.nTransactionsTowardsNextCoupon,
            "couponsearned": customer.nCouponsEarned,
            "couponamount": customer.nCouponAmount
        });
    }
    return (JSON.stringify(Customers));
}

function MakeTransaction(data) {
    const currentUser = gaCustomers[data.username];
    var result = {sMessage : "Thank you for your transaction."};
    
    currentUser.nTransactions++;

    if (currentUser.nTransactionsTowardsNextCoupon < gnThreshold) {
        currentUser.nTransactionsTowardsNextCoupon++;
    }

    if (data.usecoupon === 1) {
        currentUser.bHasCoupon = false;
        currentUser.nTransactionsTowardsNextCoupon = 0;
    }

    if (currentUser.nTransactionsTowardsNextCoupon >= gnThreshold && !currentUser.bHasCoupon) {
        currentUser.bHasCoupon = true;
        currentUser.nCouponsEarned++;
        result.sMessage = "You earned a coupon worth" + gnCouponAmount + "% off.";
    }

    result.nCouponAmount = gnCouponAmount;
    result.bHasCoupon = currentUser.bHasCoupon;
    result.nTransactions = currentUser.nTransactions;
    result.nTransactionsTowardsNextCoupon = currentUser.nTransactionsTowardsNextCoupon;
    return (JSON.stringify(result));
}

module.exports = {
    "SignIn": SignIn,
    "NewUser": NewUser,
    "SetCouponThreshold": SetCouponThreshold,
    "GetReport": GetReport,
    "MakeTransaction": MakeTransaction
}