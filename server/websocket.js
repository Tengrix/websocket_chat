const ws = require('ws');

const wss = new ws.Server({
    port: 7000,
}, () => {
    console.log('Server has launched')
})

wss.on('connection', function connection(ws) {
    ws.on('message', function (mssg) {
        mssg = JSON.parse(mssg)
        switch (mssg.event) {
            case 'message':
                broadcastMessage(mssg)
                break;
            case 'connection':
                broadcastMessage(mssg)
                break;
        }
    })
})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}