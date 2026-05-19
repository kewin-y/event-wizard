# "Bug" Showcase

_This is more of a personal nitpick_

Using this method of validation, form errors are never "cleared": when going in between steps. If one inputs invalid data on the Attendees step, errors will show, as expectedHowever, upon pressing "back" and pressing "next", the errors persist.

## Desired behaviour

Ideally, no errors should show when entering a step.

