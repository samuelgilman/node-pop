module.exports = {

  init: function (params, app, next) {

    var that = this;
    var config = params.config;
    var log = params.log;
    var worker = params.worker;
 
    app.log = log;
    app.worker = worker;
    app.config = config;
    that.app = app;    

    that.initModerate();

    that.initRedis(function (err) {
      next(err);
    });

  },

  initModerate: function () {

    var that = this;
    var app = that.app;
    var moderate = require('moderate');
    
    app.moderate = moderate;

  },

  initRedis: function (next) {

    var that = this;
    var app = that.app;
    var config = app.config;
    var redisConfig = config.redis;
    var host = redisConfig.host;
    var port = redisConfig.port;
    var pass = redisConfig.pass;
    var db = redisConfig.db;
    var redis = require('redis');
    var client = redis.createClient(port, host, {
      no_ready_check: true
    });

    that.authRedis({

      client: client,
      pass: pass

    }, function (err) {

      if (err) {

        next(err);  

      } else {
      
        console.log('redis authed')

        that.selectRedisDb({

          client: client,
          db: db

        }, function (err) {

          if (!err) {
            console.log('redis selected ' + db);
          }
        
          that.app.redis = client;
          next(err);

        });

      }

    });

  },

  authRedis: function (params, next) {

    var that = this;
    var client = params.client;
    var pass = params.pass;

    client.auth(pass, function (err) {
      next(err, client);
    });

  },

  selectRedisDb: function (params, next) {

    var that = this;
    var client = params.client;
    var db = params.db;

    client.select(db, function (err) {
      next(err, client);
    });

  }

};
