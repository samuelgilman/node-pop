## node-pop

node-pop is a Node.js worker that parallelizes processing a function that is io bound.

### Install

    npm install node-pop
    
### Require

    var nodePop = require('node-pop');

### Run

    var nodePop = require('node-pop');

    nodePop.init({

      config: {
        
        redis: {
          client: false,
          spop: 'set-to-spop',
          host: '127.0.0.1',
          port: '6379',
          pass: 'password',
          db: 1
        },
        
        moderate: {
          interval: 1000,
          limit: 100,
          ttl: 100
        },
        
      },

      worker: function (mem) {
        // custom logic
      },

      log: function (mes) {
        console.log(mes);
      },

    }, function (err) {

      if (err) {
        console.log(err);
      } else {
        nodePop.wake();  
      }

    });

#### Redis

This is the config for redis. If you already have a connection pass it as client. Otherwise pass in host, port, pass, and db. spop is the set node-pop will spop from.

    redis: {
      client: false, // pass in connection
      spop: 'set-to-spop', // set to spop
      host: '127.0.0.1', // host if no client
      port: '6379', // port if not client
      pass: 'password', // password if not client
      db: 1 // db number if no client
    }


#### Moderate

Moderate is what parallelizes everything. Interval is how often it should check the set. Noramlly this just needs to be a second because once scard is greater than 0 it will manage calling itself until the set is empty. TTL is how long node-pop should expect your worker to take in case it fails and never calls done node-pop can continue working.

    moderate: {
      interval: 1000, // how often to check for nem members
      limit: 100, // how many to process in parallel
      ttl: 100 // how long should node-pop wait
    }

#### Worker

The work returns whatever was spoped such as an id. This is where you do you custom processing. When done make sure to call ddone so that node-pop can clear what you just processed. 

    worker: function (mem) {
      // process mem with custom logic
      // call done to clear the mem from nodePop 
      nodePop.done(mem);
    }

#### Queue

Queue new jobs while processing members.

    nodePop.queue({
      set: 'redis-set',
      mem: mem
    }, function (err) {
      if (err) { console.log(err) ;}
    });

#### Log

Log returns the current status of nodePop and moderate such as active and processing memebers.

    log: function (mes) {
      console.log(mes);
    }
