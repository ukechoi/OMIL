const express = require('express');
const router = express.Router();
const db = require('../config/db_connection')();
const NoticeTableName = "notice"
const EventTableName = "event"
const ContactTableName = "contact"


/* -------------- ::START:: API Function Zone -------------- */


// * [ 공지사항 전체 항목 ] * //
function getAllNoticeList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + NoticeTableName + " ORDER BY create_at DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 이벤트 전체 항목 ] * //
function getAllEventList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + EventTableName + " ORDER BY create_at DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 문의 생성 하기 ] * //
function insertContact(params) {
  return new Promise(function (resolve, reject) {
    db.query("insert into "+ ContactTableName + " SET ?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


/* -------------- ::START:: Router Zone -------------- */


// * [ 공지사항 전체 항목 ] * //
router.get('/notice', function(req, res, next) {
  getAllNoticeList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllNoticeList] error :' + err);
    res.end('NOK');
  });
});

// * [ 이벤트 전체 항목 ] * //
router.get('/event', function(req, res, next) {
  getAllEventList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllEventList] error :' + err);
    res.end('NOK');
  });
});

// * [ 문의 생성 하기 ] * //
router.post('/contact', function(req, res, next) {
  insertContact(req.body)
  .then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[insertContact] error :' + err);
    res.end('NOK');
  });
});

module.exports = router;