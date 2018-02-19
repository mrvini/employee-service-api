'use strict';
module.exports = (app) => {
    const EmployeeApplicationService = require('../services/EmployeeApplicationService');
    const employeeService = new EmployeeApplicationService();

    app.route('/')
        .get(
            (req, res) => {
                res.json({message : 'Welcome to Employee Service!'})
            }
        );

    // employee Routes
    app.route('/employees')
        .get(employeeService.getAll.bind(employeeService))
        .post(employeeService.create.bind(employeeService));


    app.route('/employees/:id')
        .get(employeeService.get.bind(employeeService))
        .put(employeeService.update.bind(employeeService))
        .delete(employeeService.delete.bind(employeeService));
};
