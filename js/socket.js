let output;
let addressForm;
let messageForm;
let sendButton;
let connectButton;
let disconnectButton;
let websocket;

function init() {
    output = document.getElementById("output");
    sendButton = document.getElementById("send");
    messageForm = document.getElementById("messageForm");
    connectButton = document.getElementById("connectBtn");
    disconnectButton = document.getElementById("disconnectbtn");
    disconnectButton.disabled = true
    addressForm = document.getElementById('addressFom');
    connectButton.addEventListener('click', event => {
        event.preventDefault();
        initWebSocket();
    });
    disconnectButton.addEventListener('click', event => {
        event.preventDefault();
        closeCon();
    })
    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        getValues();
    })
}

function getValues() {
    let topic = document.getElementById("topic").value
    let stream_id = document.getElementById("streamId").value
    let subscribe = document.getElementById("subscribe").value
    let message = document.getElementById("message").value

    message = JSON.parse(message);
    message["topic"] = topic;
    message["streamId"] = stream_id;
    message["subscribe"] = subscribe;

    doSend(JSON.stringify(message))
}

function initWebSocket() {
    console.log("init called");
    let address = document.getElementById("address").value;
    websocket = new WebSocket(address);
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
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
    let pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
    scrollToBottom();
}

function closeCon() {
    console.log('closing...')
    websocket.close();
}

function clearLogs() {
    console.log('clearing...')
    output.innerHTML = ''
}

function scrollToBottom() {
    let messageContainer = document.getElementById('output');
    messageContainer.scrollTop = messageContainer.scrollHeight
}

window.addEventListener("load", init, false);
