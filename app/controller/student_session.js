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

exports.InsertStudentSession = function (req, res) {
    perf.start();
    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            var sql = `SELECT *
            FROM student_session
            WHERE  session_id =` + session_id;
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
        });
};