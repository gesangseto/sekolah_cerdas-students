'use strict';

module.exports = function (app) {

    // Umum

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
    app.route('/siswa/DocSiswa/Id/:siswa_id')
        .get(student.getDocSiswa);
    app.route('/siswa/DocSiswa')
        .delete(student.deleteDocSiswa);
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
};