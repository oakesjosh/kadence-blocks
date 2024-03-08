import KadenceColorOutput from '../kadence-color-output';
import typographyStyle from '../typography-style';
import getBorderStyle from '../get-border-style';

/**
 * A Class that can generate css output for a <style> tag.
 */
export default class KadenceBlocksCSS {
	/**
	 * Stores all of the rules that will be added to the selector
	 *
	 * @access protected
	 * @var string
	 */
	_css = '';

	/**
	 * The string that holds all of the css to output
	 *
	 * @access protected
	 * @var string
	 */
	_output = '';

	/**
	 * Stores a list of css properties that require more formating
	 *
	 * @access private
	 * @var array
	 */
	_special_properties_list = [
		'border-top-left-radius',
		'border-top-right-radius',
		'border-bottom-left-radius',
		'border-bottom-right-radius',
		'transition',
		'transition-delay',
		'transition-duration',
		'transition-property',
		'transition-timing-function',
		'background-image',
		'content',
		'line-height',
	];

	/**
	 * The css selector that you're currently adding rules to
	 *
	 * @access protected
	 * @var string
	 */
	_selector = '';

	/**
	 * Stores the final css output with all of its rules for the current selector.
	 *
	 * @access protected
	 * @var string
	 */
	_selector_output = '';

	/**
	 * Can store a list of additional selector states which can be added and removed.
	 *
	 * @access protected
	 * @var array
	 */
	_selector_states = [];

	/**
	 * Stores media queries
	 *
	 * @var null
	 */
	_media_query = null;

	/**
	 * The string that holds all of the css to output inside of the media query
	 *
	 * @access protected
	 * @var string
	 */
	_media_query_output = '';

	constructor() {}

	/**
	 * Sets a selector to the object and changes the current selector to a new one
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string selector - the css identifier of the html that you wish to target.
	 * @return this
	 */
	set_selector(selector = '') {
		// Render the css in the output string everytime the selector changes.
		if ('' !== this._selector) {
			this.add_selector_rules_to_output();
		}
		this._selector = selector;
		return this;
	}

	/**
	 * Adds the current selector rules to the output variable
	 *
	 * @access private
	 * @since  1.0
	 *
	 * @return this
	 */
	add_selector_rules_to_output() {
		if (!this.empty(this._css)) {
			this.prepare_selector_output();
			var selector_output = this._selector_output + '{' + this._css + '}';

			if (this.has_media_query()) {
				this._media_query_output += selector_output;
				this.reset_css();
			} else {
				this._output += selector_output;
			}

			// Reset the css.
			this.reset_css();
		}

		return this;
	}

	/**
	 * Gets the media query if it exists in the class
	 *
	 * @since  1.1
	 * @return string|int|null
	 */
	get_media_query() {
		return this._media_query;
	}

	/**
	 * Checks if there is a media query present in the class
	 *
	 * @since  1.1
	 * @return boolean
	 */
	has_media_query() {
		if (!this.empty(this.get_media_query())) {
			return true;
		}

		return false;
	}

	/**
	 * Prepares the _selector_output variable for rendering
	 *
	 * @access private
	 * @since  1.0
	 *
	 * @return this
	 */
	prepare_selector_output() {
		if (!this.empty(this._selector_states)) {
			// Create a new variable to store all of the states.
			var new_selector = '';

			for (let i = 0; i < this._selector_states.length; i++) {
				const element = this._selector_states[i];
				const atEnd = this._selector_states.length === i + 1;

				const atEndComma = atEnd ? '' : ',';
				new_selector += this._selector + state + atEndComma;
			}

			this._selector_output = new_selector;
		} else {
			this._selector_output = this._selector;
		}
		return this;
	}

	/**
	 * Adds a css property with value to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string property - the css property
	 * @param  string value - the value to be placed with the property
	 * @return this
	 */
	add_property(property, value) {
		if (this._special_properties_list.includes(property)) {
			this.add_special_rules(property, value);
		} else {
			this.add_rule(property, value);
		}
		return this;
	}

