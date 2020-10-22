const express = require('express');
const router = express.Router();
const db = require('../config/db_connection')();
const UserTableName = "users"


/* -------------- ::START:: API Function Zone -------------- */


// * [ 사용자 정보 가져오기 ] * //
function getUserInfo(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + UserTableName + " WHERE email=? and token=?", [params.email, params.token], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

function setLogout(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + UserTableName +" SET islogin='0', token='' WHERE email=? AND type=?", [params.email, params.type], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 사용자 리뷰 포인트 적립 삭제 ] * //
function UpdateUserPoint(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + UserTableName + " SET point=? WHERE email=? and type=?", [params.point, params.email, params.type], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

/* -------------- ::START:: Router Zone -------------- */


// * [ 사용자 정보 가져오기 ] * //
router.post('/', function(req, res, next) {
  getUserInfo(req.body).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getUserInfo] error :' + err);
    res.end('NOK');
  });
});

// * [ 로그아웃 실행 ] * //
router.post('/logout', function(req, res, next) {
  setLogout(req.body).then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[setLogout] error :' + err);
    res.end('NOK');
  });
});

// * [ 사용자 추가 또는 업데이트 ] * //
router.post('/addupdate', function(req, res, next) {
  insertStudy(req.body)
  .then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[insertStudy] error :' + err);
    res.end('NOK');
  });
});

// * [ 사용자 포인트 업데이트 ] * //
router.post('/point/update', function(req, res, next) {
  UpdateUserPoint(req.body).then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[UpdateUserPoint] error :' + err);
    res.end('NOK');
  });
});

module.exports = router;