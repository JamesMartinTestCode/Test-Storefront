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

    if (response.user.sUserType === "admin") {
        AdminElem.style.display = "block";
        ExistingUserElem.style.display = "none";
        CouponThresholdElem.value = response.threshold;
        CouponAmountElem.value = response.couponamount;
    }
    else if (response.user.sUserType === "customer") {
        CustomerElem.style.display = "block";
        ExistingUserElem.style.display = "none";
    }
    currentUser = response;

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
            console.log(XHR.responseText);
        }};

    var data = {
        "command": "SetCouponThreshold",
        "threshold": CouponThresholdElem.value
    };

    XHR.send(JSON.stringify(data));

};

function MakeTransaction() {

    let TransactionsElem = document.getElementById("transactions");
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "http://localhost:3000/");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
            JSON.parse(XHR.responseText)
            console.log(XHR.responseText);
            TransactionsElem.value++;
        }};

    var data = {
        "command": "MakeTransaction",
        "username": currentUser.sUsername
    };

    XHR.send(JSON.stringify(data));

};

function HasCoupon() {
    let CouponElem = document.getElementById("coupon");
    if (currentUser.bHasCoupon) {
        CouponElem.value = "You have a coupon. Would you like to use it?";
    }
    else {
        CouponElem.value = "You have not earned a coupon yet.";
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
            console.log(XHR.responseText);
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
            console.log(XHR.responseText);
        }};

    var data = {
        "command": "SetThreshold",
        "threshold": CouponThresholdElem.value,
        "couponamount": CouponAmountElem.value
    };

    XHR.send(JSON.stringify(data));
};
