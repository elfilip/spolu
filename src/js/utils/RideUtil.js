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
