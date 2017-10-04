export function hasUserRoleInRide(userId, ride, userRole) {
    for (var i in ride.rideSections) {
        for (var j in ride.rideSections[i].participants) {
            if (userId == ride.rideSections[i].participants[j].userId) {
                return true;
            }
        }
    }
    return false;
}

export function formatDate(str) {
    var date = new Date(str);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var minute = date.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    var hour = date.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    return day + "." + month + "." + year + " " + hour + ":" + minute;
}

export function resizeBase64Img(base64, info, width, height) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    var myImage = new Image();
    myImage.src = base64;

    var sx = 0;
    var sy = 0;
    var sw = myImage.width;
    var sh = myImage.height;

    if (myImage.width > myImage.height) {
        sx = (myImage.width - myImage.height) / 2;
        //  sw = myImage.height;
    } else if (myImage.width < myImage.height) {
        sy = (myImage.height - myImage.width) / 2;
        // sh = myImage.width;
    }
    // context.drawImage(myImage, 0, 0, myImage.width, myImage.height);
    // context.drawImage(myImage, Math.round(sx), Math.round(0), sw, sh);
    context.drawImage(myImage, sx, sy, myImage.width - sx, myImage.height - sy, 0, 0, width, height);


    return canvas.toDataURL();
    //return base64;
}

export function resizeBase64Img2(base64, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    var deferred = $.Deferred();
    $("<img/>").attr("src", "data:image/gif;base64," + base64).load(function () {
        context.scale(width / this.width, height / this.height);
        context.drawImage(this, 0, 0);
        deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
    });
    return deferred.promise();
}

export function computePrice(ride) {
    var isMiddle=ride.rideSections.length == 2;
    if (isMiddle) {
        return ride.rideSections[1].price + ride.rideSections[0].price;
    } else {
        return ride.rideSections[0].price;
    }
}

export function findDriver(ride){
    for(var i in ride.rideSections){
        for(var j in ride.rideSections[i].participants){
            if(ride.rideSections[i].participants[j].role == 'DRIVER'){
                return ride.rideSections[i].participants[j];
            }
        }
    }
}

export function trimName(name, maxChars) {
    if (!name) {
        return "";
    }
    if (name.length > maxChars) {
        return name.substring(0, maxChars - 1) + " ...";
    }
    return name;
}

export function handleError(dispatch, message, error){
    dispatch({type: 'SET_ERROR', error: message +": "  + error.status, error_code: error.status})
    console.error(error);
}

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function isValidationError(error_messages){
    for(var i in error_messages){
        if(error_messages[i]){
            return true;
        }
    }
    return false;
}
