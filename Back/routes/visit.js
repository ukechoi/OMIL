const express = require('express');
const router = express.Router();
const db = require('../config/db_connection')();
const FilterTableName = "filters"
const ListTableName = "visit_list"
const DetailTableName = "visit_detail"
const BookTableName = "visit_book"
const VisitHistoryTableName = "history_visit"

/* -------------- ::START:: API Function Zone -------------- */


// * [ 임장 리스트 ] * //
function getAllList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + ListTableName + " ORDER BY id DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 임장 리스트 ] * //
function getAllListLike() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + ListTableName + " ORDER BY view_count DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 임장 상세정보 ] * //
function getVisitDetail(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + DetailTableName + " WHERE uuid=?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 임장 상세정보 조회수 클릭 ] * //
function updateViewCount(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + ListTableName + " SET view_count = view_count + 1 WHERE uuid=?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 필터 리스트 ] * //
function getAllFilter(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + FilterTableName, [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 예약 가능 정보 ] * //
function getVisitBook(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + BookTableName + " WHERE uuid=?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 리뷰 정보 ] * //
function getVisitReview(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + VisitHistoryTableName + " WHERE visit_uuid=?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 좋아요 업데이트 ] * //
function updateLikeCount(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + DetailTableName + " SET v_like = v_like + 1 WHERE uuid=?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
function getLikeCount(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT v_like FROM " + DetailTableName + " WHERE uuid=?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 결제 완료 - 예약 생성 하기 ] * //
function insertBooking(params) {
  return new Promise(function (resolve, reject) {
    db.query("insert into "+ VisitHistoryTableName + " SET ?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 해당 회차 예약 가능 잔여석 ] * //
function getBookRemain(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT remain_guest FROM " + BookTableName + " WHERE uuid=? AND time=?", [params.uuid, params.time], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


// * [ 전체 예약 현황 - 임장 리스트 ] * //
function getProgress() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + BookTableName + " ORDER BY uuid ASC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}







/* -------------- ::START:: Router Zone -------------- */

// * [ 임장 리스트 - 최신순 ] * //
router.get('/', function(req, res, next) {
  getAllList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllList] error :' + err);
    res.end('NOK');
  });
});

// * [ 임장 리스트 - 인기순 ] * //
router.get('/like', function(req, res, next) {
  getAllListLike().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllListLike] error :' + err);
    res.end('NOK');
  });
});

// * [ 임장 상세정보 조회수 업데이트 ] * //
router.get('/detail/viewcount/:uuid', function (req, res) {
  updateViewCount(req.params.uuid).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[updateViewCount] error :' + err);
    res.end('NOK');
  });
});

// * [ 임장 상세정보 ] * //
router.get('/detail/:uuid', function (req, res) {
  getVisitDetail(req.params.uuid).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getVisitDetail] error :' + err);
    res.end('NOK');
  });
});

// * [ 필터 리스트 ] * //
router.get('/filter', function(req, res, next) {
  getAllFilter().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllFilter] error :' + err);
    res.end('NOK');
  });
});

// * [ 예약 가능 정보 ] * //
router.get('/book/:uuid', function (req, res) {
  getVisitBook(req.params.uuid).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getVisitBook] error :' + err);
    res.end('NOK');
  });
});

// * [ 리뷰 정보 ] * //
router.get('/review/:uuid', function (req, res) {
  getVisitReview(req.params.uuid).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getVisitReview] error :' + err);
    res.end('NOK');
  });
});

// * [ LIKE 정보 ] * //
router.get('/detail/like/:uuid', function (req, res) {
  updateLikeCount(req.params.uuid).then(result => {    
    getLikeCount(req.params.uuid).then(result => {
      res.json(result);
    }).catch(function (err) {
      console.log('[getLikeCount] error :' + err);
      res.end('NOK');
    });
  }).catch(function (err) {
    console.log('[updateLikeCount] error :' + err);
    res.end('NOK');
  });
});

// * [ 결제 완료 - 예약 생성 하기 ] * //
router.post('/booking/insert', function(req, res, next) {
  insertBooking(req.body)
  .then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[insertBooking] error :' + err);
    res.end('NOK');
  });
});

// * [ 잔여 예약 인원 정보 가져오기 ] * //
router.post('/booking/remain', function(req, res, next) {
  getBookRemain(req.body).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getBookRemain] error :' + err);
    res.end('NOK');
  });
});

// * [ 전체 예약 현황 - 임장 리스트 ] * //
router.get('/progress', function(req, res, next) {
  getProgress().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getProgress] error :' + err);
    res.end('NOK');
  });
});

module.exports = router;