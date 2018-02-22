"use strict";

var path = require('path');
var fs = require('fs');

module.exports = {
    $router:'',
    '/hapi/groups': function(req, res) {
        res.sendFile(path.join(__dirname, './getAllGroups.json'));
    },
    '/hapi/group/create': function(req, res){
        res.json({"success": true});
    },
    '/hapi/group/getGroupInfoById': function(req, res) {
        res.sendFile(path.join(__dirname, './getGroupInfo.json'));
    },
    '/group/create': function(req, res){
        res.json({"success": true});
    }
}