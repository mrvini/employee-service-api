# Employee Application Service

This serverless server will allow to manage employees
- find
- create
- update
- delete
- get all

Please follow https://serverless.com documentation to set up your environment.
This project is configured to run in AWS

## SETUP
Checkout Repository and run

```bash
#install dependencies
npm install
```

### Offline DEVELOPMENT
```bash
# install dynamodb locally
sls install dynamodb
# start offline
sls offline start

```
### Data Seed
Data in DynamoDB is seeded for local development and located in ```utils/dynamodb-data/employees.json```
Configuration for seed data is specified in ```serverless.yml``` under custom tag

```
custom:
  tableName: 'employee-table-${self:provider.stage}'
  dynamodb:
    start:
      migrate: true
      seed: true

    seed:
      domain:
        sources:
          - table: 'employee-table-${self:provider.stage}'
            sources: [./utils/dynamodb-data/employees.json]


```

### Verify Setup
Once your service started in offline mode, verify it by navigating to the url in your browser ```http://localhost:3000```

### Resources
Follow Serverless  User Guid to setup serverless: https://serverless.com/framework/docs/providers/aws/guide/installation/
Setup AWS SDK as per: https://serverless.com/framework/docs/providers/aws/guide/credentials/
DynamoDB references: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

## TEST using Curl

Get All
```bash
curl -H "Content-Type: application/json" -X GET http://localhost:3000/employees
```

POST
```bash
curl -H "Content-Type: application/json" -X POST http://localhost:3000/employees -d '{ "firstName":"Valeriy", "lastName":"Vinder" , "gender":"M"}'
```

PUT
```bash
curl -H "Content-Type: application/json" -X PUT http://localhost:3000/employees/86e02850-048c-11e8-bbb6-e9d61b3218a6 -d '{"firstName":"John"}'
```

DELETE
```bash
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/employees/86e02850-048c-11e8-bbb6-e9d61b3218a6
```


##TODO

- Add Validation of the requests
- Setup a Docker container for ease of testing
- Add Repository, possibly DAO objects
