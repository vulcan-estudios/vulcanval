# Vulcan Validator

## API

### API can be instantiated on

- form
- fields
- custom entries (with data-vv-name attribute)

### Allow fields types

- input type text-like
- input type checkbox
- input type radio
- input type hidden (is intern by default)
- input type to exclude: submit, button
- textarea
- select
- custom entries (attr: data-vv-name="")

### Custom events

Fields scoped by form

- vv-change - This can be triggered by the user to enable some functionalities.
- vv-modify (Object details { value, isValid, msg })
- vv-valid (Object details { value })
- vv-invalid (Object details { value, msg })

### Custom states (as attributes in form and field)

- data-vv-isValid: undefined | Boolean
- data-vv-modified: undefined | Boolean

### Events watched

- form submit reset
- field value changes (configurable)
- field autofill (https://github.com/tbosch/autofill-event/)

### Custom contexts

- contexts will also have the properties on client-side:
 - methods
   - .customValidator()
   - .onlyIf()
   - .value()
 - Only on client-side:
   - .$form
   - .$field
 - Global:
   - .validator
   - .settings
   - .get()

### HTML structure

```html
<form class="vv-form [vv-form_error]">
  <label class="vv-label [vv-label_error]" />
  <input class="vv-field [vv-field_error]" />
  <div class="vv-display [vv-display_error]" />
</form>
```

### Additionals

- Support for material design, polymer input components and react
- Tips/infos messages
- Warnings messages
- Icons in inputs to show states
- Disable form submit inputs until validation completed after first attempt
- reCatcha support
- What to do when a field has readonly attribute
- Enable trimming on inputs on event 'input change'
- Parser values in map
- Update settings after instance time on elements attributes changes
- In UI, detect fields that listens to changes in other fields to re-validate
  them as events in themselves. This could be done by recording on its methods (value(),
  onlyIf() and custom validators)
- A way to validate conditionally in server and client and/or set onlyIf
  for more than one field.
