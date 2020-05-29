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

exports.GetStudentSession = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            var sql = `SELECT c.class AS class,d.section AS section, a.id AS student_session_id , a.*,b.*
                    FROM student_session AS a
                    JOIN students AS b ON a.student_id=b.id
                    JOIN classes AS c ON a.class_id=c.id
                    JOIN sections AS d ON a.section_id = d.id
                    WHERE  a.session_id =` + session_id;
            if (req.query.id != undefined) {
                sql = sql + ` AND a.id=` + req.query.id
            }
            if (req.query.class_id != undefined) {
                sql = sql + ` AND a.class_id=` + req.query.class_id
            }
            if (req.query.section_id != undefined) {
                sql = sql + ` AND a.section_id=` + req.query.section_id
            }
            if (req.query.search != undefined) {
                var search = req.query.search
                sql = sql + ` AND (concat(b.firstname, ' ',b.lastname) LIKE "%` + search + `%" )
                OR (b.admission_no LIKE "%`+ search + `%" ) OR (b.dob LIKE "%` + search + `%" ) OR (b.current_address LIKE "%` + search + `%" )
                OR (b.father_name LIKE "%`+ search + `%" ) OR (b.mother_name LIKE "%` + search + `%" ) OR (b.mobileno LIKE "%` + search + `%" )`
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
        });
};

exports.InsertStudentSession = function (req, res) {
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
    var check_sql = `SELECT count(*) as count FROM student_session WHERE session_id=` + body.session_id + ` AND student_id='` + body.student_id + `'`
    var sql = `INSERT INTO student_session (` + keys + `) VALUES (` + values + `)`;

    if (body.student_id == undefined || body.class_id == undefined || body.section_id == undefined || body.session_id == undefined || body.fees_discount == undefined) {
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

exports.UpdateStudentSession = function (req, res) {
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

    var check_sql = `SELECT count(*) as count FROM student_session WHERE id !=` + body.id + ` AND session_id=` + body.session_id + ` AND student_id='` + body.student_id + `'`
    var sql = `UPDATE student_session SET ` + myJSON + ` WHERE id=` + body.id;

    if (body.id == undefined || body.student_id == undefined || body.class_id == undefined || body.section_id == undefined || body.session_id == undefined || body.fees_discount == undefined) {
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



exports.DeleteStudentSession = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)
    if (req.body.id != undefined) {
        var id = req.body.id
    } if (req.query.id != undefined) {
        var id = req.query.id
    }
    var sql = `DELETE FROM student_session WHERE id=` + id;

    connection.query(sql,
        function (error, result, fields) {
            if (error) {
                messages = "Internal server error";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.errorRes(elapseTime, messages, res);
            } else {
                messages = "Success Delete Data";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.successPost(elapseTime, messages, res);
            }
        });

};