Trick Nickel
============

A stupid jQuery plugin written to add classes to a footer element allowing it to be fixed via CSS, but never overlap content.

## Quick Start Guide
Include jQuery 1.6+ and jquery.trick-nickel.js to make the plugin available, then intialize a jQuery collection.

```JavaScript
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.trick-nickel.js"></script>
<script>
  $(document).ready(function(){
    $('footer').trickNickel();
  });
</script>
```

As the plugin applies no inline styles, you will also need to include the proper CSS for affixing the element to the bottom of the page based on the classes applied (`stuck` and `unstuck`, by default). Typically, it would be something along these lines:
```CSS
footer.stuck {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
```

## Plugin Defaults

```JavaScript
<script>
  $(document).ready(function(){
    $('footer').trickNickel({
      // (int)
      // pixel value to allow for leniency in the plugin calculation
      tolerance: 10,

      // (string)
      // class added when the element has been stuck
      stuck_class: 'stuck',

      // (string)
      // class added when the element has been unstuck
      unstuck_class: 'unstuck',

      // (int | function | jQuery object)
      // Three available types:
      // - int: static height in pixels
      // - function: must return a value (the initializing element is passed as a function argument)
      // - jQuery element: outerHeight() will be used to calculate the elements height
      footer_height: function ($element) { 
        return $element.outerHeight();
      },

      // (function)
      // this is our proxy wrapper function that will call the plugin logic. this is provided to allow for the inclusion 
      // of a throttle/debounce function, if desired.
      proxy: function (check) { 
        check.call(this);
      }
    });
  });
</script>
```

## Runtime options
Advanced options can be specified by either passing a JavaScript configuration object to the initialized jQuery collection, or by setting the `data-trick-nickel-options` attribute on the element.

## Throttle example
Here is an example of passing a throttled proxy function via the [Underscore.js](http://underscorejs.org/) `_.throttle` [function](http://underscorejs.org/#throttle) to lessen the frequency of firing the height calculations on the resize event. This is a recommended practice to not overtax the browser when resizing.

```JavaScript
<script>
  $(document).ready(function(){
    $('footer').trickNickel({
      proxy: _.throttle(
        function stickyFooterThrottle (check) {
          check.call(this);
        },
        250)
    });
</script>
```

## Changelog
__v1.0.0__ (2013-11-28)

- Initial release