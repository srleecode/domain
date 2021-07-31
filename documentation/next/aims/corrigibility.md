# Corrigibilty

 > A decision is easy to correct, or highly corrigible, when, if it is mistaken, the mistake can be discovered quickly and cheaply and when the mistake imposes only small costs which can be eliminated quickly and at little expense. - David Collingridge, The Control of Technology (NY, St. Martin’s Press, 1980)

Software projects are often built in such a way that they become locked into the particular frameworks, or tooling that has have chosen. After this happens it is extremely costly to change it and it becomes more costly overtime as more functionality and tests are added based on those choices. This is because decisions like this have a legacy as new functionality will build on top of them.

Being locked into something reduces your agency and it means there are massive costs associated with change. This is dangerous. Companies today are becoming more complex and the frequency of wrong decisions is increasing. The environment and the best practices are also rapdily changing. Therefore, there is a need to maximize their ability to be able to change and a desire to have solid predictions before commitments are made. That is, there is a need for corigibility.

Corrigibility is a term that means capable of being corrected, reformed or improved. Corrigibility is a response to uncertainty and unpredictability, especially when the costs to undo a decision will be high. If the effects of a decision cannot be predicted, then the optimal approach is to maximize the ability to reverse that decision if it gets proven to be wrong. If a decision is required, then the optimal approach is to delay commitments until the latest time possible and to explore the domain as much as possible before making strong commitments. The greater the uncertainty or inability to reverse out of a specific decision, the more resources you should apply to incremental exploration of that space. Incremental exploration allows you to build certainty while still retaining the ability to pivot.  

The essence of an approach that allows corrigibility is to take small steps and have an exit strategy.

We want to test stable expectations like behaviors so that we know that our code is working correclty. As part of this testing, we often mock out things like service calls to improve the performance of the tests. Mocking allows targetted tests, but it also sets us new expectations. Theese expectations should be tested as the reliability and valididty of the tests depends on the accurancy of the expectations setup in the mocks.

## Small steps

A goal of this project is to create generators that make it easy to implement double Loop TDD. Double Loop TDD is also called Outside-in TDD. It has an outer loop and an inner loop. The outer loop is the feature test, a.k.a. acceptance test. The feature test will indicate how (in)complete the feature is. As long as the feature test does not pass, it will indicate what to test-drive next. The inner loop is the regular red-green-refactor TDD cycle and it continues until the outer loops feature test is passing. Once it passes a new failing feature test is written which starts the inner loop again.

Another goal is to have generators that do only one thing. As you are using the generators, you should be taking small steps. If a generator does more than one thing, like creating multiple libraries you would be taking too large a step. Moving in small steps requires that the generators are easy to call. The existing vscode extension makes the generators easy to call.

## Having an exit strategy

 > Allow an application to equally be driven by users, programs, automated test or batch scripts, and to be developed and tested in isolation from its eventual run-time devices and databases. - [hexagonal architecture Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)

Testing protects you from change. Therefore, if you are testing the wrong thing it makes it harder to change, pivot or exit out of a particular design path. This is why it is vital to be testing the right thing. Overtesting and overmocking locks you into design decisions and the technologies you have chosen.

A goal of this project is have generators that help generate clean architecture. This means creating layers that expose stable expectations and decouple these from code that is not stable. Code that is not stable is the domain logic and implementation details in general. Layering amd appropriate testing allows us to replace one implementation with an alternative one.



