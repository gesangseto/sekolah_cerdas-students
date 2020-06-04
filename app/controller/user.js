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

function SQL_QUERY(sql) {
    return new Promise(resolve => {
        connection.query(sql, function (error, rows, fields) {
            if (error) {
                console.log(error)
                resolve("error")
            } else {
                resolve(rows); //Kembalian berupa kontak data
            }
        });
    });
}

exports.Get = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var sql = `SELECT a.* , b.id as student_id, b.id as parent_id,b.firstname,b.father_name,b.mother_name FROM users AS a
        JOIN students AS b ON a.user_id=b.id
        WHERE a.id IS NOT NULL`;
    if (req.query.search != undefined) {
        var search = req.query.search
        sql = sql + ` AND (concat(b.firstname, ' ',b.lastname) LIKE "%` + search + `%" )
        OR (b.admission_no LIKE "%`+ search + `%" ) OR (b.dob LIKE "%` + search + `%" )
        OR (b.father_name LIKE "%`+ search + `%" ) OR (b.mother_name LIKE "%` + search + `%" ) `
    }
    if (req.query.student_id != undefined) {
        sql = sql + ` AND a.user_id=` + req.query.student_id
    }
    if (req.query.id != undefined) {
        sql = sql + ` AND a.id=` + req.query.id
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

exports.Insert = async function (req, res) {
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
    var id = await GetStudentMaxId()
    id = (+id[0]['id']) + 1
    keys.push("id")
    values.push("'" + id + "'")
    if (body.field_ini_ada_saat_insert_siswa == undefined || body.firstname == undefined || body.father_name == undefined || body.mother_name == undefined) {
        messages = "Failed Insert, must insert from student";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        var sql_check_duplicate = 'SELECT count(id) as id FROM students WHERE admission_no="' + body.admission_no + '"'
        var CheckDuplicate = await SQL_QUERY(sql_check_duplicate)
        console.log(CheckDuplicate)
        if (CheckDuplicate[0]['id'] > 0) {
            messages = "Failed Insert, duplicate admission_no";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.successPost(elapseTime, messages, res);
        } else {
            var insert_student = await InsertStudent(keys, values)
            if (insert_student == 'success') {
                var password = await MakePassword(4)
                var username_student = 'std_' + password
                var username_parent = 'parent_' + password
                var insert_user_student = await InsertUserStudent(id, username_student, password)
                var insert_user_parent = await InsertUserParent(id, username_parent, password)
                if (insert_user_parent != 'success' || insert_user_student != 'success') {
                    messages = "Success Insert Student, but error insert users";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                } else {
                    messages = "Success Insert Data";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                }
            }
        }

    }


};

exports.Update = async function (req, res) {
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



    if (body.id == undefined) {
        messages = "Failed Insert, id must fill";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        var sql_check_duplicate = `SELECT count(id) as count FROM user WHERE id!=` + body.id + ` AND username="` + body.username + `" AND password="` + body.password + `"`;
        var check_duplicate = await SQL_QUERY(sql_check_duplicate)
        if (check_duplicate[0]['count'] > 0) {
            messages = "Failed Update, duplicate username and password";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.successPost(elapseTime, messages, res);
        } else {
            var sql = `UPDATE users SET ` + myJSON + ` WHERE id=` + body.id;
            var update = await SQL_QUERY(sql)
            if (update == "error") {
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
        }
    }
};

exports.Delete = function (req, res) {
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
    var sql = `DELETE FROM students WHERE id=` + id;
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
