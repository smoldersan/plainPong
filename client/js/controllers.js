'use strict';

angular.module('plainPongApp').controller('ModalNameCtrl', function ($scope, $modalInstance) {
    $scope.keyPressed = function (keyEvent, initNameInput) {
        if (keyEvent.charCode == 13 && !keyEvent.shiftKey) {
            keyEvent.preventDefault();
            $modalInstance.close(initNameInput);
        }
    };
});

angular.module('plainPongApp').controller('AppCtrl',
    ['$scope', '$rootScope', '$log', '$modal', 'socket',
        function ($scope, $rootScope, $log, $modal, socket) {
            $scope.chatTextarea = '';

            //var modalInstance = $modal.open({
            //    animation: true,
            //    templateUrl: 'client/views/nameModal.html',
            //    controller: 'ModalNameCtrl'
            //});
            //modalInstance.result.then(function (initNameInput) {
            //    $scope.changeName(initNameInput);
            //});

            var addToChatBox = function(message) {
                $scope.chatTextarea = $scope.chatTextarea + message + '\n';

                // Force scroll down
                var textarea = document.getElementById('chat_textarea');
                textarea.scrollTop = textarea.scrollHeight;
            };

            var changeName = function (oldName, newName) {
                $scope.users[oldName].name = newName;
                $scope.users[newName] = $scope.users[oldName];
                delete $scope.users[oldName];
                addToChatBox('User ' + oldName + ' is now known as ' + newName + '.');
            };

            // User connection feedback
            socket.on('init', function(data) {
                $scope.curUser = data.user;
                $scope.users = data.users;
                $log.info($scope.users);
            });
            socket.on('server:info', addToChatBox);
            socket.on('send:message', addToChatBox);
            socket.on('user:join', function(data) {
                addToChatBox('User ' + data.user.name + ' has joined');
                $scope.users[data.user.name] = data.user
            });
            socket.on('user:left', function(data) {
                addToChatBox('User ' + data.name + ' leaved');
                delete $scope.users[data.name];
            });
            socket.on('change:name', function (data) {
                changeName(data.oldName, data.newName);
            });

            $scope.sendMessage = function() {
                socket.emit('send:message', $scope.chatInput);
                $scope.chatInput = '';
                $('#chat_input').focus();
            };

            $scope.changeName = function (newName) {
                socket.emit('change:name', {
                    name: newName
                }, function (result) {
                    if (!result) {
                        alert('There was an error changing your name');
                    } else {
                        changeName($scope.curUser.name, newName);

                        $scope.curUser.name = newName;
                        $scope.nameInput = '';
                    }
                });
            };

            $scope.challengeUser = function (user) {
                socket.emit('user:challenge', user);
            };

            // Send message with enter
            $("#chat_form").submit(function() { return false; });
            $("#chat_input").bind('keyup', function(event){
                if(event.keyCode == 13){
                    $scope.sendMessage();
                    return false;
                }
            });
            // Validate name with enter
            $("#name_form").submit(function() { return false; });
            $("#name_input").bind('keyup', function(event){
                if(event.keyCode == 13){
                    $scope.changeName($scope.nameInput);
                    return false;
                }
            });
        }
    ]);