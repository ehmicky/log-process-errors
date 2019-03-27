# Snapshot report for `test/test_opt.js`

The actual snapshot is saved in `test_opt.js.snap`.

Generated by [AVA](https://ava.li).

## [ava] [multipleResolves] [error] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  multipleResolves (a promise was resolved/rejected multiple times)  Initially resolved with: { success: true }␊
            Then rejected with: Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [multipleResolves] [silent] should make tests fails

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        1 test passed`,
    }

## [ava] [rejectionHandled] [error] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  rejectionHandled (a promise was rejected and handled too late)  Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 unhandled rejection␊
        1 uncaught exception`,
    }

## [ava] [rejectionHandled] [silent] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [uncaughtException] [error] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [uncaughtException] [silent] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [unhandledRejection] [error] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [unhandledRejection] [silent] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [warning] [error] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  warning  (500) Detail␊
            Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [warning] [silent] should make tests fails

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        1 test passed`,
    }

## [ava] [multipleResolves] [silent] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        1 test passed`,
    }

## [ava] [multipleResolves] [undefined] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        1 test passed`,
    }

## [ava] [multipleResolves] [undefined] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  multipleResolves (a promise was resolved/rejected multiple times)  Initially resolved with: { success: true }␊
            Then rejected with: Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [rejectionHandled] [silent] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [rejectionHandled] [undefined] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [rejectionHandled] [undefined] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  rejectionHandled (a promise was rejected and handled too late)  Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 unhandled rejection␊
        1 uncaught exception`,
    }

## [ava] [uncaughtException] [silent] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [uncaughtException] [undefined] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [uncaughtException] [undefined] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [unhandledRejection] [silent] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [unhandledRejection] [undefined] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [unhandledRejection] [undefined] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [warning] [silent] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        1 test passed`,
    }

## [ava] [warning] [undefined] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        1 test passed`,
    }

## [ava] [warning] [undefined] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  warning  (500) Detail␊
            Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [multipleResolves] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        1 test passed`,
    }

## [ava] [multipleResolves] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on multipleResolves␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  multipleResolves (a promise was resolved/rejected multiple times)  Initially resolved with: { success: true }␊
            Then rejected with: Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [rejectionHandled] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [rejectionHandled] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on rejectionHandled␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  rejectionHandled (a promise was rejected and handled too late)  Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 unhandled rejection␊
        1 uncaught exception`,
    }

## [ava] [uncaughtException] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [uncaughtException] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on uncaughtException␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }

## [ava] [unhandledRejection] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [unhandledRejection] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on unhandledRejection␊
      ␊
        Unhandled rejection in build/test/ava.js␊
      ␊
      ␊
        Error: message␊
      ␊
      ␊
        1 test passed␊
        1 unhandled rejection`,
    }

## [ava] [warning] should allow overriding 'opts.level'

> Snapshot 1

    {
      code: 0,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        1 test passed`,
    }

## [ava] [warning] should make tests fails

> Snapshot 1

    {
      code: 1,
      stderr: '',
      stdout: `√ should make tests fail on warning␊
      ␊
        Uncaught exception in build/test/ava.js␊
      ␊
      ␊
        Error:  ×  warning  (500) Detail␊
            Error: message␊
                at STACK TRACE␊
      ␊
        × build/test/ava.js exited with a non-zero exit code: 1␊
      ␊
        1 test passed␊
        1 uncaught exception`,
    }