const fs = require('fs');
const https = require('https');
// const url = require('url');
const path = require('path');
// const helmet = require('helmet')
const express = require('express');
const routes = require('./OAuthRoutes');
const Provider = require('oidc-provider');
const PORT = 3000;
const ISSUER = `http://localhost:${PORT}`
const adapter = require('./sequelize');
const app = express();


(async () => {
// UI
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
  await adapter.connect();

  //Routes of our main app
  app.get('/', (req, res) => res.send('Hello World!'));
  app.get('/callback', async (req, res) => {
  console.log(req.query);

    const code = req.query.code || null

    console.log(code);

    return res.send('Hello callback!')
  });
  

  //Routes of the OAuth Flow
  const provider = new Provider(ISSUER, { 
    adapter,
    clients: [{
       client_id: 'foo',
     client_secret: 'bar',
     grant_types: ['authorization_code'],
     redirect_uris: ['http://localhost:3000/callback'],
    }]
   // https://localhost:3000/auth?client_id=foo&response_type=code&scope=openid
    
  });
  

  const { invalidate: orig } = provider.Client.Schema.prototype;
provider.Client.Schema.prototype.invalidate = function invalidate(message, code) {
  if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
    return;
  }

  orig.call(this, message);
};
  
  routes(app, provider);
  app.use(provider.callback);
  


  app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
  // express listen
  // if (process.env.NODE_ENV === 'production') {
  //   app.listen(PORT, () => console.log(`Example app listening at https://localhost:${PORT}`));
  // } else {
  //   const certOptions = {
  //     key: fs.readFileSync(path.resolve('server.key')),
  //     cert: fs.readFileSync(path.resolve('server.crt')),
  //   };
  //   https.createServer(certOptions, app).listen(PORT, () => console.log(`Example app listening at https://localhost:${PORT}`));
  // }
  
  

})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});