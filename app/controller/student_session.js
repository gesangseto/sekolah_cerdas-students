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

exports.InsertUpdateStudentSession = function (req, res) {
    perf.start();
    var total = 0;
    console.log(req.body)
    var student_id = req.body['student_id']
    var class_id = req.body['class_id']
    var section_id = req.body['section_id']
    var session_id = req.body['session_id']
    var fees_discount = req.body['fees_discount']
    if (student_id == undefined || class_id == undefined || section_id == undefined || session_id == undefined || fees_discount == undefined) {
        messages = "Failed, require all field";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        connection.query("SELECT * FROM student_session WHERE session_id =? AND student_id = ?", [session_id, student_id],
            function (error, result, fields) {
                result.forEach(element => {
                    total = total + 1;
                })
                if (total > 0) {
                    var id = result[0]['id']
                    connection.query("UPDATE `student_session` SET `student_id`= ?, `class_id`=?, `section_id`=?, `session_id`=?, `fees_discount`=? WHERE `id`=?",
                        [student_id, class_id, section_id, session_id, fees_discount, id],
                        function (error, result, fields) {
                            messages = "Success Update Data";
                            elapseTime = perf.stop();
                            elapseTime = elapseTime.time.toFixed(2);
                            response.successPost(elapseTime, messages, res);
                        });

                } else {
                    connection.query("INSERT INTO `student_session` (`student_id`,`class_id`,`section_id`,`session_id`,`fees_discount`) VALUES (?,?,?,?,?)",
                        [student_id, class_id, section_id, session_id, fees_discount],
                        function (error, result, fields) {
                            messages = "Success Insert Data";
                            elapseTime = perf.stop();
                            elapseTime = elapseTime.time.toFixed(2);
                            response.successPost(elapseTime, messages, res);
                        });

                }
            });

    }
};