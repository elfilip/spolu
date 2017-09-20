export function hasUserRoleInRide(userId, ride, userRole) {
    for (var i in ride.rideSections) {
        for (var j in ride.rideSections[i].participants) {
            if (userId == ride.rideSections[i].participants[j].userId && ride.rideSections[i].participants[j].role == userRole) {
                return true;
            }
        }
    }
    return false;
}

export function formatDate(str) {
    var date=new Date(str);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var minute=date.getMinutes();
    if(minute < 10){
        minute = '0' + minute;
    }
    var hour=date.getHours();
    if(hour < 10){
        hour = '0' + hour;
    }
    return day+"."+month+"."+year+" "+hour+ ":"+minute;
}
