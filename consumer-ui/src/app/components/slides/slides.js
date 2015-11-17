angular.module('nettineuvoja')
  .constant('SlideState', {
    DIRTY: 'dirty',
    SAVING: 'saving',
    CLEAN: 'clean'
  })
  .factory('slideSerializer', function() {
    /**
     *
     * @param {Model} slide
     * @returns {Model}
     */
    function deserialize(slide) {
      var data = angular.copy(slide);

      data.save_after = slide.save_after === 1;
      data.summary_after = slide.summary_after === 1;
      data.exclude_from_summary = slide.exclude_from_summary === 1;

      return data;
    }

    return {
      deserialize: deserialize
    };
  })
  .factory('slideService', function($log, $rootScope, $q, $modal, resourceServiceFactory, slideSerializer) {
    var _slides = [];

    return resourceServiceFactory('slides', {
      afterResponse: function(data) {
        if (!data.data) {
          return data;
        }

        if (angular.isArray(data.data)) {
          var transform = [];

          angular.forEach(data.data, function(item) {
            transform.push(slideSerializer.deserialize(item));
          });

          return transform;
        } else {
          return slideSerializer.deserialize(data.data);
        }
      }
    }, {
      /**
       *
       */
      openAddModal: function() {
        $modal.open({
          templateUrl: 'components/slides/add/add.html',
          controller: 'AddSlideModalCtrl'
        });
      },
      /**
       *
       * @returns {array}
       */
      load: function() {
        return this.query()
          .then(function(response) {
            _slides = response.data;
          });
      },
      /**
       *
       * @param {string} name
       * @returns {object|null}
       */
      getByName: function(name) {
        var result = null;

        angular.forEach(_slides, function(slide) {
          if (slide.name === name) {
            result = slide;
          }
        });

        return result;
      }
    });
  });
