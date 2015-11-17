'use strict';

angular.module('nettineuvoja')

    .service('KutiService', function ($http, $log, DEBUG, apiService) {
        this.getSessionId = function () {
            return apiService.getSessionId()
                .then(function (response) {
                    if (DEBUG) {
                        $log.debug('Received session ID from Kuti', response.data.sessionId);
                    }
                    return response.data.sessionId;
                }, function (response) {
                    if (DEBUG) {
                        $log.error('Failed to get session ID from Kuti', response);
                    }
                });
        };

        this.saveSession = function (session) {
            return apiService.saveSession(session)
                .then(function (response) {
                    if (DEBUG) {
                        $log.debug('Session saved to Kuti', session, response);
                    }
                }, function (response) {
                    if (DEBUG) {
                        $log.error('Failed to save session to Kuti', response);
                    }
                });
        };

        this.changeSlide = function (from, to, session) {
            //if (DEBUG) {
            //    $log.debug('Sent slide transition to the Kuti API ' + from + ' -> ' + to);
            //}
            //return apiService.changeSlide(from, to, session);
        };
    });
