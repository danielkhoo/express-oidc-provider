# Notes

### Flow

#### 1. User on Client clicks "Connect"

#### 2. Client redirects to Auth Provider's OAuth endpoint

`/auth?client_id=foo&response_type=code&scope=openid`

This will be a version of our email login flow. When the user completes,
they will be redirect to the callback url Client provides aka

#### 3.  Redirect to callback
`.../callback?code=pdfiUMgSGXLOp3oOFts3e3DOvYuk6qt0Zr1Vo9idqv4`



#### 4.  Back Channel Client -> Auth Provider

Client will then take that code and back channel a request to our
token endpoint to exchange the auth code for a token
`/token` with formurlencoded:
- code: `pdfiUMgSGXLOp3oOFts3e3DOvYuk6qt0Zr1Vo9idqv4`
- client_id: `foo`
- grant_type: `authorization_code`
- client_secret: `bar`


# QUESTIONS
- MySQL / Redis?
- Crypto? JWKS?
- Keystore
- Cookie Keys
- The other 500 config options