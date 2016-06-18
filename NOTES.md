# Vulcan Validator

## API

### Instances and API on:

- form
- fielset
- field
- inside and non-exist custom entries (with data-vv-name attribute)

### Allow:

- input type text-like
- input type checkbox
- input type radio
- input type hidden (is silent)
- input type to exclude: submit, button
- textarea
- select
- * with special attributes

### Attributes

- form, fieldset, field
  - name - Name of element
  - disabled | data-vv-disabled - Ignore element
- field
  - type - Determine the kind of input
  - required | data-vv-required - Input required
  - minlength - The minimum length
  - maxlength - The maximum length
  - min - When number, the minimum value
  - max - When number, the maximum value
  - pattern - Pattern to validate
  - data-vv-pattern-msg="" - pattern error message
  - data-vv-silent - Don't validate
  - data-vv-intern - Don't display messages neither error styles
  - data-vv-display="" - Element to show messages
  - data-vv-autostart - Autostart validation at instance time, is set to true if field has initial value
- *
  - data-vv-fieldset - Determine a fieldset
  - data-vv-name="" - Determine name of custom entries

### Client methods

- void|Object inspect([String name,] Callback fn(Object details))
  - details
    - name
      - value
      - isValid
      - msg
- void|Boolean isValid([String name,] Callback fn(Boolean isValid))
- void|Boolean validate([String name,] Callback fn(Boolean isValid))
  - Should focus first inValid element if there is
- void forceValid([String name])
- void forceInvalid([String name])
- Object map()

### Server methods

const isValid = vulcanval.validate(data, { instance configuration }, callback(details));
const details = vulcanval.inspect(data, { instance configuration }, callback(details));
  - details
    - name
      - value
      - isValid
      - msg
const details = vulcanval.inspectMap(data, { instance configuration }, callback(details));
  - The same as .inspect() but details are structured.

### Custom events

Scoped by form, fieldset and field

- vv-change
- vv-valid ($field, Object details { name, value, isValid, msg })
- vv-invalid ($field, Object details { name, value, isValid, msg })

### Custom states

- data-vv-isValid: undefined | Boolean
- data-vv-modified: undefined | Boolean

### Detect:

- form submit
- field change (configurable)
- field autofill (https://github.com/tbosch/autofill-event/)

### Global configuration

const vulcanval = jQuery.vulcanval = require('vulcanval');

vulcanval = {
  validator: https://www.npmjs.com/package/validator,
  locale: 'en',
  firstValidationEvents: 'change',
  validationEvents: 'change input',
  classes: {
    error: {
      label: '',
      input: '',
      display: ''
    }
  },
  msg: {  // or string
    en: 'Default error message.',
    es: 'Mensaje de error por defecto.'
  },
  validators: {
    isEmail: {
      options: undefined,  // {}
      // {{value}} {{`options props`}}
      msg: {
        en: 'Error {{value}} message',
        es: 'Mensaje {{value}} de error'
      }
    },
    custom1: {
      exec (value, options) {
        // All methods has this context:
        // this.$form;
        // this.$fieldset;
        // this.$field;
        // this.config;
        // this.get('fieldName')
        return Boolean;
      },
      msg: {  // or string
        en: 'Error {{value}} message',
        es: 'Mensaje {{value}} de error'
      }
    }
  }
};

### Instance configuration

$('#form').vulcanval({
  locale: 'en',
  fieldsets: {
    name: {
      disabled: false,
      condition () {
        return Boolean;
      },

      // ui
      autostart: false,
      silent: false,
      intern: false
    }
  },
  fields: [{
    name: attrs: name | data-vv-name,
    required: true,   // attr: required | data-vv-required
    disabled: false,  // attrs: disabled | data-vv-disabled
    condition () {
      return Boolean;
    },

    validators: {
      isEmail:    attr: type="email" ? true : undefined,
      isNumeric:  attr: type="number" ? true : undefined,
      isURL:      attr: type="url" ? true : undefined,
      isDate:     attr: type="date" || type="datetime" || type="datetime-local" ? true : undefined,
      isLength: {
        min: 0,         // attr: minlength
        max: undefined  // attr: maxlength
      },
      isInt: {
        min: undefined,  // attr: min
        max: undefined   // attr: max
      },
      matches: {
        pattern: /pattern/gim,  // attr: pattern
        msg: ''                 // attr: data-vv-pattern-msg
      },
      isDecimal: true,  // example of built-in validator
      custom1: true,    // example of built-in custom validator
      custom2 (value) {
        return Boolean;
      },
      async (value, done) {
        setTimeout(() => done(Boolean isValid), 500);
      }
    },

    // ui
    autostart: false,  // attr: data-vv-autostart
    silent: false,  // attr: data-vv-silent
    intern: false,  // attr: data-vv-intern
    display: '$el' | $(el) | el | function () { return el },  // attr: data-vv-display
    value ($field, vv) {
      return value;
    }
  }, {
    name: '',
    validators: [{
      name: 'name',
      required: true
    }]
  }, {
    name: '',
    validators: [{
      name: 'name',
      required: true
    }]
  }],

  // ui
  validationEvents: 'change',
  autostart: false,  // attr: data-vv-autostart
  silent: false,  // attr: data-vv-silent
  intern: false,  // attr: data-vv-intern
});

### HTML structure

<form class="vv-form">
  <fieldset class="vv-fieldset">
    <label class="vv-label [vv-label-error]" />
    <input class="vv-field [vv-field-error]" />
    <div class="vv-display [vv-display-error]" />
  </fieldset>
</form>

### Optional

- Support for material design, polymer input components and react
- Tips or info
- Warnings
- Icons in inputs to show states
- Disable form submit inputs until validation completed after first attempt
- reCatcha support
- What to do when a field has readonly attribute
