module.exports = {

  init: function (params, next) {

    var that = this;
    var path = require('path');
    var env = require(path.resolve(__dirname, 'env'));

    env.init(params, that, function (err) {
      next(err);
    });

  },

  wake: function () {

    var that = this;
    var config = that.config;
    var moderateConfig = config.moderate;
    var interval = moderateConfig.interval;

    that.run();

    setTimeout(function () {
      that.wake();
    }, interval);

  },

  run: function (next) {

    var that = this;

    that.ready(function (ready) {

      if (ready) {

        that.spop(function (mem) {
    
          if (mem) {
  
            that.moderateAdd(mem);           

            that.worker(mem, function (mem) {
              that.moderateDel(mem)
            }, function (params, next) {
              that.queue();
            });

          }

        });

      }

    });

  },

  ready: function (next) {

    var that = this;
    var log = that.log;
    var redis = that.redis;
    var moderate = that.moderate;
    var config = that.config;
    var moderateConfig = config.moderate;
    var limit = moderateConfig.limit;

    moderate.active(function (active) {
      log('MODERATE_ACTIVE * active -> ' + active + ' * limit -> ' + limit);
      next(active < limit)
    });

  },

  spop: function (next) {

    var that = this;
    var log = that.log;
    var redis = that.redis;
    var config = that.config;
    var redisConfig = config.redis
    var set = redisConfig.spop;

    redis.scard(set, function (err, scard) {

      if (err) {

        next('REDIS_ERROR * -> ' + err);

      } else if (!scard) {
        
        log('REDIS_SCARD * scard -> '  + scard);

      } else {

        log('REDIS_SCARD * scard -> '  + scard);

        redis.spop(set, function (err, mem) {

          if (err) {

            next('REDIS_ERROR err -> ' + err);

          } else {

            log('REDIS_SPOP * set -> ' + set + ' * mem -> ' + mem);
            next(mem);

          }

        });

      }

    });

  },

  moderateAdd: function (mem) {

    var that = this;
    var log = that.log;
    var moderate = that.moderate;
    var config = that.config;
    var moderateConfig = config.moderate;
    var ttl = moderateConfig.ttl;
  
    log('MODERATE_ADD * mem -> ' + mem + ' * ttl -> ' + ttl);

    moderate.add({
      mem: mem,
      ex: ttl 
    });

    that.run();

  },

  moderateDel: function (mem) {

    var that = this;
    var log = that.log;
    var moderate = that.moderate;

    moderate.del(mem);
    log('MODERATE_DEL * mem -> ' + mem);

  },

  queue: function (params, next) {
    
    var that = this;
    var redis = that.redis;
    var set = params.set;
    var mem = params.mem;
    
    redis.sadd(set, mem, function (err) {
      next(err);
    });

  }

};
