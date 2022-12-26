
function errorCallback(error) {
    console.log(JSON.stringify(error))
}

function cancelCallback() {
    console.log("Payment cancelled")
}

function completeCallback(resultIndicator, sessionVersion) {
    console.log(sessionVersion)
}
