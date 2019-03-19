# Contributions

🎉 Thanks for considering contributing to this project! 🎉

This document will help you
send a pull request.

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/log-process-errors).

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and submit a correction.

# Development process

First fork and clone the repository. Please see
[here](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
if you're not sure how to do this.

Then run:

```bash
npm install
```

Make sure everything is correctly setup with:

```bash
npm test
```

We use Gulp tasks to lint, test and build this project. Please check
[gulp-shared-tasks](https://github.com/ehmicky/gulp-shared-tasks) to learn how
to use them. You don't need to know Gulp to use them.

# Requirements

We enforce 100% test coverage, i.e. each line of code must be tested.

Documentation must be added for any new feature in all of these:

- the `README.md`
- the `docs` folder (if any)
- the `examples` folder (if any)

After submitting the pull request, please make sure the Continuous Integration
checks are passing.
