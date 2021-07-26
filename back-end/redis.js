const config = require("config");

const Redis = require('ioredis');

let isRedisCluster = config.get("isRedisCluster");

console.log(isRedisCluster);

if(isRedisCluster){
    const redisoptions = {
        host:config.get("Redis_HOST"),
        port:config.get("Redis_PORT"),
    }
    
    const rclient = new Redis.Cluster([redisoptions]);
    
    rclient.on('connect', function (err, response) {
        //'use strict';
        if(err){
            console.log('Redis client Error ' + err);
            process.exit(1);
        }
        console.log('Redis cluster client Connected!');
    });
    
    module.exports = rclient;
}
else{
    const redisoptions = {
        host:config.get("Redis_HOST"),
        port:config.get("Redis_PORT"),
    }

    console.log(redisoptions);
    
    const rclient = new Redis(redisoptions);
    
    rclient.on('connect', function (err, response) {
        //'use strict';
        if(err){
            console.log('Redis client Error ' + err);
            process.exit(1);
        }
        console.log('Redis client Connected!');
    });
    
    module.exports = rclient;
}


