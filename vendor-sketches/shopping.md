http://dareid.github.io/chakram/

^^ Of little help over Mocha

http://frisbyjs.com/

^^ Promising!

- Uses Jasmine, would rather stick with Mocha.
- unmerged pull requests
? how much test coverage

https://github.com/vlucas/frisby/issues/221

https://github.com/MarkHerhold/IcedFrisby

+ uses mocha
+ uses chai
+ responds to PRs
+ 95% test coverage
- not super popular
- uses global/module state
? readme lists todo: Make output errors more useful. It can be hard to track down which assertion is causing what error.
? some tests should be skipped in certain environments. how would that work?
? parallel testing would speed up the full suite. is this a good solution? https://github.com/danielstjules/mocha.parallel
? can we implement retrying?
? 1500 lines, not a ton but not nothin'
idea: we could fork, and/or make a wrapper
idea: toss runs the tests, so it does seem like we could set things up, and run some of our own logic to decide which ones to run
decision: do a POC and see how the error messages look
+ use of global state seems to be optional

https://github.com/peter/jsonapitest

don't like the JSON syntax

