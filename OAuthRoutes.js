const querystring = require('querystring');
const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved
const body = urlencoded({ extended: false });
module.exports = (app, provider) => {
  const {
    constructor: {
      errors: { SessionNotFound },
    },
  } = provider;

  function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set('Cache-Control', 'no-cache, no-store');
    next();
  }
  

  app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res);
      const { uid, prompt, params, session, interaction } =details
      const client = await provider.Client.find(params.client_id);

      console.log('\n\n\nhellothere\n', { uid, prompt, params, session, client }, '\n\n\n');

      switch (prompt.name) {
        case 'login': {
           
      return res.render('login', {
        client,
        uid,
        title: 'Sign-in',
        params: querystring.stringify(params, ',<br/>', ' = ', {
          encodeURIComponent: value => value,
        }),
        interaction: querystring.stringify(
          interaction,
          ',<br/>',
          ' = ',
          {
            encodeURIComponent: value => value,
          },
        ),
      });
        }
        case 'consent': {
          return res.send('interaction');
        }
        default:
          return undefined;
      }

     
    } catch (err) {
      return next(err);
    }
  });

  app.post('/interaction/:uid/login', setNoCache,body, async (req, res, next) => {
    console.log('/interaction/:uid/login');
    try {
      const details = await provider.interactionDetails(req, res);
      console.log(details);
      console.log('find account by login');
      // const account = await Account.findByLogin(req.body.login);

      const result = {
        select_account: {}, // make sure its skipped by the interaction policy since we just logged in
        login: {
          account: 'daniel@open.gov.sg',
          remember: true,
        },
        // consent was given by the user to the client for this session
        consent: {
          rejectedScopes: [], // array of strings, scope names the end-user has not granted
          rejectedClaims: [], // array of strings, claim names the end-user has not granted
        },
      };

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err instanceof SessionNotFound) {
      console.log('\n\n\nhellothere\n', 'SessionNotFound', '\n\n\n');

      // handle interaction expired / session not found error
    }
    next(err);
  });
};
