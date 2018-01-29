# Employee Application Service

This serverless server will allow to manage employees
- find
- create
- update
- delete
- get all

Please follow https://serverless.com documentation to set up your envirnment.
This project is configured to run in AWS

## start
```bash
#install dependencies
npm install
```

## Offline development
```bash
# install dynamodb locally
sls install dynamodb
# start offline
sls offline start

```

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
