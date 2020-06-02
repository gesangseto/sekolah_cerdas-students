'use strict';

var response = require('../response');
var connection = require('../connection');


const perf = require('execution-time')();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');

var dt = datetime.create();
var status_code = "";
var messages = "";
var elapseTime = "";

exports.GetStudentCategory = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var sql = `SELECT * FROM categories WHERE id IS NOT NULL`;
    if (req.query.search != undefined) {
        var search = req.query.search
        sql = sql + ` AND ((category) LIKE "%` + search + `%" )`
    }
    if (req.query.id != undefined) {
        sql = sql + ` AND id=` + req.query.id
    }
    connection.query(sql, function (error, result, fields) {
        if (error) {
            messages = "Internal server error";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.errorRes(elapseTime, messages, res);
        } else {
            result.forEach(element => {
                total = total + 1;
            })
            messages = "Success";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.successGet(elapseTime, messages, total, result, res);
        }
    });
};
exports.InsertStudentCategory = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var body = req.body
    var values = []
    var keys = []
    for (let value of Object.values(body)) {
        values.push("'" + value + "'"); // John, then 30
    }
    for (let key in body) {
        keys.push(key); // John, then 30
    }
    var check_sql = `SELECT count(*) as count FROM categories WHERE category='` + req.body.category + `'`
    var sql = `INSERT INTO categories (` + keys + `) VALUES (` + values + `)`;

    if (body.category == undefined) {
        messages = "Failed Insert, all data must fill";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        connection.query(check_sql,
            function (error, result, fields) {
                if (result[0]['count'] > 0) {
                    messages = "Failed Insert, Duplicate data";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                } else {
                    connection.query(sql,
                        function (error, result, fields) {
                            if (error) {
                                messages = "Internal server error";
                                elapseTime = perf.stop();
                                elapseTime = elapseTime.time.toFixed(2);
                                response.errorRes(elapseTime, messages, res);
                            } else {
                                messages = "Success Insert Data";
                                elapseTime = perf.stop();
                                elapseTime = elapseTime.time.toFixed(2);
                                response.successPost(elapseTime, messages, res);
                            }
                        });
                }
            });

    }
};

exports.UpdateStudentCategory = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var body = req.body
    var values = []
    var keys = []
    var data = []
    for (let value of Object.values(body)) {
        values.push("'" + value + "'"); // John, then 30
    }
    for (let key in body) {
        keys.push(key); // John, then 30
    }
    var i;
    for (i in keys) {
        data.push(keys[i] + '=' + values[i])
    }
    var myJSON = JSON.stringify(data);
    myJSON = myJSON.replace(/["]/g, '');
    myJSON = myJSON.replace('[', '');
    myJSON = myJSON.replace(']', '');


    var check_sql = `SELECT count(*) as count FROM categories WHERE id !=` + body.id + ` AND category='` + body.category + `'`
    var sql = `UPDATE categories SET ` + myJSON + ` WHERE id=` + body.id;

    if (body.id == undefined || body.category == undefined) {
        messages = "Failed Insert, all data must fill";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        connection.query(check_sql,
            function (error, result, fields) {
                if (result[0]['count'] > 0) {
                    messages = "Failed Update, Duplicate data";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                } else {
                    connection.query(sql,
                        function (error, result, fields) {
                            if (error) {
                                messages = "Internal server error";
                                elapseTime = perf.stop();
                                elapseTime = elapseTime.time.toFixed(2);
                                response.errorRes(elapseTime, messages, res);
                            } else {
                                messages = "Success Update Data";
                                elapseTime = perf.stop();
                                elapseTime = elapseTime.time.toFixed(2);
                                response.successPost(elapseTime, messages, res);
                            }
                        });
                }
            });

    }
};

exports.DeleteStudentCategory = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    if (req.body.id != undefined) {
        var id = req.body.id
    }
    if (req.query.id != undefined) {
        var id = req.query.id
    }
    var sql = `DELETE FROM categories WHERE id=` + id;
    connection.query(sql,
        function (error, result, fields) {
            if (error) {
                messages = "Internal server error";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.errorRes(elapseTime, messages, res);
            } else {
                messages = "Success Delete Data With id:" + id;
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.successPost(elapseTime, messages, res);
            }
        });
};
