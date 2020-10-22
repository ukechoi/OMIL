module.exports = (function () {
    return {
      local: { // localhost
        host: 'localhost',
        port: '3307',
        user: '',
        password: '',
        database: ''
      },
      real: { // real server db info
        host: 'ec2-13-125-205-18.ap-northeast-2.compute.amazonaws.com',
        port: '3306',
        user: 'labis',
        password: 'labis0423',
        database: 'ZIBSABOO'
      },
      dev: { // dev server db info
        host: '1.227.53.88',
        port: '3307',
        user: 'labis',
        password: '12345678',
        database: 'strapi'
      }
    }
  })();