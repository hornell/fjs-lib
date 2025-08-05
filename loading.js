// Version: 0f68741
(function(global) {
  const Loading = {
    init: function() {
      // Inject styles if not already present
      if (!document.getElementById('fjs-loading-style')) {
        const style = document.createElement('style');
        style.id = 'fjs-loading-style';
        style.textContent = `
		    .fjs-loader-content {
    position: relative;
  }

  .loading::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    margin: -16px 0 0 -16px;
    border: 4px solid #ccc;
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 1000;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading > * {
    opacity: 0.0;
    pointer-events: none;
  }
        `;
        document.head.appendChild(style);
      }

      document.querySelectorAll('.fjs-loader').forEach(elem => {
          if (!elem.querySelector('.fjs-loader-content')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'fjs-loader-content loading';
      			// Move all existing children into the wrapper
      			while (elem.firstChild) {
				      wrapper.appendChild(elem.firstChild);
			      }
		  	    elem.appendChild(wrapper);
		      }


      });
    },

    set_visible_by_signal: function(signal, visible){
      document.querySelectorAll('.fjs-loader').forEach(elem => {
        const loaderSignal = elem.getAttribute('fjs-load-wait');
        const signalMatches = signal === loaderSignal || (!signal && !loaderSignal);

        const container = elem.querySelector('.fjs-loader-content');

        if(signalMatches){
          if(visible){
            container.classList.remove('loading');
          }else{
            container.classList.add('loading');
          }
        }
      });
    },
    
    signal_loading: function(signal){
      Loading.set_visible_by_signal(signal, false);
    },

    stop_loading: function(signal){
      Loading.set_visible_by_signal(signal, true);
    },

    start_loading: async function(f, signal = null) {
      Loading.signal_loading(signal);
      try{
        await f();
      }
      finally{
        Loading.stop_loading(signal);
      }
    }
    
  };

  global.fjs = global.fjs || {};
  global.fjs.Loading = Loading;

  if (document.readyState !== 'loading') {
    Loading.init();
  } else {
    document.addEventListener('DOMContentLoaded', Loading.init);
  }
})(window);

