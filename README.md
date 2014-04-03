## node-pop

node-pop is a Node.js worker that parallelizes processing a function that is io bound.

### An example node-pop worker.

    mkdir worker
    cd worker
    touch package.json
    touch worker.js
    touch config.js
    touch job.js
    touch log.js
    
#### Package

Edit your package.json file like this:

    {
      "name": "worker",
      "version": "1.0.0",
      "private": false,
      "engines": {
         "node": "*",
         "npm":  "*"
      },
      "dependencies": {
        "node-pop" : "1.2.0"
      }
    }

Then install node-pop.

    $ npm install -d

#### Worker

Edit worker.js to someting like this:

    var nodePop = require('node-pop');
    var config = require('./config.js');
    var job = require('./job.js');
    var log = require('./log.js');

    job.init({
      nodePop: nodePop
    });

    nodePop.init({

      config: config,
      job: job,
      log: log

    }, function (err) {

      if (err) {
        log(err);
      } else {
        nodePop.wake();  
      }

    });

#### Config

Edit config.js to someting like this:

    module.exports = {
      redis: {
        client: false,
        spop: 'my-node-pop-set',
        host: '127.0.0.1',
        port: '6379',
        pass: 'password',
        db: 1
      },
      moderate: {
        interval: 1000,
        limit: 100,
        ttl: (1000 * 30)
      }
    };

#### Job

Edit job.js to someting like this:

    module.exports = {
      init: function (params) {
        var that = this;
        var nodePop = that.nodePop;
      },
      process: function (mem) {
        var that = this;
        var nodePop = that.nodePop;
      }
    };

#### Log

Edit log.js to someting like this:

    module.exports = function (mes) {
      console.log(mes);
    };

#### Try it out.

Now that everything is in place you can start your worker.

    $ node worker.js

### Flusing out your job.

Now that you have a node-pop worker setup you will want to actually have some custom logic. In the example below the job will take the member, wait 2 seconds, queue the next job, and then inform node-pop that it is one so node-pop can move onto the next member. Obviously this is a contrived example.

    module.exports = {
    
      init: function (params) {
        var that = this;
        var nodePop = params.nodePop;
        that.nodePop = nodePop
      },
      
      process: function (mem) {
      
        var that = this;
        var nodePop = that.nodePop;
      
        setTimeout(function () {
        
          console.log('PROCESSED * mem -> ' + mem);
          
          nodePop.queue({
            set: 'next-node-pop-set',
            mem: mem
          }, function (err) {
            if (err) { console.log(err); }
            nodePop.done(mem);
          });
          
        }, (1000 * 2))
        
      }
    };

    
