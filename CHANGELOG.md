# CHANGELOG

## v3.0.0 / 2016-09-16

- Changes the way to import the project using a bundle code in ES5 instead of ES2015. All functionality for the module and the plugin remains the same.

## v2.0.0 / 2016-07-12

- Changes in API:
  - Instantiation mode and separation between global module and "validator" instance by settings.
  - Method `validateMap` is now called `validate` and only validates the complete data map.
  - Added `validateField` and `validateFieldset` methods.
- Configure by fieldsets.
- Added `onlyUI` config.
- `log`, `settings` and `utilityContext` are now public in module.
- Utility context now supports all validator.js package methods directly.
- Fixed many bugs.
- Tested more use cases.

### jQuery Plugin

- Changes in API:
  - Method `validate` now only validates complete form.
  - Method `reset` now only resets complete form.
  - Method `inspect` now only inspects complete form.
  - Added `validateField` and `validateFieldset`.
  - Added `resetField` and `resetFieldset`.
  - Added `inspectField` and `inspectFieldset`.
- Space trimmers.

## v1.0.0-beta / 2016-07-04

- Configuration by global settings and fields settings.
- Validation of data maps.
- Custom validators.
- Custom fields different from form elements.
- Internationalization support.

### jQuery Plugin

- Evented form validation functionalities.
- HTML5 integration.
- Extract data from forms elements as data maps (possibly nested objects).
- API to integrate with your own libraries.
