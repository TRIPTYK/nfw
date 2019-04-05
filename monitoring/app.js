const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const si = require('systeminformation');
const Osu = require('node-os-utils');
const Os = require('os');
const port = require('../')
server.listen(9000,()=> {
  console.log("Monitoring socket server is running and listening on port 8002")
});
app.get('/', function(req, res, next){
  res.send('ok');
})
io.on('connection', function(client){
  setInterval(async() => {
    setTimeout(async() => {
      getInfo().then((data) => {
        client.emit('data',data)
      });
    }, 1000);
    },1000)
});

getInfo = async() => {
  try{
    let ramInfo = {
      total: Os.totalmem(),
      free: Os.freemem(),
      used: (100-((Os.freemem()/Os.totalmem())*100)).toFixed(1)
    }

    let [os, cpuUsage, cpuFree, driveInfo] = await Promise.all([
        Osu.os.oos(),
        Osu.cpu.usage(),
        Osu.cpu.free(),
        Osu.drive.info(),
    ]);

    let ressources = {
        os,
        cpuCount: Osu.cpu.count(),
        cpuUsage,
        cpuFree,
        driveInfo,
        ramInfo
    }
    return ressources;
  }catch(e){
    console.log(e)
  }
};