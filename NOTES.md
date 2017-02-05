# settings

- disableHTML5Validation
- enableNestedMaps
- disabled [INHERIT #0f0]
- autostart [INHERIT #0f0]
- intern [INHERIT #0f0]

- firstValidationEvent [INHERIT #0f0]
- validationEvents [INHERIT #0f0]
- locale

- classes
- validators
- msgs
- context

- fieldsets
- fields [**** #00f]

- $form

- onSubmit
- onReset

- getMsgTemplate
- extend

# fieldset settings

- name [**** #00f]
- fields [**** #00f] [REFS #000]

- disabled [INHERIT #0f0]
- required [INHERIT #0f0]
- autostart [INHERIT #0f0]
- intern [INHERIT #0f0]
- onlyUI [INHERIT #0f0]

- firstValidationEvent [INHERIT #0f0]
- validationEvents [INHERIT #0f0]

- validators [EXTEND #f00]

- onlyIf [PIPE #f0f]
- extend

# field settings

- name [**** #00f]

- disabled
- required
- autostart
- intern
- onlyUI

- firstValidationEvent
- validationEvents

- validators

- $el
- display
- $display
- $labels

- onFirstChange
- onChange
- onBlur

- onlyIf
- value
- extend

# methods

vulcanval.validate()
vulcanval.validateField(field)
vulcanval.validateFieldset(fieldset)

vulcanval.cleanMap(map)
vulcanval.convertMapTo(to, map)

vulcanval.extendLocale(locale)
vulcanval.setLocale(localeId)

vulcanval.addValidator(name, fn)

# plugin

$(form).vulcanval(settings);

$(form).vulcanval('validate');
$(form).vulcanval('validateField', field);
$(form).vulcanval('validateFieldset', fieldset);

$(form).vulcanval('inspect');
$(form).vulcanval('inspectField', field);
$(form).vulcanval('inspectFieldset', fieldset);

$(form).vulcanval('reset');
$(form).vulcanval('resetField', field);
$(form).vulcanval('resetFieldset', fieldset);

$(form).vulcanval('getMap');
