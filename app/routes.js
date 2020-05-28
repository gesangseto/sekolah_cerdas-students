'use strict';

module.exports = function (app) {

    // Jadwal Kelas Route
    var student = require('./controller/student');
    app.route('/siswa/ListSiswa')
        .get(student.ListSiswa);
    app.route('/siswa/Search/:search')
        .get(student.SearchSiswa);
    app.route('/siswa/GetSiswa/Id/:siswa_id')
        .get(student.getSiswaById);
    app.route('/siswa/GetSiswa/KelasId/:kelas_id')
        .get(student.getSiswaByKelasId);
    app.route('/siswa/GetSiswa/KelasId/:kelas_id/SubKelasId/:sub_kelas_id')
        .get(student.getSiswaByKelasAndSubKelasId);
    app.route('/siswa/getRecentRecord')
        .get(student.getRecentRecord);
    app.route('/siswa/getAppSiswa')
        .get(student.getAppSiswa);
    app.route('/siswa/')
        .put(student.InsertSiswa);
    app.route('/siswa/')


    var student_sibling = require('./controller/student_sibling');
    app.route('/siswa/saudara_kandung')
        .get(student_sibling.GetSaudaraKandung);
    app.route('/siswa/saudara_kandung')
        .put(student_sibling.InsertSaudaraKandung);
    app.route('/siswa/saudara_kandung')
        .post(student_sibling.UpdateSaudaraKandung);
    app.route('/siswa/saudara_kandung')
        .delete(student_sibling.DeleteSaudaraKandung);


    var student_session = require('./controller/student_session');
    app.route('/siswa/student_session')
        .post(student_session.InsertUpdateStudentSession);
    // app.route('/siswa/saudara_kandung')
    //     .get(student_session.GetSaudaraKandung);
    // app.route('/siswa/saudara_kandung')
    //     .post(student_session.UpdateSaudaraKandung);
    // app.route('/siswa/saudara_kandung')
    //     .delete(student_session.DeleteSaudaraKandung);



    var student_doc = require('./controller/student_doc');
    app.route('/siswa/student_doc')
        .get(student_doc.getDocSiswa);
    app.route('/siswa/student_doc')
        .delete(student_doc.deleteDocSiswa);



    var student_library = require('./controller/student_library');
    app.route('/siswa/student_library')
        .post(student_library.searchLibraryStudent);

    var student_id_card = require('./controller/student_id_card');
    app.route('/siswa/student_id_card')
        .get(student_id_card.ListIdCard);
    app.route('/siswa/student_id_card/:id')
        .get(student_id_card.GetIdCardById);
    app.route('/siswa/student_id_card')
        .put(student_id_card.InsertIdCard);
    app.route('/siswa/student_id_card')
        .post(student_id_card.UpdateIdCard);
    app.route('/siswa/student_id_card/:id')
        .delete(student_id_card.DeleteIdCard);


};