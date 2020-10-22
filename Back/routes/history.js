const express = require('express');
const router = express.Router();
const db = require('../config/db_connection')();

const StudyHistoryTableName = "study_list"
const PayHistoryTableName = "pay_list"


/* -------------- ::START:: API Function Zone -------------- */


// * [ 내 예약 내역 전체 항목 ] * //
function getHistory(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + PayHistoryTableName + " WHERE email=? and type=? ORDER BY create_date DESC", [params.email, params.type], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 나의 스터디 등록 내역 전체 항목 ] * //
function getMyStudyHistory(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + StudyHistoryTableName + " WHERE email=? and type=? ORDER BY update_at DESC", [params.email, params.type], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}



/* -------------- ::START:: Router Zone -------------- */



// * [ 임장 내역 조회 하기 ] * //
router.post('/', function(req, res, next) {
  getHistory(req.body).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getHistory] error :' + err);
    res.end('NOK');
  });
});


// * [ 나의 스터디 등록 내역 전체 항목 ] * //
router.post('/study', function(req, res, next) {
  getMyStudyHistory(req.body).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getMyStudyHistory] error :' + err);
    res.end('NOK');
  });
});

module.exports = router;