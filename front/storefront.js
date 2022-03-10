let currentUser = {};

function ChangeUserType() {
    let ExistElem = document.getElementById("exist");
    let SigninElem = document.getElementById("signin");
    let NewUserElem = document.getElementById("newuser");

    switch(ExistElem.value) {
        case "none":
            SigninElem.style.display = "none";
            NewUserElem.style.display = "none";
            break;
        case "exist":
            SigninElem.style.display = "block";
            NewUserElem.style.display = "none";
            break;
        case "new":
            SigninElem.style.display = "none";
            NewUserElem.style.display = "block";
            break;
    }
};

function SignIn() {
    
    const XHR = new XMLHttpRequest();
    let ExistingUsernameElem = document.getElementById("existingusername");
    let ExistingPasswordElem = document.getElementById("existingpassword");

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            var response = JSON.parse(XHR.responseText);
            UserSignedIn(response);
        }
    };

    var data = {
        "command": "SignIn",
        "username": ExistingUsernameElem.value,
        "password": ExistingPasswordElem.value
    };

    XHR.send(JSON.stringify(data));
};

function NewUser() {
    
    let NewFirstnameElem = document.getElementById("newfirstname");
    let NewLastnameElem =  document.getElementById("newlastname");
    let NewUsernameElem = document.getElementById("newusername");
    let NewPasswordElem = document.getElementById("newpassword");
    let NewUserTypeElem = document.getElementById("newusertype");
    
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            var response = JSON.parse(XHR.responseText);
            UserSignedIn(response);
        }
    };

    var data = {
        "command": "NewUser",
        "firstname": NewFirstnameElem.value,
        "lastname": NewLastnameElem.value,
        "username": NewUsernameElem.value,
        "password": NewPasswordElem.value,
        "usertype": NewUserTypeElem.value
    };

    XHR.send(JSON.stringify(data));
};

function UserSignedIn(response) {
    let ExistingUserElem = document.getElementById("existinguser");
    let CustomerElem = document.getElementById("customer");
    let AdminElem = document.getElementById("admin");
    let CouponThresholdElem = document.getElementById("couponthreshold");
    let CouponAmountElem =  document.getElementById("couponamount");
    let TransactionsElem = document.getElementById("transactions");

    if (response.user.sUserType === "admin") {
        AdminElem.style.display = "block";
        ExistingUserElem.style.display = "none";
        CouponThresholdElem.value = response.threshold;
        CouponAmountElem.value = response.couponamount;
    }
    else if (response.user.sUserType === "customer") {
        CustomerElem.style.display = "block";
        ExistingUserElem.style.display = "none";
        TransactionsElem.value = response.user.nTransactions;
    }
    currentUser = response.user;

};

function SetCouponThreshold() {
    let CouponThresholdElem = document.getElementById("couponthreshold");
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            JSON.parse(XHR.responseText)
        }};

    var data = {
        "command": "SetCouponThreshold",
        "threshold": CouponThresholdElem.value
    };

    XHR.send(JSON.stringify(data));

};

function MakeTransaction(useCoupon) {
    let TransactionsElem = document.getElementById("transactions");
    let CouponElem = document.getElementById("coupon");
    let UseCouponElem = document.getElementById("usecoupon");
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            var response = JSON.parse(XHR.responseText);

            currentUser.nTransactionsTowardsNextCoupon = response.nTransactionsTowardsNextCoupon;
            currentUser.nTransactions = response.nTransactions;

            TransactionsElem.innerText = "You are " + response.nTransactionsTowardsNextCoupon + " transactions towards your next coupon.";

            currentUser.bHasCoupon = response.bHasCoupon;
            currentUser.nCouponAmount = response.nCouponAmount;

            if (response.bHasCoupon) {
                HasCoupon();
            }

            if (useCoupon === 1) {
                CouponElem.innerText = "";
                UseCouponElem.style.display = "none";
            }
        }};

    var data = {
        "command": "MakeTransaction",
        "username": currentUser.sUsername,
        "usecoupon": useCoupon
    };

    XHR.send(JSON.stringify(data));

};

function HasCoupon() {
    let CouponElem = document.getElementById("coupon");
    let UseCouponElem = document.getElementById("usecoupon");
    if (currentUser.bHasCoupon) {
        CouponElem.innerText = "You have a coupon worth " + currentUser.nCouponAmount + ". Would you like to use it?";
        UseCouponElem.style.display = "block";
    }
    else {
        CouponElem.innerText = "You have not earned a coupon yet.";
        UseCouponElem.style.display = "none";
    }
};

function GetReport() {
    let ReportElem = document.getElementById("report");
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            JSON.parse(XHR.responseText)
            ReportElem.innerHTML = XHR.responseText;
        }};

    var data = {
        "command": "GetReport"
    };

    XHR.send(JSON.stringify(data));
};

function CouponThreshold() {
    let CouponThresholdElem = document.getElementById("couponthreshold");
    let CouponAmountElem = document.getElementById("couponamount");
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            JSON.parse(XHR.responseText)
        }};

    var data = {
        "command": "SetThreshold",
        "threshold": CouponThresholdElem.value,
        "couponamount": CouponAmountElem.value
    };

    XHR.send(JSON.stringify(data));
};
