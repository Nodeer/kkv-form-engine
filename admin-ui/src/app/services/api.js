'use strict';

angular.module('nnAdmin')

    .service('ApiService', function ($http, API_URL) {
        this.getSlides = function () {
            return $http.get(this.createUrl('slides'));
        };

        this.createSlide = function (slide) {
            return $http.post(this.createUrl('slides'), slide);
        };

        this.saveSlide = function (id, slide) {
            return $http.put(this.createUrl('slides/' + id), slide);
        };

        this.removeSlide = function (id) {
            return $http.delete(this.createUrl('slides/' + id));
        };

        this.saveSlideOrder = function (data) {
            return $http.post(this.createUrl('slides/update_order'), data);
        };

        this.autocomplete = function (source) {
            return $http.post(this.createUrl('autocomplete'), { source: source });
        };

        this.createUrl = function (action) {
            return API_URL + '/' + action;
        };
    });
