'use strict';

/**
 * @module services
 */

// ideally, applicatiaon service will call domain service -> repo -> dao,
// and dao in its turn will be responsible for storing/retrieving items, etc..
// but for purposes of this exercise this should be enough

const Employee = require('../models/Employee');
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');
const EMPLOYEES_TABLE = process.env.EMPLOYEES_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

/**
 * @class module:entity.EmployeeApplicationService
 * @abstract
 */
module.exports = class EmployeeApplicationService {

    /**
     * @constructor
     * @method module:entity.EmployeeApplicationService.constructor
     */
    constructor() {
        // this should be done in the dao
        if (IS_OFFLINE === 'true') {
          this.dynamoDbClient = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
          })
        } else {
          this.dynamoDbClient = new AWS.DynamoDB.DocumentClient();
        };
    }

    /**
     * get all employee
     * @method module:entity.EmployeeApplicationService.getAll
     * @param  {Object} req request
     * @param  {object} res response
     * @return {void}
     */
    getAll(req, res) {
        // need to process criteria
        const employee = new Employee();
        const params = {
            TableName: EMPLOYEES_TABLE,
            ProjectionExpression: Object.keys(employee).join(',')//"id, firstName, lastName, email, gender, dateOfBirth, title, createdAt, updatedAt",
        }
        function scanHandler (error, result) {
            if (error) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(error, null, 2));

                res.status(400).json({ error: 'Could not find employees' });
                return true;
            } else {
                const employees = [];
                result.Items.forEach(
                    (employeeData) => {
                        const item = Object.assign({}, employee.load(employeeData));
                        employees.push(item)
                    }
                );
                res.json(employees);
                // continue scanning if we have more items
                // if (typeof data.LastEvaluatedKey != "undefined") {
                //    console.log("Scanning for more...");
                //    params.ExclusiveStartKey = data.LastEvaluatedKey;
                //    this.dynamoDbClient.scan(params, scanHandler);
                // }
            }
        }

        this.dynamoDbClient.scan(params, scanHandler);

    }

    /**
     * @description get employee
     * @method module:entity.EmployeeApplicationService.get
     * @param  {Object} req request
     * @param  {object} res response
     * @return {void}
     */
    get(req, res) {
        if (!req.params || (req.params && !req.params.id)) {
            res.status(400).json({ error: '"id" employee id is not specified' });
        }
        if (typeof req.params.id !== 'string') {
            res.status(400).json({ error: '"id" employee id must be a string' });
        }

        const params = {
            TableName: EMPLOYEES_TABLE,
            Key: {
                id: req.params.id,
            }
        }

        this.dynamoDbClient.get(params,
            (error, result) => {
                if (error) {
                    res.status(400).json({ error: 'Could not find employee. ' + error });
                }
              if (result.Item) {
                  const employee = new Employee();
                  employee.load(result.Item);
                  res.json(employee);
              } else {
                res.status(404).json({ error: "Employee not found" });
              }
        });
    }

    /**
     * create employee
     * @method module:entity.EmployeeApplicationService.create
     * @param  {Object} req request
     * @param  {object} res response
     * @return {void}
     */
    create(req, res) {
        if ((req.body && !req.body.id) || (req.body.id && typeof id !== 'string')) {
            req.body.id = uuidv1();
        }
        // @TODO add proper validation

        const employee = new Employee();
        employee.load(req.body);
        const params = {
          TableName: EMPLOYEES_TABLE,
          Item: employee.transformToDynamoDBJson()
        };

        this.dynamoDbClient.put(params, (error) => {
          if (error) {
            res.status(400).json({ error: 'Could not create employee' });
          }
          res.json(employee);
        });
    }

    /**
     * update employee
     * @method module:entity.EmployeeApplicationService.update
     * @param  {Object} req request
     * @param  {object} res response
     * @return {void}
     */
    update(req, res) {
        const { id } = req.params;
        if (typeof id !== 'string') {
          res.status(400).json({ error: '"id" must be a string' });
        }
        // @TODO add proper validation

        const employee = new Employee();
        req.body.id = id;
        employee.load(req.body);
        const params = {
          TableName: EMPLOYEES_TABLE,
          Item: employee.transformToDynamoDBJson()
        };
        this.dynamoDbClient.put(params, (error, data) => {
          if (error) {
            res.status(400).json({ error: 'Could not update employee' });
          }
          res.json(employee);
        });
    }

    /**
     * @description delete employee
     * @method module:entity.EmployeeApplicationService.delete
     * @param  {Object} req request
     * @param  {object} res response
     * @return {void}
     */
    delete(req, res) {
        const { id } = req.params;
        if (typeof id !== 'string') {
          res.status(400).json({ error: '"id" must be a string' });
        }

        const params = {
          TableName: EMPLOYEES_TABLE,
          Key:{
                "id": id,
            }
        };

        this.dynamoDbClient.delete(params, (error, data) => {
          if (error) {
            res.status(400).json({ error: 'Could not remove employee' });
          }
          res.json({success:true});
        });
    }
}
