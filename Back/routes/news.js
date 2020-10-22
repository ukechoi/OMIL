const express = require('express');
const router = express.Router();
const db = require('../config/db_connection')();
const NewsListTableName = "news_list"
const GoverTableName = "gover_list"
const aptTableName = "apt4u_list"

const ColumnListTableName = "column_list"
const vStoryListTableName = "vstory_list"
const dRoomListTableName = "droom_list"
/* -------------- ::START:: API Function Zone -------------- */

// * [ 뉴스 리스트 ] * //
function getAllList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + NewsListTableName + " ORDER BY real_date DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 분양 공고 리스트 ] * //
function getAptAllList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + aptTableName + " ORDER BY real_year DESC, real_date DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 정부 공고 리스트 ] * //
function getGoverAllList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + GoverTableName + " ORDER BY real_year DESC, real_date DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}




// * [ 컬럼 리스트 ] * //
function getColumnList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + ColumnListTableName + " ORDER BY real_date DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 임장기 리스트 ] * //
function getVstoryList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + vStoryListTableName + " ORDER BY real_date DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 자료실 리스트 ] * //
function getDroomList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + dRoomListTableName + " ORDER BY real_year DESC, real_date DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


/* -------------- ::START:: Router Zone -------------- */


// * [ 뉴스 리스트 ] * //
router.get('/', function(req, res, next) {
  getAllList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllList] error :' + err);
    res.end('NOK');
  });
});

// * [ 분양 리스트 ] * //
router.get('/apt', function(req, res, next) {
  getAptAllList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllList] error :' + err);
    res.end('NOK');
  });
});

// * [ 정부 리스트 ] * //
router.get('/gover', function(req, res, next) {
  getGoverAllList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllList] error :' + err);
    res.end('NOK');
  });
});



// * [ 컬럼 리스트 ] * //
router.get('/column', function(req, res, next) {
  getColumnList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getColumnList] error :' + err);
    res.end('NOK');
  });
});

// * [ 임장기 리스트 ] * //
router.get('/vstory', function(req, res, next) {
  getVstoryList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getVstoryList] error :' + err);
    res.end('NOK');
  });
});

// * [ 자료실 리스트 ] * //
router.get('/droom', function(req, res, next) {
  getDroomList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getDroomList] error :' + err);
    res.end('NOK');
  });
});


module.exports = router;