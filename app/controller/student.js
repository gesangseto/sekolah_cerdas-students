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

exports.ListSiswa = function (req, res) {
    perf.start();
    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            var sql = `SELECT student_session.transport_fees,students.vehroute_id,vehicle_routes.route_id,vehicle_routes.vehicle_id,transport_route.route_title,vehicles.vehicle_no,hostel_rooms.room_no,vehicles.driver_name,vehicles.driver_contact,hostel.id as hostel_id,hostel.hostel_name,room_types.id as room_type_id,room_types.room_type ,students.hostel_room_id,student_session.id as student_session_id,student_session.fees_discount,classes.id AS class_id,classes.class,sections.id AS section_id,sections.section,students.id AS student_id, students.admission_no , students.roll_no,students.admission_date,students.firstname,  students.lastname,students.image,    students.mobileno, students.email ,students.state ,students.app_key ,students.parent_app_key,   students.city , students.pincode , students.note, students.religion, students.cast, school_houses.house_name,   students.dob ,students.current_address, students.previous_school, students.guardian_is,students.parent_id,students.permanent_address,students.category_id,students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code , students.guardian_name , students.father_pic ,students.height ,students.weight,students.measurement_date, students.mother_pic , students.guardian_pic , students.guardian_relation,students.guardian_phone,students.guardian_address,students.is_active ,students.created_at ,students.updated_at,students.father_name,students.father_phone,students.blood_group,students.school_house_id,students.father_occupation,students.mother_name,students.mother_phone,students.mother_occupation,students.guardian_occupation,students.gender,students.guardian_is,students.rte,students.guardian_email
            FROM students
            LEFT JOIN student_session ON student_session.student_id=students.id
            LEFT JOIN classes ON student_session.class_id=classes.id
            LEFT JOIN sections ON sections.id=student_session.section_id
            LEFT JOIN hostel_rooms ON hostel_rooms.id=students.hostel_room_id
            LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
            LEFT JOIN room_types ON room_types.id=hostel_rooms.room_type_id            
			LEFT JOIN vehicle_routes ON vehicle_routes.id=students.vehroute_id
			LEFT JOIN transport_route ON transport_route.id=vehicle_routes.route_id
            LEFT JOIN vehicles ON vehicles.id=vehicle_routes.vehicle_id
            LEFT JOIN school_houses ON school_houses.id=students.school_house_id
            WHERE  student_session.session_id =` + session_id;
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
exports.SearchSiswa = function (req, res) {
    perf.start();
    var total = 0;
    var search = req.params.search
    if (search != undefined) {
        connection.query("SELECT a.session_id AS session_id FROM `sch_settings` AS a;",
            function (error, result, fields) {
                if (result[0] != undefined) {
                    var session_id = result[0]['session_id']
                    var sql = `SELECT student_session.transport_fees,students.vehroute_id,vehicle_routes.route_id,vehicle_routes.vehicle_id,transport_route.route_title,vehicles.vehicle_no,hostel_rooms.room_no,vehicles.driver_name,vehicles.driver_contact,hostel.id as hostel_id,hostel.hostel_name,room_types.id as room_type_id,room_types.room_type ,students.hostel_room_id,student_session.id as student_session_id,student_session.fees_discount,classes.id AS class_id,classes.class,sections.id AS section_id,sections.section,students.id AS student_id, students.admission_no , students.roll_no,students.admission_date,students.firstname,  students.lastname,students.image,    students.mobileno, students.email ,students.state ,students.app_key ,students.parent_app_key,   students.city , students.pincode , students.note, students.religion, students.cast, school_houses.house_name,   students.dob ,students.current_address, students.previous_school, students.guardian_is,students.parent_id,students.permanent_address,students.category_id,students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code , students.guardian_name , students.father_pic ,students.height ,students.weight,students.measurement_date, students.mother_pic , students.guardian_pic , students.guardian_relation,students.guardian_phone,students.guardian_address,students.is_active ,students.created_at ,students.updated_at,students.father_name,students.father_phone,students.blood_group,students.school_house_id,students.father_occupation,students.mother_name,students.mother_phone,students.mother_occupation,students.guardian_occupation,students.gender,students.guardian_is,students.rte,students.guardian_email
                    FROM students
                    LEFT JOIN student_session ON student_session.student_id=students.id
                    LEFT JOIN classes ON student_session.class_id=classes.id
                    LEFT JOIN sections ON sections.id=student_session.section_id
                    LEFT JOIN hostel_rooms ON hostel_rooms.id=students.hostel_room_id
                    LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
                    LEFT JOIN room_types ON room_types.id=hostel_rooms.room_type_id            
                    LEFT JOIN vehicle_routes ON vehicle_routes.id=students.vehroute_id
                    LEFT JOIN transport_route ON transport_route.id=vehicle_routes.route_id
                    LEFT JOIN vehicles ON vehicles.id=vehicle_routes.vehicle_id
                    LEFT JOIN school_houses ON school_houses.id=students.school_house_id
                    WHERE (concat(students.firstname, ' ', students.lastname) LIKE "%` + search + `%" AND student_session.session_id =` + session_id + `)
                    OR (students.admission_no LIKE "%`+ search + `%" AND student_session.session_id =` + session_id + `) OR (students.dob LIKE "%` + search + `%" AND student_session.session_id =` + session_id + `) OR (students.current_address LIKE "%` + search + `%" AND student_session.session_id =` + session_id + `)
                    OR (students.father_name LIKE "%`+ search + `%" AND student_session.session_id =` + session_id + `) OR (students.mother_name LIKE "%` + search + `%" AND student_session.session_id =` + session_id + `) OR (students.mobileno LIKE "%` + search + `%" AND student_session.session_id =` + session_id + `)`
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
    }

};


exports.getSiswaById = function (req, res) {
    perf.start();
    var total = 0;
    var student_id = req.params.id;
    var sql = `SELECT student_session.transport_fees,students.vehroute_id,vehicle_routes.route_id,vehicle_routes.vehicle_id,transport_route.route_title,vehicles.vehicle_no,hostel_rooms.room_no,vehicles.driver_name,vehicles.driver_contact,hostel.id as hostel_id,hostel.hostel_name,room_types.id as room_type_id,room_types.room_type ,students.hostel_room_id,student_session.id as student_session_id,student_session.fees_discount,classes.id AS class_id,classes.class,sections.id AS section_id,sections.section,students.id AS student_id, students.admission_no , students.roll_no,students.admission_date,students.firstname,  students.lastname,students.image,    students.mobileno, students.email ,students.state ,students.app_key ,students.parent_app_key,   students.city , students.pincode , students.note, students.religion, students.cast, school_houses.house_name,   students.dob ,students.current_address, students.previous_school, students.guardian_is,students.parent_id,students.permanent_address,students.category_id,students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code , students.guardian_name , students.father_pic ,students.height ,students.weight,students.measurement_date, students.mother_pic , students.guardian_pic , students.guardian_relation,students.guardian_phone,students.guardian_address,students.is_active ,students.created_at ,students.updated_at,students.father_name,students.father_phone,students.blood_group,students.school_house_id,students.father_occupation,students.mother_name,students.mother_phone,students.mother_occupation,students.guardian_occupation,students.gender,students.guardian_is,students.rte,students.guardian_email
    FROM students
    LEFT JOIN student_session ON student_session.student_id=students.id
    LEFT JOIN classes ON student_session.class_id=classes.id
    LEFT JOIN sections ON sections.id=student_session.section_id
    LEFT JOIN hostel_rooms ON hostel_rooms.id=students.hostel_room_id
    LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
    LEFT JOIN room_types ON room_types.id=hostel_rooms.room_type_id            
    LEFT JOIN vehicle_routes ON vehicle_routes.id=students.vehroute_id
    LEFT JOIN transport_route ON transport_route.id=vehicle_routes.route_id
    LEFT JOIN vehicles ON vehicles.id=vehicle_routes.vehicle_id
    LEFT JOIN school_houses ON school_houses.id=students.school_house_id
    WHERE students.id =`+ student_id;
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

exports.getSiswa = function (req, res) {
    perf.start();
    var total = 0;
    connection.query("SELECT a.session_id AS session_id FROM `sch_settings` AS a;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            var sql = `SELECT student_session.transport_fees,students.vehroute_id,vehicle_routes.route_id,vehicle_routes.vehicle_id,transport_route.route_title,vehicles.vehicle_no,hostel_rooms.room_no,vehicles.driver_name,vehicles.driver_contact,hostel.id as hostel_id,hostel.hostel_name,room_types.id as room_type_id,room_types.room_type ,students.hostel_room_id,student_session.id as student_session_id,student_session.fees_discount,classes.id AS class_id,classes.class,sections.id AS section_id,sections.section,students.id AS student_id, students.admission_no , students.roll_no,students.admission_date,students.firstname,  students.lastname,students.image,    students.mobileno, students.email ,students.state ,students.app_key ,students.parent_app_key,   students.city , students.pincode , students.note, students.religion, students.cast, school_houses.house_name,   students.dob ,students.current_address, students.previous_school, students.guardian_is,students.parent_id,students.permanent_address,students.category_id,students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code , students.guardian_name , students.father_pic ,students.height ,students.weight,students.measurement_date, students.mother_pic , students.guardian_pic , students.guardian_relation,students.guardian_phone,students.guardian_address,students.is_active ,students.created_at ,students.updated_at,students.father_name,students.father_phone,students.blood_group,students.school_house_id,students.father_occupation,students.mother_name,students.mother_phone,students.mother_occupation,students.guardian_occupation,students.gender,students.guardian_is,students.rte,students.guardian_email
            FROM students
            LEFT JOIN student_session ON student_session.student_id=students.id
            LEFT JOIN classes ON student_session.class_id=classes.id
            LEFT JOIN sections ON sections.id=student_session.section_id
            LEFT JOIN hostel_rooms ON hostel_rooms.id=students.hostel_room_id
            LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
            LEFT JOIN room_types ON room_types.id=hostel_rooms.room_type_id            
            LEFT JOIN vehicle_routes ON vehicle_routes.id=students.vehroute_id
            LEFT JOIN transport_route ON transport_route.id=vehicle_routes.route_id
            LEFT JOIN vehicles ON vehicles.id=vehicle_routes.vehicle_id
            LEFT JOIN school_houses ON school_houses.id=students.school_house_id
            WHERE student_session.session_id=`+ session_id
            if (req.query.class_id != undefined && req.query.sub_class_id != undefined) {
                sql = sql + ' AND student_session.class_id=' + req.query.class_id + ' AND student_session.section_id=' + req.query.sub_class_id
            } else if (req.query.class_id != undefined) {
                sql = sql + ' AND student_session.class_id=' + req.query.class_id
            } else if (req.query.sub_class_id != undefined) {
                sql = sql + ' AND student_session.section_id=' + req.query.sub_class_id
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

exports.getRecentRecord = function (req, res) {
    perf.start();
    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            var sql = `SELECT student_session.transport_fees,students.vehroute_id,vehicle_routes.route_id,vehicle_routes.vehicle_id,transport_route.route_title,vehicles.vehicle_no,hostel_rooms.room_no,vehicles.driver_name,vehicles.driver_contact,hostel.id as hostel_id,hostel.hostel_name,room_types.id as room_type_id,room_types.room_type ,students.hostel_room_id,student_session.id as student_session_id,student_session.fees_discount,classes.id AS class_id,classes.class,sections.id AS section_id,sections.section,students.id AS student_id, students.admission_no , students.roll_no,students.admission_date,students.firstname,  students.lastname,students.image,    students.mobileno, students.email ,students.state ,students.app_key ,students.parent_app_key,   students.city , students.pincode , students.note, students.religion, students.cast, school_houses.house_name,   students.dob ,students.current_address, students.previous_school, students.guardian_is,students.parent_id,students.permanent_address,students.category_id,students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code , students.guardian_name , students.father_pic ,students.height ,students.weight,students.measurement_date, students.mother_pic , students.guardian_pic , students.guardian_relation,students.guardian_phone,students.guardian_address,students.is_active ,students.created_at ,students.updated_at,students.father_name,students.father_phone,students.blood_group,students.school_house_id,students.father_occupation,students.mother_name,students.mother_phone,students.mother_occupation,students.guardian_occupation,students.gender,students.guardian_is,students.rte,students.guardian_email
            FROM students
            LEFT JOIN student_session ON student_session.student_id=students.id
            LEFT JOIN classes ON student_session.class_id=classes.id
            LEFT JOIN sections ON sections.id=student_session.section_id
            LEFT JOIN hostel_rooms ON hostel_rooms.id=students.hostel_room_id
            LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
            LEFT JOIN room_types ON room_types.id=hostel_rooms.room_type_id            
            LEFT JOIN vehicle_routes ON vehicle_routes.id=students.vehroute_id
            LEFT JOIN transport_route ON transport_route.id=vehicle_routes.route_id
            LEFT JOIN vehicles ON vehicles.id=vehicle_routes.vehicle_id
            LEFT JOIN school_houses ON school_houses.id=students.school_house_id
            WHERE  student_session.session_id =` + session_id + ` ORDER BY students.id LIMIT 5`
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
exports.getAppSiswa = function (req, res) {
    perf.start();
    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            var sql = `SELECT student_session.transport_fees,students.vehroute_id,vehicle_routes.route_id,vehicle_routes.vehicle_id,transport_route.route_title,vehicles.vehicle_no,hostel_rooms.room_no,vehicles.driver_name,vehicles.driver_contact,hostel.id as hostel_id,hostel.hostel_name,room_types.id as room_type_id,room_types.room_type ,students.hostel_room_id,student_session.id as student_session_id,student_session.fees_discount,classes.id AS class_id,classes.class,sections.id AS section_id,sections.section,students.id AS student_id, students.admission_no , students.roll_no,students.admission_date,students.firstname,  students.lastname,students.image,    students.mobileno, students.email ,students.state ,students.app_key ,students.parent_app_key,   students.city , students.pincode , students.note, students.religion, students.cast, school_houses.house_name,   students.dob ,students.current_address, students.previous_school,
            students.guardian_is,students.parent_id,students.permanent_address,students.category_id,students.adhar_no,students.samagra_id,students.bank_account_no,students.bank_name, students.ifsc_code , students.guardian_name , students.father_pic ,students.height ,students.weight,students.measurement_date, students.mother_pic , students.guardian_pic , students.guardian_relation,students.guardian_phone,students.guardian_address,students.is_active ,students.created_at ,students.updated_at,students.father_name,students.father_phone,students.blood_group,students.school_house_id,students.father_occupation,students.mother_name,students.mother_phone,students.mother_occupation,students.guardian_occupation,students.gender,students.guardian_is,students.rte,students.guardian_email FROM students
                    JOIN student_session ON student_session.student_id = students.id
                    JOIN classes ON student_session.class_id = classes.id
                    JOIN sections ON sections.id = student_session.section_id
                    LEFT JOIN hostel_rooms ON hostel_rooms.id = students.hostel_room_id
                    LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
                    LEFT JOIN room_types ON room_types.id = hostel_rooms.room_type_id
                    LEFT JOIN vehicle_routes ON vehicle_routes.id = students.vehroute_id
                    LEFT JOIN transport_route ON vehicle_routes.route_id = transport_route.id
                    LEFT JOIN vehicles ON vehicles.id = vehicle_routes.vehicle_id
                    LEFT JOIN school_houses ON school_houses.id = students.school_house_id
            WHERE  student_session.session_id =` + session_id + ` ORDER BY students.id DESC`;
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

exports.getDocSiswa = function (req, res) {
    perf.start();
    var total = 0;
    var student_id = req.params.siswa_id;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']
            connection.query("SELECT * FROM student_doc WHERE student_id=?", [student_id],
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

exports.deleteDocSiswa = function (req, res) {
    perf.start();
    var total = 0;
    var id = req.body.doc_id;
    var student_id = req.body.siswa_id;
    if (id != undefined) {
        connection.query("DELETE FROM student_doc WHERE id=?", [id],
            function (error, result, fields) {
                if (error) {
                    messages = "Internal server error";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.errorRes(elapseTime, messages, res);
                } else {
                    messages = "Success delete";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                }
            });
    } else if (student_id != undefined) {
        connection.query("DELETE FROM student_doc WHERE student_id=?", [student_id],
            function (error, result, fields) {
                if (error) {
                    messages = "Internal server error";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.errorRes(elapseTime, messages, res);
                } else {
                    messages = "Success delete";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                }
            });
    } else {

        messages = "Failed delete, doc_id is null";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    }

};

exports.InsertSiswa = function (req, res) {
    perf.start();
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
    var sql = `INSERT INTO students (` + keys + `) VALUES (` + values + `)`;
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

exports.UpdateSiswa = function (req, res) {
    perf.start();
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
    var sql = `UPDATE students SET ` + myJSON + ` WHERE id=` + body.id;
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
