const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const db = require('../config/db_connection')();
const UserTableName = "users";


/* -------------- ::START:: API Function Zone -------------- */

// -- 네이버 API
function getNaverToken(param) {
    return new Promise(function (resolve, reject) {
      var api = 'https://nid.naver.com/oauth2.0/token';
      var queryParams = '?' + encodeURIComponent('grant_type') + '=' + encodeURIComponent(param.grant_type); 
      queryParams += '&' + encodeURIComponent('client_id') + '=' + encodeURIComponent(param.client_id); 
      queryParams += '&' + encodeURIComponent('client_secret') + '=' + encodeURIComponent(param.client_secret);
      queryParams += '&' + encodeURIComponent('code') + '=' + encodeURIComponent(param.code);
      queryParams += '&' + encodeURIComponent('state') + '=' + encodeURIComponent(param.state); 
    
      const reqUrl = api + queryParams;
      const data = fetch(reqUrl, {
        credentials: 'include'  
      })
      .then(item => item.json())
      .catch(err => console.log('[getNaverToken] ' + err));
  
      resolve(data);
    });  
};
function getNaverUserInfo(token) {
    return new Promise(function (resolve, reject) {
        const reqUrl = "https://openapi.naver.com/v1/nid/me"
        const data = fetch(reqUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        }).then(data => data.json()).catch(err => console.log('[getNaverUserInfo #1] ' + err));
        resolve(data);
    });  
};



// -- 카카오 API
function getKakaoToken(param) {
    return new Promise(function (resolve, reject) {
      var api = 'https://kauth.kakao.com/oauth/token';
      var queryParams = '?' + encodeURIComponent('grant_type') + '=' + encodeURIComponent(param.grant_type); 
      queryParams += '&' + encodeURIComponent('client_id') + '=' + encodeURIComponent(param.client_id); 
      queryParams += '&' + encodeURIComponent('redirect_uri') + '=' + encodeURIComponent(param.redirect_uri);
      queryParams += '&' + encodeURIComponent('code') + '=' + encodeURIComponent(param.code); 
    
      const reqUrl = api + queryParams;
      const data = fetch(reqUrl, {
        credentials: 'include'  
      })
      .then(item => item.json())
      .catch(err => console.log('[getKakaoToken] ' + err));
  
      resolve(data);
    });  
};
function getKaKaoUserInfo(token) {
    return new Promise(function (resolve, reject) {
        const reqUrl = "https://kapi.kakao.com/v2/user/me"
        const data = fetch(reqUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        }).then(data => data.json()).catch(err => console.log('[getKaKaoUserInfo #1] ' + err));
        resolve(data);
    });  
};




// -- ZIBSABOO DB
function addOrUpUser(params) {
    return new Promise(function (resolve, reject) {
      db.query("INSERT INTO " + UserTableName + " SET ? ON DUPLICATE KEY UPDATE ? ", params, function (err, result) {
        if(err) {
          reject(err);
        }
        resolve(result);
      });
    });
}

function getUserInfo(params) {
    return new Promise(function (resolve, reject) {
        db.query("SELECT * FROM " + UserTableName + " WHERE email=? AND type=?", params, function (err, result) {
        if(err) {
            reject(err);
        }
        resolve(result);
        });
    });
}

// - 직접 회원가입
function addNewUser(params) {
    return new Promise(function (resolve, reject) {
      db.query("insert into "+ UserTableName + " SET ?", params, function (err, result) {
        if(err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
  



/* -------------- ::START:: Router Zone -------------- */

// * ------------------- 직접 회원가입 ------------------- * //
router.post('/join', function(req, res, next) {
    addNewUser(req.body).then(result => {
      res.end('OK');
    }).catch(function (err) {
      console.log('[addNewUser] error :' + err);
      res.end('NOK');
    });
});


// * ------------------- 네이버 팀 ------------------- * //
// * [ 사용자 정보 가져오기 ] * //
router.post('/naver/user/me', function(req, res, next) {

    // - 01 Token 요청
    getNaverToken(req.body).then(result => {
        
        // - 02 네이버 사용자 정보
        let nToken = result.access_token;
        getNaverUserInfo(nToken).then(result => {  
            console.log('[NAVER]-GET-USER-INFO')                              
            console.log(result)

            // - 03 사용자 DB 추가 / 업데이트
            let uInfo = {
                email : result.response.email,
                type : 'naver',
                nickname : result.response.nickname,
                realname : result.response.name,
                profile : result.response.profile_image,
                token : nToken,
                islogin : '1'
            }
            let uInfo_update = {
                nickname : result.response.nickname,
                realname : result.response.name,
                profile : result.response.profile_image,
                token : nToken,
                islogin : '1'
            }

            let params1 = [uInfo, uInfo_update]
            let params2 = [result.response.email, uInfo.type]
            addOrUpUser(params1).then(result => {   
                // - 04 결과 리턴 
                getUserInfo(params2).then(result => {
                    res.json(result);
                }).catch(function (err) {
                    console.log('[getUserInfo] error :' + err);
                    res.json({result : 'NOK'});
                });
            }).catch(function (err) {
                console.log('[addOrUpUser] error :' + err);
                res.json({result : 'NOK'});
            });

        }).catch(function (err) {
            console.log('[getNaverUserInfo #2] error :' + err);
            res.json({result : 'NOK'});
        });
        

    }).catch(function (err) {
        console.log('[getNaverToken] error :' + err);
        res.json({result : 'NOK'});
    });
});





// * ------------------- 카카오 팀 ------------------- * //
// * [ 토큰 가져오기 ] * //
router.post('/oauth/token', function(req, res, next) {
    getKakaoToken(req.body).then(result => {
        res.json(result);
    }).catch(function (err) {
        console.log('[getKakaoToken] error :' + err);
        res.end('NOK');
    });
});

// * [ 사용자 정보 가져오기 ] * //
router.post('/kakao/user/me', function(req, res, next) {

    // - 01 Token 요청
    getKakaoToken(req.body).then(result => {
        
        // - 02 카카오 사용자 정보
        let kToken = result.access_token;
        getKaKaoUserInfo(kToken).then(result => {        
            console.log('[KAKAO]-GET-USER-INFO')   
            console.log(result)

            // - 03 사용자 DB 추가 / 업데이트
            let uInfo = {
                email : result.kakao_account.email,
                type : 'kakao',
                nickname : result.kakao_account.profile.nickname,
                realname : result.properties.nickname,
                profile : result.kakao_account.profile.thumbnail_image_url,
                token : kToken,
                islogin : '1'
            }
            let uInfo_update = {
                nickname : result.kakao_account.profile.nickname,
                realname : result.properties.nickname,
                profile : result.kakao_account.profile.thumbnail_image_url,
                token : kToken,
                islogin : '1'
            }

            let params1 = [uInfo, uInfo_update]
            let params2 = [result.kakao_account.email, uInfo.type]
            addOrUpUser(params1).then(result => {   
                // - 04 결과 리턴 
                getUserInfo(params2).then(result => {
                    res.json(result);
                }).catch(function (err) {
                    console.log('[getUserInfo] error :' + err);
                    res.json({result : 'NOK'});
                });
            }).catch(function (err) {
                console.log('[addOrUpUser] error :' + err);
                res.json({result : 'NOK'});
            });

        }).catch(function (err) {
            console.log('[getKaKaoUserInfo #2] error :' + err);
            res.json({result : 'NOK'});
        });
    }).catch(function (err) {
        console.log('[getKakaoToken] error :' + err);
        res.json({result : 'NOK'});
    });
});

module.exports = router;