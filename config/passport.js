const SteamStrategy = require('passport-steam').Strategy;

const User = require('../resources/models/user');

module.exports = function(passport){

    passport.use(new SteamStrategy({
        returnURL: 'http://localhost:5000/login/return',
        realm : 'http://localhost:5000/',
        apiKey: '85FC37A2F069E2E1E8F8271B849276C7'
    },
    function(identifier, profile, done){

        User.findOne({steamid: profile._json.steamid}, function(err, user){
            if(!user){

                var newUser = new User({steamid: profile._json.steamid, balance: 0});
                newUser.save(function(err, user){
                    if(err) console.log(err);

                    done(err, newUser);
                });
            }else{
                done(err, user);
            }
        });

    }));

    passport.serializeUser(function(user, done){
        done(null, user.steamid);
    });

    passport.deserializeUser(function(steamid, done){
        User.find({steamid: steamid}, function(err, user){
            done(err, user);
        });
    });

}