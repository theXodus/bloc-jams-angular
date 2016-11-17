(function(){
  function seekBar($document) {

    /**
    * @function calculatePercent
    * @desc Calculates the horizontal percent along the seek bar where the event occurred
    */
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    return {
      templateUrl: '/templates/directives/seek_bar.html',
      replace: true,
      restrict: 'E',
      scope: {
        onChange: '&'
      },
      link: function(scope, element, attributes) {

        /**
        * @desc Holds the value of the seek bar
        */
        scope.value = 0;
        /**
        * @desc Holds the maximum value of the song and volume seek bars
        */
        scope.max = 100;

        /**
        * @desc Holds the element that matches the directive as jQuery object
        */
        var seekBar = $(element);

        /**
        * @desc watches the attribute 'value' and assigns newValue if changed.
        * used to find the position of the seek bar thumb and playback position.
        */
        attributes.$observe('value', function(newValue) {
          scope.value = newValue;
        });

        /**
        * @desc watches the attribute 'max' and assigns newValue if changed.
        */
        attributes.$observe('max', function(newValue) {
          scope.max = newValue;
        });

        /**
        * @function percentString
        * @desc calculates a percent based on the value and maximum value of a seek bar
        */
        var percentString = function() {
          var value = scope.value;
          var max = scope.max;
          var percent = value / max * 100;
          return percent + "%";
        };

        /**
        * @function fillStyle
        * @desc Returns the width of the seek bar fill element based on the calculated percent
        */
        scope.fillStyle = function() {
          return {width: percentString()};
        };

        scope.thumbStyle = function() {
          return {left: percentString()};
        };

        /**
        * @function scope.onClickSeekBar
        * @desc Updates the seek bar value based on the seek bar's width and
        *       the location of the user's click on the seek bar
        */
        scope.onClickSeekBar = function(event) {
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
          notifyOnChange(scope.value);
        };

        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event) {
            var percent = calculatePercent(seekBar, event);
            scope.$apply(function() {
              scope.value = percent * scope.max;
              notifyOnChange(scope.value);
            });
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        };

        var notifyOnChange = function(newValue) {
          if (typeof scope.onChange === 'function') {
            scope.onChange({value: newValue});
          }
        };
      }
    };
  }

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();
