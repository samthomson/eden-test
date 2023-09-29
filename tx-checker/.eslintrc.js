module.exports = {
	extends: [
	  "react-app",
	  "plugin:prettier/recommended"
	],
	rules: {
	  "prettier/prettier": [
		"error",
		{
		  "semi": false
		}
	  ],
	  "semi": [
		"error",
		"never"
	  ],
	  "indent": ["error", "tab"]
	}
  };
  