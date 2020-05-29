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

exports.ListIdCard = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var student_id = req.query.student_id;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            connection.query("SELECT * FROM id_card",
                function (error, result, fields) {
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
        });
};


exports.GetIdCardById = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var student_id = req.query.student_id;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            connection.query("SELECT * FROM id_card WHERE id=?", [req.params.id],
                function (error, result, fields) {
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
        });
};



exports.InsertIdCard = function (req, res) {
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
    var sql = `INSERT INTO id_card (` + keys + `) VALUES (` + values + `)`;
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
};


exports.UpdateIdCard = function (req, res) {
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
    var sql = `UPDATE id_card SET ` + myJSON + ` WHERE id=` + body.id;
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
};


exports.DeleteIdCard = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var student_id = req.query.student_id;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            connection.query("DELETE FROM id_card WHERE id=?", [req.params.id],
                function (error, result, fields) {
                    if (error) {
                        messages = "Internal server error";
                        elapseTime = perf.stop();
                        elapseTime = elapseTime.time.toFixed(2);
                        response.errorRes(elapseTime, messages, res);
                    } else {
                        messages = "Success Delete";
                        elapseTime = perf.stop();
                        elapseTime = elapseTime.time.toFixed(2);
                        response.successPost(elapseTime, messages, res);
                    }
                });
        });
};

