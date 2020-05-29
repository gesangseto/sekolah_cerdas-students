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

exports.searchLibraryStudent = function (req, res) {
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
            var sql = `SELECT classes.id AS class_id,student_session.id as student_session_id,students.id,classes.class,sections.id AS section_id,
                        IFNULL(libarary_members.id,0) as libarary_member_id,
                        IFNULL(libarary_members.library_card_no,0) as library_card_no,
                        sections.section,students.id,students.admission_no, students.roll_no,students.admission_date,students.firstname, 
                        students.lastname,students.image,    students.mobileno, students.email ,students.state ,   students.city , students.pincode,
                        students.religion,     students.dob ,students.current_address,    students.permanent_address,
                        IFNULL(students.category_id, 0) as category_id,IFNULL(categories.category, "") as category,
                        students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code ,
                        students.guardian_name , students.guardian_relation,students.guardian_phone,
                        students.guardian_address,students.is_active ,students.created_at ,
                        students.updated_at,students.father_name,students.rte,students.gender FROM students
                            JOIN student_session ON student_session.student_id = students.id
                            JOIN classes ON student_session.class_id = classes.id
                            JOIN sections ON sections.id = student_session.section_id
                            LEFT JOIN categories ON students.category_id = categories.id
                            LEFT JOIN libarary_members ON libarary_members.member_id = students.id and libarary_members.member_type = "student"
        
                        WHERE student_session.session_id = `+ session_id + ` AND students.is_active = 'yes'`
            if (req.body.class_id != undefined) {
                sql = sql + ' AND student_session.class_id =' + req.body.class_id
            } if (req.body.section_id != undefined) {
                sql = sql + ' AND student_session.section_id =' + req.body.section_id
            }
            connection.query(sql,
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