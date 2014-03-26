node-pop
========

node-pop is a Node.js worker that parallelizes processing a function that is io bound.


### Install

    npm install node-pop
    
### Require

    var nodePop = require('node-pop');

### Init

    var nodePop = require('node-pop');

    nodePop.init({

      config: {
        redis: {
          client: false,
          set: 'my-redis-set',
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

      worker: function (mem, done) {
        // process your mem
        // call done() when done
        done();
      },

      log: function (mes) {
        console.log(mes);
      },

    }, function (err) {

      if (err) {
        console.log(err);
      }

    });

#### Redis

This is the config for redis. If you already have a connection pass it as client. Otherwise pass in the other params.

#### Moderate

Moderate is what parallelizes everything. Interval is how often it should check the set. Noramlly this just needs to be a second because once scard is greater than 0 it will manage calling itself until the set is empty. TTL is how long node-pop should expect your worker to take in case it fails and never calls done node-pop can continue working.

#### Worker

The work returns whatever was spoped. This is where you do you custom processing. When done make sure to call the callback done so that node-pop knows it can go get another.

#### Log

Pass in console.log or whatever logger you want if you want to check the status of node-pop such as hom many are currently processing, the current limit, and how many members are in the set.

### Wake

And now it's time to wake node-pop.

    nodePop.wake();
