const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const TradeOfferManager = require('steam-tradeoffer-manager');

const SteamCommunity = require('steamcommunity');
const community = new SteamCommunity();
    
const client = new SteamUser();

const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en'
});

const logOnOptions = {
    accountName: 'rudius_hoobler',
    password: 'Morotskaka1',
    twoFactorCode: SteamTotp.generateAuthCode('Nnz1DTj++uyCbbuHFcYl1W7RnfQ=')
};



client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('Logged into steam');
});

client.on('webSession', (sessionid, cookies) => {
    console.log('Started listening');

    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(1000, 'Nnz1DTj++uyCbbuHFcYl1W7RnfQ=');
});

module.exports = manager;
