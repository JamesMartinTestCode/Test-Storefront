const User = require("./user");
const gaCustomers = {};
const gaAdmins = {};
var gnThreshold = 5;
var gsCouponAmount = 10;

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
        response.couponamount = gsCouponAmount;
    }

    if (currentUser.sPassword !== data.password) {
        response.sMessage = "Password did not match.";
        return (JSON.stringify(response));
    }

    response.user = currentUser;
    console.log("user found");
    return (JSON.stringify(response));
}

function NewUser(data) {
    let response = { user: {}};
    switch (data.usertype) {
        case "admin":
            response.user = gaAdmins[data.username] = new User.Admin(data);
            response.threshold = gnThreshold;
            response.couponamount = gsCouponAmount;
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
    gsCouponAmount = data.couponamount;
    var result = {sMessage : "success"};
    return (JSON.stringify(result));
}

function GetReport(data) {
    var Customers = [];

    for(customer in gaCustomers) {
        Customers.push({            
            "username": customer.sUsername,
            "transactions": customer.nTransactions,
            "couponsearned": customer.nCouponsEarned
    });
    }
    return (JSON.stringify(Customers));
}

function MakeTransaction(data) {
    gaCustomers[data.username].nTransactions++;
    const currentUser = gaCustomers[data.username];
    var result = {sMessage : "Thank you for your transaction."};
    if (currentUser.nTransactions >= gnThreshold && !currentUser.bHasCoupon) {
        currentUser.bHasCoupon = true;
        currentUser.nCouponsEarned++;
        result.sMessage = "You earned a coupon.";
    }
    return (JSON.stringify(result));
}

module.exports = {
    "SignIn": SignIn,
    "NewUser": NewUser,
    "SetCouponThreshold": SetCouponThreshold,
    "GetReport": GetReport,
    "MakeTransaction": MakeTransaction
}