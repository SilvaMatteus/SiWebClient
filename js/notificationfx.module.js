angular.module('notification.fx', []).factory('notificationFactory', function() {
    var notification = function(message, type, actionClose) {
        var notfy = new NotificationFx({
            message : '<span class="icon fa fa-bullhorn fa-2x"></span><p><b>' + message + '</b>',
            layout : 'bar',
            effect : 'slidetop',
            type : type,
            onClose : actionClose,
            ttl: 2500
        });
        notfy.show();
    }
    return {
        showSuccess: function(message, actionClose) {
            notification(message, "success", actionClose);
        },
        showError: function(message, actionClose) {
            notification(message, "error", actionClose);
        },
        showWarning: function(message, actionClose) {
            notification(message, "warning", actionClose);
        },
        showInfo: function(message, actionClose) {
            notification(message, "notice", actionClose);
        }
    };
});
