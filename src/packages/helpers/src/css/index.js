import KadenceColorOutput from '../kadence-color-output';
import typographyStyle from '../typography-style';
import getBorderStyle from '../get-border-style';
import getPreviewSize from '../get-preview-size';

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

	/**
	 * Spacing variables used in string based padding / margin.
	 */
	spacing_sizes = {
		'ss-auto': 'var(--global-kb-spacing-auto, auto)',
		xxs: 'var(--global-kb-spacing-xxs, 0.5rem)',
		xs: 'var(--global-kb-spacing-xs, 1rem)',
		sm: 'var(--global-kb-spacing-sm, 1.5rem)',
		md: 'var(--global-kb-spacing-md, 2rem)',
		lg: 'var(--global-kb-spacing-lg, 3rem)',
		xl: 'var(--global-kb-spacing-xl, 4rem)',
		xxl: 'var(--global-kb-spacing-xxl, 5rem)',
		'3xl': 'var(--global-kb-spacing-3xl, 6.5rem)',
		'4xl': 'var(--global-kb-spacing-4xl, 8rem)',
		'5xl': 'var(--global-kb-spacing-5xl, 10rem)',
	};
	/**
	 * Font size variables used in string based font sizes.
	 */
	font_sizes = {
		sm: 'var(--global-kb-font-size-sm, 0.9rem)',
		md: 'var(--global-kb-font-size-md, 1.25rem)',
		lg: 'var(--global-kb-font-size-lg, 2rem)',
		xl: 'var(--global-kb-font-size-xl, 3rem)',
		xxl: 'var(--global-kb-font-size-xxl, 4rem)',
		'3xl': 'var(--global-kb-font-size-xxxl, 5rem)',
	};
	/**
	 * Gaps variables used in string based gutters.
	 */
	gap_sizes = {
		none: 'var(--global-kb-gap-none, 0rem )',
		skinny: 'var(--global-kb-gap-sm, 1rem)',
		narrow: '20px',
		wide: '40px',
		widest: '80px',
		default: 'var(--global-kb-gap-md, 2rem)',
		wider: 'var(--global-kb-gap-lg, 4rem)',
		xs: 'var(--global-kb-gap-xs, 0.5rem )',
		sm: 'var(--global-kb-gap-sm, 1rem)',
		md: 'var(--global-kb-gap-md, 2rem)',
		lg: 'var(--global-kb-gap-lg, 4rem)',
	};

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
	render_half_size(value, tabletValue = null, mobileValue = null, previewDevice = null, unit = null) {
		var previewValue = getPreviewSize(previewDevice, value, tabletValue, mobileValue);

		var size_number = !this.empty(previewValue) ? previewValue : '0';
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
	render_size(value, tabletValue = null, mobileValue = null, previewDevice = null, unit = null) {
		var previewValue = getPreviewSize(previewDevice, value, tabletValue, mobileValue);

		var size_number = !this.empty(previewValue) ? previewValue : '0';
		var size_unit = !this.empty(unit) ? unit : 'em';

		var size_string = size_number + size_unit;

		return size_string;
	}

	render_color(value, tabletValue = null, mobileValue = null, previewDevice = null, opacity = null) {
		var previewValue = getPreviewSize(previewDevice, value, tabletValue, mobileValue);
		return KadenceColorOutput(previewValue, opacity);
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
	render_border(
		value,
		tabletValue = null,
		mobileValue = null,
		previewDevice = null,
		side = 'top',
		inheritBorder = false
	) {
		return getBorderStyle(previewDevice, side, value, tabletValue, mobileValue, inheritBorder);
	}

	/**
	 * Generates the measure output.
	 *
	 * @param array  attributes an array of attributes.
	 * @param string name a string of the block attribute name.
	 * @param string property a string of the css propery name.
	 * @param array  args an array of settings.
	 * @return string
	 */
	render_measure_output(
		value,
		tabletValue = null,
		mobileValue = null,
		previewDevice = null,
		property = 'padding',
		unit = 'px',
		args = {}
	) {
		var previewValue = getPreviewSize(previewDevice, value, tabletValue, mobileValue);

		var prop_args = {};
		switch (property) {
			case 'border-width':
				prop_args = {
					first_prop: 'border-top-width',
					second_prop: 'border-right-width',
					third_prop: 'border-bottom-width',
					fourth_prop: 'border-left-width',
				};
				break;
			case 'border-radius':
				prop_args = {
					first_prop: 'border-top-left-radius',
					second_prop: 'border-top-right-radius',
					third_prop: 'border-bottom-right-radius',
					fourth_prop: 'border-bottom-left-radius',
				};
				break;
			case 'position':
				prop_args = {
					first_prop: 'top',
					second_prop: 'right',
					third_prop: 'bottom',
					fourth_prop: 'left',
				};
				break;
			default:
				prop_args = {
					first_prop: property + '-top',
					second_prop: property + '-right',
					third_prop: property + '-bottom',
					fourth_prop: property + '-left',
				};
				break;
		}
		const defaults = {
			first_prop: prop_args['first_prop'],
			second_prop: prop_args['second_prop'],
			third_prop: prop_args['third_prop'],
			fourth_prop: prop_args['fourth_prop'],
		};

		args = { ...defaults, ...args };

		if (previewValue && Array.isArray(previewValue)) {
			if (this.isNumeric(previewValue[0])) {
				this.add_property(args['first_prop'], previewValue[0] + unit);
			} else if ('position' === property && !this.empty(previewValue[0])) {
				this.add_property(args['first_prop'], previewValue[0]);
			} else if (!this.empty(previewValue[0]) && this.is_variable_value(previewValue[0])) {
				this.add_property(args['first_prop'], this.get_variable_value(previewValue[0]));
			}
			if (this.isNumeric(previewValue[1])) {
				this.add_property(args['second_prop'], previewValue[1] + unit);
			} else if ('position' === property && !this.empty(previewValue[1])) {
				this.add_property(args['second_prop'], previewValue[1]);
			} else if (!this.empty(previewValue[1]) && this.is_variable_value(previewValue[1])) {
				this.add_property(args['second_prop'], this.get_variable_value(previewValue[1]));
			}
			if (this.isNumeric(previewValue[2])) {
				this.add_property(args['third_prop'], previewValue[2] + unit);
			} else if ('position' === property && !this.empty(previewValue[2])) {
				this.add_property(args['third_prop'], previewValue[2]);
			} else if (!this.empty(previewValue[2]) && this.is_variable_value(previewValue[2])) {
				this.add_property(args['third_prop'], this.get_variable_value(previewValue[2]));
			}
			if (this.isNumeric(previewValue[3])) {
				this.add_property(args['fourth_prop'], previewValue[3] + unit);
			} else if ('position' === property && !this.empty(previewValue[3])) {
				this.add_property(args['fourth_prop'], previewValue[3]);
			} else if (!this.empty(previewValue[3]) && this.is_variable_value(previewValue[3])) {
				this.add_property(args['fourth_prop'], this.get_variable_value(previewValue[3]));
			}
		}
	}

	/**
	 * Generates the gap output.
	 *
	 * @param string  size a string or number with the gap size.
	 * @param string unit a string with the unit type.
	 * @return string
	 */
	get_gap_size(size, unit) {
		if (this.is_variable_gap_value(size)) {
			return this.get_variable_gap_value(size);
		}
		return size + unit;
	}
	/**
	 * @param value
	 *
	 * @return bool
	 */
	is_variable_gap_value(value) {
		return this.gap_sizes?.[value];
	}
	/**
	 * @param value
	 *
	 * @return bool|string
	 */
	get_variable_gap_value(value) {
		if (this.is_variable_gap_value(value)) {
			return this.gap_sizes[value];
		}

		return false;
	}
	/**
	 * @param value
	 *
	 * @return bool
	 */
	is_variable_font_size_value(value) {
		return typeof value == 'string' && this.font_sizes?.[value];
	}
	/**
	 * @param value
	 *
	 * @return bool|string
	 */
	get_variable_font_size_value(value) {
		if (this.is_variable_font_size_value(value)) {
			return this.font_sizes[value];
		}

		return false;
	}
	/**
	 * @param value
	 *
	 * @return bool
	 */
	is_variable_value(value) {
		return typeof value == 'string' && this.spacing_sizes?.[value];
	}

	/**
	 * @param value
	 *
	 * @return int|string
	 */
	get_variable_value(value) {
		if (this.is_variable_value(value)) {
			return this.spacing_sizes[value];
		}

		return 0;
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

	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
}
