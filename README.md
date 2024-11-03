# New Bonus+ Calculation Tool
A redesign of the current Bonus+ Frontend

## Current Stack 
 - React 
 - FastAPI

## Setup    
 1. Clone the mono repo
 2. use 
    `npm login --scope=@eon-ui --registry=https://repo.eon-cds.de/artifactory/api/npm/eon-ui-local/` to get the credentials for eon ui (open given link with ctrl + left click in the terminal)
 3. use `yarn install`
 4. after the installation use `cd frontend` and `yarn start` for starting up the frontend
 5. in a second terminal use `cd middleware` 
 6. Make sure to populate the .env file in the middleware root folder, - ask Liu or Silas
 7. use `npx prisma generate` and then `npx prisma migrate deploy` to setup the backend ORM and db
 8. use `yarn start` again for starting up the backend, make sure you have the correct snowflake credentials <a name="step5"/>
 
## Common Errors
 - Prisma - Unable to get local issuer certificate
  - set the env variable `export NODE_TLS_REJECT_UNAUTHORIZED=0` or `$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"` for powershell
 - ERR-OSSL-EVP-UNSUPPORTED
   - `export NODE_OPTIONS=--openssl-legacy-provider` (Linux / Mac)  run in terminal 
 - ARTIFACTORY_AUTH_TOKEN missing
   - Ensure that you performed step 2 of the setup guide
   - Open https://repo.eon-cds.de/ui/packages and click on "Welcome [username]" at the top right corner, then set me up -> npm -> generate Token. Copy that token and store it as an env variable, see err-ossl-evp-unsupported

## API Documentation

The API documentation is available at the following URL:
- [Swagger API Documentation](http://localhost:8000/docs) (Ensure the backend server is running -> [see Setup step5](#step5) [Swagger API Documentation](http://localhost:8000/docs) (Ensure the backend server is running -> [see Setup step5](#step5)