	/**
	 * Adds a new rule to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string property - the css property.
	 * @param  string value - the value to be placed with the property.
	 * @param  string prefix - not required, but allows for the creation of a browser prefixed property.
	 * @return this
	 */
	add_rule(property, value, prefix = null) {
		const potentiallyPrefix = prefix === null ? '' : prefix;
		if (value && !this.empty(value)) {
			this._css += potentiallyPrefix + property + ':' + value + ';';
		}
		return this;
	}

	/**
	 * Adds browser prefixed rules, and other special rules to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string property - the css property
	 * @param  string value - the value to be placed with the property
	 * @return this
	 */
	add_special_rules(property, value) {
		// Switch through the property types and add prefixed rules.
		switch (property) {
			case 'border-top-left-radius':
				this.add_rule(property, value);
				this.add_rule(property, value, '-webkit-');
				this.add_rule('border-radius-topleft', value, '-moz-');
				break;
			case 'border-top-right-radius':
				this.add_rule(property, value);
				this.add_rule(property, value, '-webkit-');
				this.add_rule('border-radius-topright', value, '-moz-');
				break;
			case 'border-bottom-left-radius':
				this.add_rule(property, value);
				this.add_rule(property, value, '-webkit-');
				this.add_rule('border-radius-bottomleft', value, '-moz-');
				break;
			case 'border-bottom-right-radius':
				this.add_rule(property, value);
				this.add_rule(property, value, '-webkit-');
				this.add_rule('border-radius-bottomright', value, '-moz-');
				break;
			case 'background-image':
				//check if it starts with 'var('
				if (value.substring(0, 4) === 'var(') {
					this.add_rule(property, value);
				} else {
					this.add_rule(property, "url('" + value + "')");
				}
				break;
			case 'content':
				this.add_rule(property, '"' + value + '"');
				break;
			case 'line-height':
				if (!isNaN(parseFloat(value)) && isFinite(value) && 0 == value) {
					value = '0px';
				}
				this.add_rule(property, value);
				break;
			default:
				this.add_rule(property, value);
				this.add_rule(property, value, '-webkit-');
				this.add_rule(property, value, '-moz-');
				break;
		}

		return this;
	}

	/**
	 * Generates the size output.
	 *
	 * @param array size an array of size settings.
	 * @return string
	 */
	render_half_size(size, unit) {
		if (this.empty(size)) {
			return false;
		}
		var size_number = !this.empty(size) ? size : '0';
		var size_unit = !this.empty(unit) ? unit : 'em';

		var size_string = 'calc(' + size_number + size_unit + ' / 2)';

		return size_string;
	}

	/**
	 * Generates the size output.
	 *
	 * @param array size an array of size settings.
	 * @return string
	 */
	render_size(size, unit) {
		if (this.empty(size)) {
			return false;
		}
		var size_number = !this.empty(size) ? size : '0';
		var size_unit = !this.empty(unit) ? unit : 'em';

		var size_string = size_number + size_unit;

		return size_string;
	}

	render_color(string, opacity = null) {
		return KadenceColorOutput(string, (opacity = null));
	}

	render_font(data, previewDevice) {
		// Do typographyStyle with no class attached
		this._css += typographyStyle(data, '', previewDevice, false);
		return this;
	}

	/**
	 * Generates the border output.
	 *
	 * @param array border an array of border settings.
	 * @return string
	 */
	render_border(device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false) {
		return getBorderStyle(device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder);
	}

	/**
	 * Resets the css variable
	 *
	 * @access private
	 * @since  1.1
	 *
	 * @return void
	 */
	reset_css() {
		this._css = '';
		return;
	}

	/**
	 * Returns the minified css in the _output variable
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	css_output() {
		// Add current selector's rules to output
		this.add_selector_rules_to_output();

		// Output minified css
		return this._output;
	}

	empty(value) {
		if (
			value === undefined ||
			value === '' ||
			value === null ||
			(Array.isArray(value) && !value.length) ||
			(typeof value === 'object' && Object.keys(value).length === 0)
		) {
			return true;
		}
		return false;
	}
}
