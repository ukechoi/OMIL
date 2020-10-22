const express = require('express');
const router = express.Router();
const db = require('../config/db_connection')();
const ListTableName = "study_list"
const CommentTableName = "study_comment"
const FilterTableName = "filters"


/* -------------- ::START:: API Function Zone -------------- */


// * [ 스터디 리스트 - 최신순 ] * //
function getAllList() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + ListTableName + " ORDER BY create_at DESC", [], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 스터디 리스트 - 인기순 ] * //
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

// * [ 스터디 생성 하기 ] * //
function insertStudy(params) {
  return new Promise(function (resolve, reject) {
    db.query("insert into "+ ListTableName + " SET ?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 스터디 수정 하기 ] * //
function updateStudy(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + ListTableName +" SET title=?, content=?, max_person=?, kakao_url=?, kakao_code=? WHERE uuid=?", 
    [params.title, params.content, params.max_person, params.kakao_url, params.kakao_code, params.uuid], function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 스터디 삭제 하기 ] * //
function delStudy(params) {
  return new Promise(function (resolve, reject) {
    db.query("DELETE FROM " + ListTableName + " WHERE uuid=?", params.uuid, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 스터디 상세정보 조회수 업데이트 ] * //
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





// * [ 댓글 갯수 더하기 업데이트 ] * //
function updateStudyCommentPlus(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + ListTableName + " SET comment_count=comment_count+1 WHERE uuid=?", params.uuid, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 댓글 갯수 빼기 업데이트 ] * //
function updateStudyCommentMinus(params) {
  return new Promise(function (resolve, reject) {
    db.query("UPDATE " + ListTableName + " SET comment_count=comment_count-1 WHERE uuid=?", params.uuid, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


// * [ 댓글 리스트 ] * //
function getStudyComment(params) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM " + CommentTableName + " WHERE uuid=? ORDER BY create_at DESC", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 댓글 생성 하기 ] * //
function insertComment(params) {
  return new Promise(function (resolve, reject) {
    db.query("insert into "+ CommentTableName + " SET ?", params, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 댓글 삭제 하기 - 특정ID ] * //
function delCommentById(params) {
  return new Promise(function (resolve, reject) {
    db.query("DELETE FROM " + CommentTableName + " WHERE id=?", params.id, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// * [ 댓글 삭제 하기 - 전체 uuid ] * //
function delCommentByUuid(params) {
  return new Promise(function (resolve, reject) {
    db.query("DELETE FROM " + CommentTableName + " WHERE uuid=?", params.uuid, function (err, result) {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
}


/* -------------- ::START:: Router Zone -------------- */

// * [ 스터디 리스트 - 최신순 ] * //
router.get('/', function(req, res, next) {
  getAllList().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllList] error :' + err);
    res.end('NOK');
  });
});

// * [ 스터디 리스트 - 인기순 ] * //
router.get('/like', function(req, res, next) {
  getAllListLike().then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getAllListLike] error :' + err);
    res.end('NOK');
  });
});

// * [ 스터디 생성 하기 ] * //
router.post('/create', function(req, res, next) {
  console.log(req.body);
  insertStudy(req.body).then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[insertStudy] error :' + err);
    res.end('NOK');
  });
});

// * [ 스터디 수정 하기 ] * //
router.post('/update', function(req, res, next) {
  console.log(req.body);
  updateStudy(req.body).then(result => {
    res.end('OK');
  }).catch(function (err) {
    console.log('[updateStudy] error :' + err);
    res.end('NOK');
  });
});

// * [ 스터디 삭제 하기 ] * //
router.post('/delete', function(req, res, next) {
  delStudy(req.body).then(result => {
    delCommentByUuid(req.body).then(result => {
      res.end('OK');
    }).catch(function (err) {
      console.log('[delCommentByUuid] error :' + err);
      res.end('NOK');
    });
  }).catch(function (err) {
    console.log('[delStudy] error :' + err);
    res.end('NOK');
  });
});

// * [ 스터디 조회수 업데이트 ] * //
router.get('/viewcount/:uuid', function (req, res) {
  updateViewCount(req.params.uuid).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[updateViewCount] error :' + err);
    res.end('NOK');
  });
});








// * [ 관련 댓글 리스트 ] * //
router.get('/comment/:uuid', function (req, res) {
  getStudyComment(req.params.uuid).then(result => {
    res.json(result);
  }).catch(function (err) {
    console.log('[getStudyComment] error :' + err);
    res.end('NOK');
  });
});

// * [ 댓글 생성 하기 ] * //
router.post('/comment/create', function(req, res, next) {
  console.log(req.body);
  insertComment(req.body).then(result => {
    updateStudyCommentPlus(req.body).then(result => {
      res.end('OK');
    }).catch(function (err) {
      console.log('[updateStudyCommentPlus] error :' + err);
      res.end('NOK');
    });
  }).catch(function (err) {
    console.log('[insertComment] error :' + err);
    res.end('NOK');
  });
});

// * [ 댓글 삭제 하기 ] * //
router.post('/comment/delete', function(req, res, next) {
  delCommentById(req.body).then(result => {
    updateStudyCommentMinus(req.body).then(result => {
      res.end('OK');
    }).catch(function (err) {
      console.log('[updateStudyCommentMinus] error :' + err);
      res.end('NOK');
    });
  }).catch(function (err) {
    console.log('[delCommentById] error :' + err);
    res.end('NOK');
  });
});


module.exports = router;