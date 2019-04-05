const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const si = require('systeminformation');
const Osu = require('node-os-utils');
const Os = require('os');
server.listen(9000,()=> {
  console.log("Monitoring socket server is running and listening on port 8002")
});
app.get('/', function(req, res, next){
  res.send('ok');
})
io.on('connection', function(client){
  getInfo_CPU_RAM_USAGE(client);
  getInfoStatic(client);
});
getInfo_CPU_RAM_USAGE = async(client) => {
  try{
    let ramInfo = {
      total: Os.totalmem(),
      free: Os.freemem(),
      used: (100-((Os.freemem()/Os.totalmem())*100)).toFixed(1)
    }
    let [ memInfo, cpuUsage] = await Promise.all([
      ramInfo,
      Osu.cpu.usage(),
    ]);
    let ressources = {
        memInfo,
        cpuUsage,
    }
    setTimeout(() => {
      getInfo_CPU_RAM_USAGE(client)
    }, 1500);
    client.emit('dynamicData', ressources);
  }catch(e){
    console.log(e)
  }
};

getInfoStatic = async(client) => {
  try{
    let [cpuInfo,os, diskInfo] = await Promise.all([
      si.cpu(),
      si.osInfo(),
      si.fsSize(),
    ]);

    let ressources = {
        cpuInfo,
        os,
        diskInfo
    }
    client.emit('staticData', ressources);
  }catch(e){
    console.log(e)
  }
};



