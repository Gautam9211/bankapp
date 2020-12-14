var express = require('express');
var User = require('../models/register');
var mongoose = require('mongoose');
var userdata;

/* Get member page. */
app.get('/', function(req, res, next) {
  if(req.cookies.logged){
    var uid = req.cookies.logged;
    var query = User.findOne({ '_id' : uid });
    query.select('name email money card image_url');
    query.exec(function (err, user) {
    if (err) return handleError(err);
      userdata=user;
      res.render('member', { userdata: user, title: 'member', action:'MAIN' });
    });
  } else {
    res.redirect('/login');
  }
});
app.get('/withdraw', function(req, res, next) {
  res.render('member', { action: 'WITHDRAW', userdata: userdata, title: 'Withdraw' });
});
app.get('/deposit', function(req, res, next) {
  res.render('member', { action: 'DEPOSIT', userdata: userdata, title: 'Deposit' });
});
app.get('/logout', function(req, res, next) {
  res.clearCookie("logged");
  res.redirect('/login');
});
app.get('/transact', function(req, res, next) {
  res.send('it goes to get');
});
app.post('/transact', function(req, res, next) {
  console.log('transact working');
  var amount = req.body.amount;
  var action = req.body.action;
  console.log(amount+''+action);
    if(action=='DEPOSIT'){
      var newAmount = (parseInt(amount) + parseInt(userdata.money)).toString();
      var deposit = User.updateOne(
      { $set: { 'money' : newAmount } }
      );
      deposit.exec(function (err, result) {
      if (err) return handleError(err);
        console.log(result);
      });
    };
    if(action=='WITHDRAW'){
      var newAmount = parseInt(userdata.money) - parseInt(amount);
      if(newAmount<0){res.redirect('/member'); return;}
      var withdraw = User.updateOne(
      { $set: { 'money' : newAmount } }
      );
      withdraw.exec(function (err, result) {
      if (err) return handleError(err);
        console.log(result);
      });
    };
    res.redirect('/member');
});
module.exports = router;
