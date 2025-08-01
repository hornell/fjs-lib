// Version: 82c3eae
(function(global) {
	class AuthInfo {
		constructor(data, expiresInSeconds) {
			this.expiresAt = Date.now() + expiresInSeconds 	* 1000;
			this.data = data;
		}

		isValid() {
			return this.data && Date.now() < this.expiresAt;
		}

		static get storageKey() {
			return 'fjs-auth-info';
		}

	static load() {
		const json = localStorage.getItem(AuthInfo.storageKey);
		if (!json) return null;
		try {
			const obj = JSON.parse(json);
			const info = new AuthInfo(obj.data, 0); // dummy expiresIn
			info.expiresAt = obj.expiresAt;
			if(info.isValid()){
				return info;
			}else{
				this.clear();
				return null;
			}
		} catch(e) {
			console.error('Something happened while loading auth info. Clearing the cached data.',e)
			AuthInfo.clear();
			return null;
		}
	}

	save() {
		localStorage.setItem(AuthInfo.storageKey, JSON.stringify(this));
	}

	static clear() {
		localStorage.removeItem(AuthInfo.storageKey);
	}
}

  const Login = {
    init: function() {
      // Inject login styles if not already present
      if (!document.getElementById('fjs-login-style')) {
        const style = document.createElement('style');
        style.id = 'fjs-login-style';
        style.textContent = `
		.login-hidden {
		    display: none;
		}
	`;
        document.head.appendChild(style);
      }

	Login.check_auth();
    },

	change_visible: function(selector, visible){
		document.querySelectorAll(selector).forEach(elem => {
			if(visible){
				elem.classList.remove('login-hidden');
			}else{
				elem.classList.add('login-hidden');
			}
		});
	},

	check_auth: function(cont_run=true) {
		var authInfo = AuthInfo.load();
    		var isValid = !(authInfo === null);
    		Login.change_visible('.fjs-auth-needed', isValid);
		Login.change_visible('.fjs-auth-login', !isValid);
		if (cont_run){
			setTimeout(Login.check_auth, 1000);	
		}
    	},

	set_auth: function(authInfo) {
		if (authInfo && authInfo.isValid()) {
			authInfo.save();
			Login.check_auth(false); // Immediately re-evaluate visibility
		}
	},    
    };

  global.fjs = global.fjs || {};
  global.fjs.Login = Login;
  global.fjs.AuthInfo = AuthInfo;

  if (document.readyState !== 'loading') {
    Login.init();
  } else {
    document.addEventListener('DOMContentLoaded', Login.init);
  }
})(window);

