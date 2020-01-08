#### Start application in docker:
```docker-compose -f docker-compose.yml up -d```

Then navigate to http://localhost:3000/api-docs/ to see Swagger GUI page with api description.
Service require authorization token, see config/config.json

#### Run manually:
npm run migration
npm start

#### Run tests coverage and lint:
npm run test
npm run eslint
