var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var request = require('request');
var querystring = require('querystring');

// -- ETC SETTING ZONE --//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -- API ROUTER ZONE --//
var visitRouter = require('./routes/visit');
var seminarRouter = require('./routes/seminar');
var studyRouter = require('./routes/study');
var newsRouter = require('./routes/news');
var myinfoRouter = require('./routes/myinfo');
var historyRouter = require('./routes/history');
var userRouter = require('./routes/user');
var payRouter = require('./routes/pay');

app.use('/api/user', userRouter);
app.use('/api/visit', visitRouter);
app.use('/api/seminar', seminarRouter);
app.use('/api/study', studyRouter);
app.use('/api/news', newsRouter);
app.use('/api/myinfo', myinfoRouter);
app.use('/api/history', historyRouter);
app.use('/api/pay', payRouter);

// -- EXTERNAL API ZONE --//
var snsAuthRouter = require('./routes/snsauth');
app.use('/api/sns', snsAuthRouter);

app.use(express.static( './public/static'));
app.use('/', express.static(path.join(__dirname, './public/index.html')));

app.get('*', (req, res, next) => {
  if (req.path.split('/')[1] === 'static')
    return next();
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});






/*
// -- FRONT WEB ZONE (이니시스) -- //
app.post('/pay', (req, res, next) => {

try {
      console.log(req.body)
      console.log("STATUS : " + req.body.P_STATUS)

      if(req.body.P_STATUS === '00') {

        // [ INIPay 카드 승인 요청 하기 ] //
        const INIPay = req.body;
        const option = { P_TID : INIPay.P_TID, P_MID : 'INIpayTest' };
        const params = querystring.stringify(option);
        console.log(INIPay.P_REQ_URL + "?" + params)
        
        request.post({
          url : INIPay.P_REQ_URL + "?" + params
        }, function(error, response, body) {
          console.error('error : ', error);
          console.log('statusCode : ', response && response.statusCode); 
          console.log('body : ', body);

          let payOrderID = req.body.P_NOTI;
          let payTID = req.body.P_TID;
          let parsedBody = querystring.parse(body,'&','=');   
          let urlMode = req.protocol + '://' + req.get('host') + "/api/pay/visit/status/update"
          if(payOrderID.indexOf("VI") === -1) {
            urlMode = "/api/pay/seminar/status/update"
          }

          console.log('parsedBody : ', parsedBody);   

          if(parsedBody.P_STATUS === '00') { // 결제 성공
            console.log('Pay Success')

            let bookinfo = payOrderID.split('_');
            request.post({url : urlMode,    // 결제 성공 상태 업데이트
              form: {
                pay_status : '완료',
                pay_tid : payTID,
                pay_order_id : payOrderID

              }
            },function(error, response, body) {
              console.error('error : ', error);
              console.log('body : ', body);
              if(error !== 'null') {
                let mUrl = req.protocol + '://' + req.get('host') + "/api/pay/visit/remain/update"
                if(payOrderID.indexOf("VI") === -1) {
                  mUrl = "/api/pay/seminar/remain/update"
                }
                request.post({url : mUrl,   // 잔여 예약 인원 업데이트
                  form: {
                    uuid : bookinfo[1],
                    time : bookinfo[2],
                    book_people : bookinfo[3]                
                  }
                },function(error, response, body) {
                  console.error('error : ', error);
                  console.log('body : ', body);              
                  res.writeHead(301,{Location: '/pay/done'}); // 결제 성공
                  res.end();
                });
              } else {
                res.writeHead(301,{Location: '/pay/error'});
                res.end();
              }

            });
        } else {                           // 결제 실패
          console.log('Pay Fail')
          request.post({  
            url : urlMode,
            form: {
              pay_status : '실패',
              pay_order_id : payOrderID
            }
          },function(error, response, body) {
            console.error('error : ', error);
            res.writeHead(301,{Location: '/pay/error'});
            res.end();
          });
        }
        });

      } else { // (사용자) 결제 취소
        console.log('Apply NOK, Cancel.');

        let payOrderID = req.body.P_NOTI;
        let urlMode = req.protocol + '://' + req.get('host') + "/api/pay/visit/status/update"
        if(payOrderID.indexOf("VI") === -1) {
          urlMode = "/api/pay/seminar/status/update"
        }
        request.post({  
          url : urlMode,
          form: {
            pay_status : '취소',
            pay_order_id : payOrderID
          }
        },function(error, response, body) {
          console.error('error : ', error);
          res.writeHead(301,{Location: '/pay/cancel'});
          res.end();
        });      
      }

    } catch(error) {
      console.error('error : ', error);
      res.writeHead(301,{Location: '/pay/error'});
      res.end();
    }

});
*/



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
