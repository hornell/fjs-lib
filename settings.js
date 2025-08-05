// Version: 0f68741
(function(global) {
  class UserSettings {
    constructor(settings = {}) {
      this.settings = settings;
    }

    static get storageKey() {
			return 'fjs-settings';
		}

    static load() {
      const data = localStorage.getItem(UserSettings.storageKey);
      const parsed = data ? JSON.parse(data) : {};
      return new UserSettings(parsed);
    }
  
    save() {
      localStorage.setItem(UserSettings.storageKey, JSON.stringify(this.settings));
    }
  
    get(key) {
      return this.settings[key];
    }
  
    set(key, value) {
      this.settings[key] = value;
    }
  };

  const Settings = {
    init: function() {
      // Inject styles if not already present
      Settings.injectStyles();

     
      
      // Bind to elements
      Settings.buildUI();
      Settings.bindUI();

      // Setup Panel
      Settings.initPanel(); // Needs elements from above created first


      // Load/Apply Settings
      Settings.applySettings(UserSettings.load());
    },

    initPanel: function(){
      document.querySelectorAll('.fjs-settings').forEach(panel => {
        panel.querySelectorAll('.fjs-settings-tab').forEach(tab => {
          tab.addEventListener("click", () => {
            panel.classList.toggle("open");
          });
        });

        document.addEventListener("click", (event) => {
          if (!panel.contains(event.target)) {
            panel.classList.remove("open");
          }
        });
      });
    },

    bindUI: function(){
      document.querySelectorAll('[fjs-setting').forEach(el => {
        if (!el._fjs_setting_bound) {
          el.addEventListener('change', () => Settings.saveSettings(null));
          el._fjs_setting_bound = true;
        }

      });
    },

    buildUI: function(){

      document.querySelectorAll('.fjs-settings').forEach(elem => {
        if (!elem.querySelector('.fjs-settings-content')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'fjs-settings-content';
          // Move all existing children into the wrapper
          while (elem.firstChild) {
            wrapper.appendChild(elem.firstChild);
          }
          elem.appendChild(wrapper);
        }

        if (!elem.querySelector('.fjs-settings-tab')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'fjs-settings-tab';
          wrapper.innerText = "Settings";
          elem.appendChild(wrapper);
        }
      });

    },

    applySettings: function(settings) {
      document.querySelectorAll('[fjs-setting').forEach(el => {
        const settingName = el.getAttribute('fjs-setting');

        var v = settings.get(settingName);

        if (el.type === 'checkbox') {
          el.checked = v;
        }else{
          el.value = v;
        }
      });
    },

    onSave: null, // generic callback

    saveSettings: function(callback=null){
      var settings = UserSettings.load();
      document.querySelectorAll('[fjs-setting').forEach(el => {
        const settingName = el.getAttribute('fjs-setting');

        if (el.type === 'checkbox') {
          settings.set(settingName, el.checked);
        } else {
          settings.set(settingName, el.value);
        }

      });
      settings.save();

      if (callback){
        callback();
      }else {
        Settings.onSave?.();
      }

    },
    
    injectStyles: function(){
      if (!document.getElementById('fjs-settings-style')) {
        const style = document.createElement('style');
        style.id = 'fjs-settings-style';
        style.textContent = `
.fjs-settings {
	position: fixed;
	top: 0;
	right: 0;
	width: 300px;
	height: 100%;
	background: #f0f0f0;
	border-left: 2px solid #444;
	box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
	transform: translateX(100%);
	transition: transform 0.3s ease;
	z-index: 1;
	padding: 1em;
}

.fjs-settings.open {
	transform: translateX(0);
}

.fjs-settings-tab {
	position: absolute;
	top: 50%;
	left: -24px; /* Keep the tab at 24px width */
	width: 24px; /* Maintain 24px width */
	height: 120px;
	background: linear-gradient(45deg, #4c4c4c, #1a1a1a);
	color: white;
	text-align: center;
	line-height: 20px; /* Adjusted line-height to fit within 24px width */
	cursor: pointer;
	transform: translateY(-50%);
	writing-mode: vertical-rl;
	text-orientation: mixed;
	font-size: 12px; /* Reduced font size to fit text */
	user-select: none;
  
	border-right: none;
	background-clip: padding-box;
	clip-path: polygon(0 10%, 100% 0%, 100% 100%, 0 90%);
  
	box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
	z-index: 2;
  }
  

.fjs-settings-tab::after {
	content: "";
	position: absolute;
	right: -10px;
	top: 50%;
	transform: translateY(-50%);
	width: 0;
	height: 0;
	border-top: 10px solid transparent;
	border-bottom: 10px solid transparent;
	border-left: 10px solid #333;
}

.fjs-settings-content {
	padding: 1em;
	position: relative; /* For the button to absolute*/
	display: flex;
	flex-direction: column;
}
  `;
        document.head.appendChild(style);
      }
    }
   
  };

  global.fjs = global.fjs || {};
  global.fjs.Settings = Settings;
  global.fjs.UserSettings = UserSettings;

  if (document.readyState !== 'loading') {
    Settings.init();
  } else {
    document.addEventListener('DOMContentLoaded', Settings.init);
  }
})(window);

