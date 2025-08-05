// Version: 0f68741
(function(global) {
  const HelloWorld = {
    init: function() {
      document.querySelectorAll('.fjs-hello').forEach(el => {
        el.textContent = 'Hello World';
      });
    }
  };

  global.fjs = global.fjs || {};
  global.fjs.HelloWorld = HelloWorld;

  // Run after DOM ready
  if (document.readyState !== 'loading') {
    HelloWorld.init();
  } else {
    document.addEventListener('DOMContentLoaded', HelloWorld.init);
  }
})(window);
