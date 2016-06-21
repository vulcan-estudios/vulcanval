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
- * with attribute (data-vv-name="")

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
  - data-vv-val-VALIDATOR
    - data-vv-val-isEmail
    - data-vv-val-isBefore="2016-06-18"
    - data-vv-val-isFloat="min: 7.4, max: 24.9"
    - ...
- *
  - data-vv-fieldset - Determine a fieldset
  - data-vv-name="" - Determine name of custom entries

### Plugin methods

The methods callbacks should be used when there are asynchronous validations.
Currently only the client side accepts asynchronous validators.

- void|Object $().vulcanval('inspect', [String name,] Callback fn(Object details))
  - details
    - name
      - value
      - isValid
      - msg
- void|Boolean $().vulcanval('isValid', [String name,] Callback fn(Boolean isValid))
- void|Boolean $().vulcanval('validate', [String name,] Callback fn(Boolean isValid))
- void $().vulcanval('forceValid', [String name])
- void $().vulcanval('forceInvalid', [String name])
- Object $().vulcanval('map', [Object opts { nested: false }])

### Global methods

const isValid = vulcanval.isValid(data, [{ configuration },] callback(details));
const details = vulcanval.inspectMap(data, [{ configuration },] callback(details));
  - details
    - name
      - value
      - isValid
      - msg

### Custom events

Scoped by form, fieldset and field

- vv-change
- vv-modify
- vv-valid ($field, Object details { name, value, isValid, msg })
- vv-invalid ($field, Object details { name, value, isValid, msg })

### Custom states (as attributes in form, fieldset and field)

- data-vv-isValid: undefined | Boolean
- data-vv-modified: undefined | Boolean

### Detect:

- form submit
- field change (configurable)
- field autofill (https://github.com/tbosch/autofill-event/)

### Global configuration

```js
const vulcanval = jQuery.vulcanval = require('vulcanval');

vulcanval = {
  validator: https://www.npmjs.com/package/validator,
  locale: 'en',
  firstValidationEvent: 'change',
  validationEvents: 'change input blur',
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
      // {{value}} {{`options props excluding msg`}}
      msg: {
        en: 'Error {{value}} message',
        es: 'Mensaje {{value}} de error'
      }
    },
    custom1: {
      exec (value, options) {
        // All methods has this context:
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
```

### Instance configuration

```js
$('#form').vulcanval({
  locale: 'en',
  fields: [{
    name: attrs: name | data-vv-name,
    required: true,   // attr: required | data-vv-required
    disabled: false,  // attrs: disabled | data-vv-disabled
    condition () {
      return Boolean;
    },
    validators: {
      // Special validators.
      isLength: {
        min: 0,         // attr: minlength
        max: undefined  // attr: maxlength
      },
      matches: {
        pattern: /pattern/gim,  // attr: pattern
        msg: ''                 // attr: data-vv-pattern-msg
      },
      // `validator` validators.
      isEmail:    attr: type="email" ? true : undefined,
      isNumeric:  attr: type="number" ? true : undefined,
      isURL:      attr: type="url" ? true : undefined,
      isDate:     attr: type="date" || type="datetime" || type="datetime-local" ? true : undefined,
      isInt: {
        min: undefined,  // attr: min
        max: undefined   // attr: max
      },
      isDecimal: true,  // example of built-in validator
      // Custom validators.
      custom1: true,    // example of built-in custom validator
      custom2 (value) {
        return Boolean;
      },
      // Async validator.
      async (value, done) {
        setTimeout(() => done(Boolean isValid), 500);
      }
    },

    // ui
    autostart: false, // attr: data-vv-autostart
    silent: false,    // attr: data-vv-silent
    intern: false,    // attr: data-vv-intern
    display: '$el' | $(el) | el | function () { return el },  // attr: data-vv-display
    value ($field) {
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
  msgs: {
    isEmail: 'Please enter a valid email address.',
    isLength: {
      en: 'This field should have at least {{min}} and at most {{max}} characters.',
      es: 'Este campo debe tener al menos {{min}} y máximo {{max}} carácteres.'
    }
  },

  // ui
  validationEvents: 'change',
  autostart: false,  // attr: data-vv-autostart
  silent: false,  // attr: data-vv-silent
  intern: false,  // attr: data-vv-intern
});

$('#customTag .items').on('click', function (e) {
  $('#customTag .items').removeClass('selected');
  $(this).addClass('selected');
  $('#customTag').trigger('change');
});
```

### HTML structure

```html
<form class="vv-form">
  <fieldset class="vv-fieldset">
    <label class="vv-label [vv-label-error]" />
    <input class="vv-field [vv-field-error]" />
    <div class="vv-display [vv-display-error]" />
  </fieldset>
</form>
```

### Optional

- Support for material design, polymer input components and react
- Tips or info
- Warnings
- Icons in inputs to show states
- Disable form submit inputs until validation completed after first attempt
- reCatcha support
- What to do when a field has readonly attribute
- Enable trimming on inputs on event 'input change'
