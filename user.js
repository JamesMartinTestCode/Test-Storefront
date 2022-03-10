class Customer {
    constructor(data) {
        this.sFirstName = data.firstname;
        this.sLastName = data.lastname;
        this.sUsername = data.username;
        this.sPassword = data.password;
        this.sUserType = data.usertype;
        this.nTransactions = 0;
        this.nTransactionsTowardsNextCoupon = 0;
        this.nCouponsEarned = 0;
        this.nCouponAmount = 0;
        this.bHasCoupon = false;
    }
}

class Admin {
    constructor(data) {
        this.sFirstName = data.firstname;
        this.sLastName = data.lastname;
        this.sUsername = data.username;
        this.sPassword = data.password;
        this.sUserType = data.usertype;
    }
}

module.exports = {
    "Customer":Customer,
    "Admin": Admin
};