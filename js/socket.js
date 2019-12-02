var output;
var addressForm;
var messageForm;
var sendButton;
var connectButton;
var disconnectButton;

function init() {
    output = document.getElementById("output");
    sendButton = document.getElementById("send");
    messageForm = document.getElementById("messageForm");
    connectButton = document.getElementById("connect");
    disconnectButton = document.getElementById("disconnectbtn");
    disconnectButton.disabled = true
        // testWebSocket();
    addressForm = document.getElementById('addressFom');
    addressForm.addEventListener('submit', event => {
        event.preventDefault();
        testWebSocket();
    })
    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        getValues();
    })
}

function getValues() {
    var topic = document.getElementById("topic").value
    var stream_id = document.getElementById("streamId").value
    var subscribe = document.getElementById("subscribe").value
    var message = document.getElementById("message").value

    message = JSON.parse(message);
    message["topic"] = topic;
    message["streamId"] = stream_id;
    message["subscribe"] = subscribe;

    doSend(JSON.stringify(message))
}

function testWebSocket() {
    var address = document.getElementById("address").value;
    websocket = new WebSocket(address);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
    writeToScreen("CONNECTED");
    sendButton.disabled = false
    connectButton.disabled = true
    disconnectButton.disabled = false
}

function onClose(evt) {
    writeToScreen("DISCONNECTED");
    sendButton.disabled = true
    connectButton.disabled = false
    disconnectButton.disabled = true
}

function onMessage(evt) {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
    //websocket.close();
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeToScreen("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

function closeCon() {
    console.log('closing...')
    websocket.close();
}

function clearLogs() {
    console.log('clearing...')
    output.innerHTML = ''
}

window.addEventListener("load", init, false);