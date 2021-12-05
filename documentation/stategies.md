# Strategies

## domain operations 

When you have some higher level structure than just libraries, you can shift how you think about your applications to a higher level. This improves application understandability and the performance of the nx affected commands. To be able to think in terms of that high level structure, I have been calling them domains, you need to be able to perform operations at that level. In the project, there are generators to move and remove domains as well as creating the E2E project inside the domain grouping folder.
![image](https://user-images.githubusercontent.com/13536934/129826541-96582763-9a57-4011-ae05-bf20239b1f9f.png)

## UI tests

UI tests are cypress tests that are run using the cypress component test runner. UI tests along with the nx affected commands fundamentally change how things should be tested on the front end. I would assume that most people think that the best practice in regards to the structure of their test suites is the testing pyramid.  UI tests and the nx affected commands mean that the best practice now is the [testing pyramid](https://www.codecademy.com/articles/tdd-testing-pyramid) in my opinion. 

Component testing is a fundamental part of being able to do outside-in tdd. Component testing has high fidelity which is how closely the tests resemble a user’s experience with the application. As well as high precision, which is how well a test can target a specific edge case without executing (or re-executing) unrelated code. Component tests allow functional or feature tests to be written in such a way that they do not overwhelms a projects velocity due to their run time. E2E tests while useful can quickly become quite burdensome due to how long they take to run.

Interaction/E2E tests are the kind of tests we want to be writing as they give us the most confidence. They have been avoided in large amounts in the past because of issues with their speed and error specificity. UI tests enable outside-in tdd which is important for TDD on the front end. TDD reduces the need for error specificity as following the TDD cycle means that you always proceed from a green state and that you are taking small steps. This means that in the worst case if there are issues with your changes all you need to do is revert them. This is not a major issue as the amount of changes will be small. In regards to speed, UI tests are less expensive than E2E and the nx affected commands mean that they run only when something relevant has changed. 

Different test types have different characteristics:
 - Speed is about how quickly the tests execute
 - Coverage is about the amount of code under test. Less code under test, i.e. a targeted test, means that the test will be faster, more reliable and less [likely](https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html) to be flaky. 
 - Fidelity is about how closely the tests resemble a users experience with the application. 
 - Precision is about how well a test can target a specific use case without executing or re-executing unrelated code. 
 - Error specificity how well does a test failure indicates where the issue is in the code

![ui tests](https://user-images.githubusercontent.com/13536934/129831348-91bcc871-800e-49c5-8e3a-66ef16274953.PNG)

## SCAMS and SDAMS 

 SCAM stands for Single Component Angular Module. SCAMs are used because they enable easier component testing. SCAMs means that all feature and UI libraries get their own library. For further information, see https://marmicode.io/blog/your-angular-module-is-a-scam

I think Single Component Angular Module (SCAM) and Single Directive Angular Module (SDAM), i.e. having a separate library for each component and directive, works well with UI testing as they allow more targeted test runs and affected results. It also makes it easy to configure the ct target.
 
## Layering

As software grows, it becomes harder to reason about and to understand. At a certain size, it becomes useful to be able to take a whole chunk of the code and be able to talk about it as if it was a single unit. This is commonly done by creating a layer. A layer takes a whole chunk of code and and hides it behind a stable interface. This allows you to think about the chunk of code using the interface and you don't need to worry about the implementation details.

Layers remove the ability for changes to implementation details to ripple through the whole system. They also mean that the components the system is made of can replaced by alternative implementations without affecting the rest of the system. Layer boundaries are where the stable expectations are exposed. This makes it is easy to know what should be tested.