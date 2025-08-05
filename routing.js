// Version: c7ca913
(function(global) {
  const Routing = {
    init: function() {
      // Inject styles if not already present
      Routing.injectStyles();

      Routing.doRouteCheck(); // This will cause our routing to occur right away
    },

    getActualKeysIncludingRouteValues :function() {
      const params = new URLSearchParams(window.location.search);
      const keys = new Set();
    
      for (const key of params.keys()) {
        keys.add(key);
      }
    
      // If "route" param exists, add its value(s) too (handle multiple?)
      if (params.has('route')) {
        const routeValues = params.getAll('route'); // getAll in case of multiple 'route' keys
        for (const val of routeValues) {
          keys.add(val);
        }
      }
    
      return keys;
    },

    doRouteCheck: function (){
      // Step 1: Get the Query string
      // Step 2: Assemble our list of "routeIdentifiers" to check
      // Step 3: Search our elements for 'fjs-route' attrbiute
      document.querySelectorAll('[fjs-route').forEach(el => {
        const routeId = el.getAttribute('fjs-route');
      // Step 4: For each that match any of the indentifiers, set them to active. Any that don't set to inactive
      // NOTE: I originally intended to have an order here, but I'm just going to go with chaos.  
      if(Routing.isRouteMatch(routeId)){
          // Step 6: For those being deactivated, call thier function if it exists.
          // Activate
          Routing.activateElement(el);
        }else{
          // Step 5: For those being inactivated, call thier function if it exists.
          // Deactivate
          Routing.deactivateElement(el);
        }
      });
    },

    isRouteMatch: function (routeAttr){
      const actualKeys = Routing.getActualKeysIncludingRouteValues()
      const requiredKeys = routeAttr.split(',').map(k => k.trim()).filter(Boolean);
      // Check all required keys exist in actual keys
      return requiredKeys.every(k => actualKeys.has(k));
    },
    
    activateElement: function(el){
        el.classList.remove('fjs-route-inactive');
        el.classList.add('fjs-route-active');

        const id = el.id;
        const activateFn = window[`${id}_activate`];
        if (typeof activateFn === 'function') {
          activateFn();
        }
    },
    deactivateElement: function(el){
      el.classList.add('fjs-route-inactive');
      el.classList.remove('fjs-route-active');

      const id = el.id;
      const deactivateFn = window[`${id}_deactivate`];
      if (typeof activateFn === 'function') {
        deactivateFn();
      }
    },

    injectStyles: function(){
      if (!document.getElementById('fjs-routing-style')) {
        const style = document.createElement('style');
        style.id = 'fjs-routing-style';
        style.textContent = `
          .fjs-route-active {}
          .fjs-route-inactive {
            display: none;
		        }
        `;
        document.head.appendChild(style);
      }
    }
   
  };

  global.fjs = global.fjs || {};
  global.fjs.Routing = Routing;
  
  if (document.readyState !== 'loading') {
    Routing.init();
  } else {
    document.addEventListener('DOMContentLoaded', Routing.init);
  }
})(window);

