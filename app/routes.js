'use strict';

module.exports = function (app) {


    // Students
    var student = require('./controller/student');
    app.route('/student/student')
        .get(student.GetStudent);
    app.route('/student/getRecentRecord')
        .get(student.getRecentRecord);
    app.route('/student/student')
        .put(student.InsertStudent);
    app.route('/student/student')
        .post(student.UpdateStudent);
    app.route('/student/student')
        .delete(student.DeleteStudent);


    // Student Sibling
    var student_sibling = require('./controller/student_sibling');
    app.route('/student/saudara_kandung')
        .get(student_sibling.GetSaudaraKandung);
    app.route('/student/saudara_kandung')
        .put(student_sibling.InsertSaudaraKandung);
    app.route('/student/saudara_kandung')
        .post(student_sibling.UpdateSaudaraKandung);
    app.route('/student/saudara_kandung')
        .delete(student_sibling.DeleteSaudaraKandung);

    // Student Session
    var student_session = require('./controller/student_session');
    app.route('/student/student_session')
        .get(student_session.GetStudentSession);
    app.route('/student/student_session')
        .put(student_session.InsertStudentSession);
    app.route('/student/student_session')
        .post(student_session.UpdateStudentSession);
    app.route('/student/student_session')
        .delete(student_session.DeleteStudentSession);


    // Student Document
    var student_doc = require('./controller/student_doc');
    app.route('/student/student_doc')
        .get(student_doc.getDocSiswa);
    app.route('/student/student_doc')
        .delete(student_doc.deleteDocSiswa);


    // Student Library
    var student_library = require('./controller/student_library');
    app.route('/student/student_library')
        .post(student_library.searchLibraryStudent);


    // Student ID Card
    var student_id_card = require('./controller/student_id_card');
    app.route('/student/student_id_card')
        .get(student_id_card.ListIdCard);
    app.route('/student/student_id_card/:id')
        .get(student_id_card.GetIdCardById);
    app.route('/student/student_id_card')
        .put(student_id_card.InsertIdCard);
    app.route('/student/student_id_card')
        .post(student_id_card.UpdateIdCard);
    app.route('/student/student_id_card/:id')
        .delete(student_id_card.DeleteIdCard);
};