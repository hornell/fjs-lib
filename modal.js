// Version: 82c3eae
(function(global) {
  const Modal = {
    hide_modal: function(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('modal-hidden');
        modal.classList.remove('modal-shown');
      } else {
        console.warn(`Modal with ID '${id}' not found`);
      }
    },
    
    init: function() {
      // Inject modal styles if not already present
      if (!document.getElementById('fjs-modal-style')) {
        const style = document.createElement('style');
        style.id = 'fjs-modal-style';
        style.textContent = `
		.modal-hidden {
		    display: none;
		}

		.modal-shown {
    			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			inset: 0;
    			z-index: 1000;
			background: rgba(0, 0, 0, 0.5);
  		}

		.fjs-modal-content {
			background: white;
			padding: 1.5em;
			border-radius: 8px;
			max-width: 90%;
			max-height: 90%;
			overflow: auto;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		}
	`;
        document.head.appendChild(style);
      }

	document.querySelectorAll('.fjs-modal').forEach(modal => {
	
		// Wrap contents in .fjs-modal-content if not already wrapped
		if (!modal.querySelector('.fjs-modal-content')) {
			const wrapper = document.createElement('div');
			wrapper.className = 'fjs-modal-content';

			// Move all existing children into the wrapper
			while (modal.firstChild) {
				wrapper.appendChild(modal.firstChild);
			}

			modal.appendChild(wrapper);
		}
	
	    Modal.hide_modal(modal.id);
	    
	// Close on click outside
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				Modal.hide_modal(modal.id);
			}
		});
	  });

      // Find modal show buttons
      document.querySelectorAll('[fjs-show-modal]').forEach(el => {
        const modalId = el.getAttribute('fjs-show-modal');
        if (!el._fjs_modal_bound) {
          el.addEventListener('click', () => Modal.show_modal(modalId));
          el._fjs_modal_bound = true;
        }
      });

      // Find modal hide buttons
      document.querySelectorAll('[fjs-hide-modal]').forEach(el => {
        const modalId = el.getAttribute('fjs-hide-modal');
        if (!el._fjs_modal_bound) {
          el.addEventListener('click', () => Modal.hide_modal(modalId));
          el._fjs_modal_bound = true;
        }
      });
    },

    show_modal: function(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-shown');
      } else {
        console.warn(`Modal with ID '${id}' not found`);
      }
    }

    
  };

  global.fjs = global.fjs || {};
  global.fjs.Modal = Modal;

  if (document.readyState !== 'loading') {
    Modal.init();
  } else {
    document.addEventListener('DOMContentLoaded', Modal.init);
  }
})(window);

