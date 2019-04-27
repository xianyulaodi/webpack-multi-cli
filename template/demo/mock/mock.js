 const Mock = require('mockjs');

 Mock.mock('/test', /post|get/i, {
   text: 'welcome to wepack multi cli'
 });
