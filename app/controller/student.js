'use strict';

var response = require('../response');
var connection = require('../connection');

var crypto = require('crypto');

const perf = require('execution-time')();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');

var dt = datetime.create();
var status_code = "";
var messages = "";
var elapseTime = "";



function MakePassword(length) {
    return new Promise(resolve => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        resolve(result)
    });
}
function InsertStudent(keys, values) {
    return new Promise(resolve => {
        var sql = `INSERT INTO students (` + keys + `) VALUES (` + values + `)`
        connection.query(sql, function (error, rows, fields) {
            if (error) {
                console.log(error)
                resolve("error")
            } else {
                resolve("success"); //Kembalian berupa kontak data
            }
        });
    });
}
function InsertUserStudent(id, username_student, password) {
    return new Promise(resolve => {
        var sql = 'INSERT INTO `users`(`id`, `user_id`, `username`,`password`,`role`) SELECT MAX(id) + 1,?,?,?,"student" FROM users'
        connection.query(sql, [id, username_student, password], function (error, rows, fields) {
            if (error) {
                console.log(error)
                resolve("error")
            } else {
                resolve("success"); //Kembalian berupa kontak data
            }
        });
    });
}
function InsertUserParent(id, username_parent, password) {
    return new Promise(resolve => {
        var sql = 'INSERT INTO `users`(`id`, `user_id`, `username`,`password`,`role`) SELECT MAX(id) + 1,?,?,?,"parent" FROM users'
        connection.query(sql, [id, username_parent, password], function (error, rows, fields) {
            if (error) {
                console.log(error)
                resolve("error")
            } else {
                resolve("success"); //Kembalian berupa kontak data
            }
        });
    });
}
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
function GetStudentMaxId() {
    return new Promise(resolve => {
        var sql = `SELECT max(id) AS id FROM students`
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

exports.GetStudent = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var sql = `SELECT * FROM students WHERE id IS NOT NULL`;
    if (req.query.search != undefined) {
        var search = req.query.search
        sql = sql + ` AND (concat(firstname, ' ', lastname) LIKE "%` + search + `%" )
        OR (admission_no LIKE "%`+ search + `%" ) OR (dob LIKE "%` + search + `%" ) OR (current_address LIKE "%` + search + `%" )
        OR (father_name LIKE "%`+ search + `%" ) OR (mother_name LIKE "%` + search + `%" ) OR (mobileno LIKE "%` + search + `%" )`
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
exports.getRecentRecord = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var sql = `SELECT * FROM students ORDER BY id DESC LIMIT 5`;
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


exports.InsertStudent = async function (req, res) {
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
    if (body.admission_no == undefined || body.firstname == undefined || body.father_name == undefined || body.mother_name == undefined) {
        messages = "Failed Insert, all data must fill";
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
                var password = await MakePassword(6)

                password = crypto.createHash('md5').update(password).digest('hex');
                // password = crypto.createHash('hash').update(password).digest('hex');
                console.log(password); // 9b74c9897bac770ffc029102a200c5de

                var username_student = 'std_' + id
                var username_parent = 'parent_' + id
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

exports.UpdateStudent = async function (req, res) {
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



    if (body.admission_no == undefined || body.firstname == undefined || body.father_name == undefined || body.mother_name == undefined || body.id == undefined) {
        messages = "Failed Insert, all data must fill";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        var sql_check_duplicate = `SELECT count(id) as count FROM students WHERE id!=` + body.id + ` AND admission_no="` + body.admission_no + `"`;
        var check_duplicate = await SQL_QUERY(sql_check_duplicate)
        if (check_duplicate[0]['count'] > 0) {
            messages = "Failed Update, duplicate admission_no";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.successPost(elapseTime, messages, res);
        } else {
            var sql = `UPDATE students SET ` + myJSON + ` WHERE id=` + body.id;
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

exports.DeleteStudent = function (req, res) {
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
