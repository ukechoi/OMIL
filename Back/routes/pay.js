const express = require('express');
const BootpayRest = require('bootpay-rest-client');
const router = express.Router();
const db = require('../config/db_connection')();
const ViBookTableName = "visit_book"
const SeBookTableName = "seminar_book"
const PayTableName = "pay_list"
const DCodeTableName = "dcode"
const UserTableName = "users"

/* -------------- ::START:: API Function Zone -------------- */


// * [ 임장 상품 - 예약 인원 업데이트 ] * //
function ViUpdateBookRemain(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + ViBookTableName + " SET remain_guest=? WHERE uuid=? AND time=?",  [params.remain_guest, params.uuid, params.time], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
// * [ 예약 가능 잔여석 ] * //
function ViGetRemain(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT remain_guest FROM " + ViBookTableName + " WHERE uuid=? AND time=?", [params.uuid, params.time], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


// * [ 세미나 상품 - 예약 인원 업데이트 ] * //
function SeUpdateBookRemain(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + SeBookTableName + " SET remain_guest=? WHERE uuid=? AND time=?",  [params.remain_guest, params.uuid, params.time], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
// * [ 예약 가능 잔여석 ] * //
function SeGetRemain(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT remain_guest FROM " + SeBookTableName + " WHERE uuid=? AND time=?", [params.uuid, params.time], function (err, result) {
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
    db.query("insert into "+ PayTableName + " SET ?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 페이 상태 업데이트 ] * //
function UpdatePayStatus(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + PayTableName + " SET pay_status=? WHERE receipt_id=?",  [params.pay_status, params.receipt_id], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 사용자 리뷰 가져오기 ] * //
function getUserReview(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + PayTableName + " WHERE uuid=? ORDER BY modify_date DESC", params.uuid, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 사용자 리뷰 업데이트(초기화) ] * //
function UpdateUserReview(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + PayTableName + " SET review_star=?, review_comment=? WHERE id=?",  
    [params.review_star, params.review_comment, params.id], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 사용자 리뷰 포인트 적립 ] * //
function UpdateUserReviewPointPlus(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + UserTableName + " SET point=point + 2000 WHERE email=? and type=?",  
    [params.email, params.type], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 사용자 리뷰 포인트 적립 삭제 ] * //
function UpdateUserReviewPointMinus(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + UserTableName + " SET point=point - 2000 WHERE email=? and type=?",  
    [params.email, params.type], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


// * [ 할인 코드 가져오기 ] * //
function getDCode() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + DCodeTableName, [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


/* -------------- ::START:: Router Zone -------------- */


// * [ 할인 코드 가져오기 ] * //
router.get('/dcode', function(req, res, next) {
  getDCode().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getDCode] error :' + err);
    res.end('NOK');
  });
});


// * [ 사용자 리뷰 가져오기 ] * //
router.post('/review', function(req, res, next) {
  getUserReview(req.body).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getUserReview] error :' + err);
    res.end('NOK');
  });
});

// * [ 사용자 리뷰 추가하기 ] * //
router.post('/review/create', function(req, res, next) {
  console.log(req.body)
  UpdateUserReview(req.body).then(result => {

    UpdateUserReviewPointPlus(req.body).then(result => {
      res.end('OK');
    }).catch(function (err) {
      console.log('[UpdateUserReviewPoint] error :' + err);
      res.end('NOK');
    });

  }).catch(function (err) {
    console.log('[UpdateUserReview] error :' + err);
    res.end('NOK');
  });
});

// * [ 사용자 리뷰 삭제하기(초기화) ] * //
router.post('/review/delete', function(req, res, next) {
  console.log(req.body)
  UpdateUserReview(req.body).then(result => {

    UpdateUserReviewPointMinus(req.body).then(result => {
      res.end('OK');
    }).catch(function (err) {
      console.log('[UpdateUserReviewPointMinus] error :' + err);
      res.end('NOK');
    });

  }).catch(function (err) {
    console.log('[UpdateUserReview] error :' + err);
    res.end('NOK');
  });
});



// * [ 취소 검증 & 예약 업데이트 ] * //
router.post('/bootpay/cancel', function(req, res, next) {  
    BootpayRest.setConfig(
      "5e38f1cb02f57e002f5c760f",
      "vVSYYK5G6wqql70Skiq4ZGUH7i4lNKphgjgnIjTCPqI="
    );
    
    console.log(req.body)

    BootpayRest.getAccessToken().then(function (token) {
      if (token.status === 200) {
        BootpayRest.cancel(req.body.receipt_id, req.body.refund_price, req.body.book_name, '집사부 예약 취소').then(function (response) {
          console.log(response)
          if (response.status === 200) {        

            let params = {pay_status : '취소', receipt_id : req.body.receipt_id}    
            UpdatePayStatus(params).then(result => {

              // - 잔여 예약 인원 업데이트
               let params1 = {uuid : req.body.uuid, time : req.body.book_time}
               if(req.body.mode === "VI") {
                  ViGetRemain(params1).then(result => {
                      let calcRemainGuest = Number(result[0].remain_guest) + Number(req.body.book_person);
                      let params2 = {
                        remain_guest : calcRemainGuest, uuid : req.body.uuid, time : req.body.book_time
                      }
                      ViUpdateBookRemain(params2).then(result => {
                      
                        res.json({cancel : 'cancelOK'});
                      
                      }).catch(function (err) {
                        console.log('[ViUpdateBookRemain] error :' + err);
                        res.json({cancel : 'cancelNOK'});
                      });
                  }).catch(function (err) {
                    console.log('[ViGetRemain] error :' + err);
                    res.json({cancel : 'cancelNOK'});
                  });
               } else if(req.body.mode === "SE") {
                  SeGetRemain(params1).then(result => {
                    let calcRemainGuest = Number(result[0].remain_guest) + Number(req.body.book_person);
                    let params2 = {
                      remain_guest : calcRemainGuest, uuid : req.body.uuid, time : req.body.book_time
                    }
                    SeUpdateBookRemain(params2).then(result => {
                    
                      res.json({cancel : 'cancelOK'});
                    
                    }).catch(function (err) {
                      console.log('[SeUpdateBookRemain] error :' + err);
                      res.json({cancel : 'cancelNOK'});
                    });
                  }).catch(function (err) {
                    console.log('[SeGetRemain] error :' + err);
                    res.json({cancel : 'cancelNOK'});
                  });               


               } else {
                 console.log('error mode : ' + req.body.mode)
                res.json({cancel : 'cancelNOK'});
               }

            }).catch(function (err) {
                console.log('[ViUpdateBookRemain] error :' + err);
                res.json({cancel : 'cancelNOK'});
            });
          } else {
            res.json({cancel : 'cancelNOK'});
          }
        });
      }
    });
});

// * [ 결제 검증 & 예약 업데이트 ] * //
router.post('/bootpay/verify', function(req, res, next) {  
    BootpayRest.setConfig(
      "5e38f1cb02f57e002f5c760f",
      "vVSYYK5G6wqql70Skiq4ZGUH7i4lNKphgjgnIjTCPqI="
    );
    BootpayRest.getAccessToken().then(function (response) {
      if (response.status === 200 && response.data.token !== undefined) {
        BootpayRest.verify(req.body.receipt_id).then(function (_response) {
          if (_response.status === 200) {
            if (_response.data.price === req.body.price && _response.data.status === 1) {
              
              // 예약DB 업데이트
              insertBooking(req.body.paydata).then(result => {
                let params = {
                  remain_guest : req.body.now_remain,
                  uuid : req.body.paydata.uuid,
                  time : req.body.paydata.book_time
                }
                // 잔여 예약 인원 업데이트
                if(req.body.mode === "VI") {
                  ViUpdateBookRemain(params).then(result => {
                    res.json({verify : 'verifyOK'});
                  }).catch(function (err) {
                      console.log('[ViUpdateBookRemain] error :' + err);
                      res.json({verify : 'verifyNOK'});
                  });
                } else if(req.body.mode === "SE") {
                  SeUpdateBookRemain(params).then(result => {
                    res.json({verify : 'verifyOK'});
                  }).catch(function (err) {
                      console.log('[ViUpdateBookRemain] error :' + err);
                      res.json({verify : 'verifyNOK'});
                  });
                } else {
                  res.json({verify : 'verifyNOK'});
                }

              }).catch(function (err) {
                console.log('[insertBooking] error :' + err);
                res.json({verify : 'verifyNOK'});
              });              

            } else {
              res.json({verify : 'verifyNOK'});
            }
          } else {
            res.json({verify : 'verifyNOK'});
          }
        });
      } else {
        res.json({verify : 'verifyNOK'});
      }
    });
});

module.exports = router;