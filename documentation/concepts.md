# Tests should come before the code

Tests should come before the code. This is both in terms of order like in TDD and also in terms of priority. It is easy to improve the quality of the code when it has good tests. In fact, this is essentially what happens in TDD and its refactoring step. It is hard to improve the quality of the code when you have bad tests. This is because bad tests make it hard to refactor. Bad tests also get worse over time as they get broken through maintenance and then are poorly updated as the context of why they are there and what they do is difficult to discern at that stage.

## Only stable expectations should have tests

A test is setting up an expectation for a result from a part of the code. Tests protect you from change by notifying you when those expectations have been broken. The only expectations that should be checked are those that are stable. Anything else is testing implementation details which leads to brittle tests. Adding a new class or a new method is not a reason to add a new test. The only reason for a new test is when some new stable expectation has been added. For example, a new behaviour has been exposed.

Tests come with a cost, for example there is maintenance effort and run time. If you have more tests than you need, than you are introducing waste. If you have tests that are more complicated than they need to be, for example they involve too much mocking, then they are also in part wasteful as they are difficult to maintain and tend to decay over time.

The waste that comes from tests acrrues so the longer uneeded tests are in the code base the more costly they will be. Like with how it can sometimes be useful to write code without tests, for example when doing spikes. It can also be useful to write tests that don't verify stable expectations, for example to steer the design of the code and take small steps. Like the spike code these tests should be thrown away afterwards.

Resources for further reading:
 - [Why Most Unit Testing is Waste](https://rbcs-us.com/documents/Why-Most-Unit-Testing-is-Waste.pdf) By James O Coplien
 - [TDD, Where Did It All Go Wrong](https://youtu.be/HNjlJpuA5kQ) by Ian Cooper
 - [Kent Beck Style TDD - Seven Years After](https://github.com/iancooper/Presentations/blob/master/Kent%20Beck%20Style%20TDD%20-%20Seven%20Years%20After.pdf) by Ian Cooper
 - [Code coverage < Use Case Coverage](https://kentcdodds.com/blog/how-to-know-what-to-test#code-coverage--use-case-coverage) by Kent C. Dodds

## The fundamental question of software development is: "what is the next test to write?"

Knowing the next test to write is difficult. It requies domain knowledge and skill. Domain knowledge is reuqired because in order to know the expectations that should be verified you need to know about the problem being solved. Skill is required because finding the next test to write also involves thinking about what the next smallest most logical outcome to focus on would be. A large part of being a good software developer is being able to keep the number of things that are happening in your head to a minimum. You can only do this if the next expectation you try to implement in the code is only a small step forwards. If the step is too large, then implementing that expectation will involve thinking about a large variety of things. 

Techniques built around solving the problem of how to find the next test to write are:
 - TDD - TDD enables you to keep what is happening in your head to a minimum. It does this by separating the implementation (“How to get it to work?”) and the design (“How to keep it well structured?”) into two separate tasks so that they are both not in your head at once. All you need to think about is how to get the current failing test to pass. The design emerges from the small steps taken to complete the TDD red, green, refactor cycles. Once the test is passing then you can think about refactoring. One additional advantage of TDD is that it is always only a small step back to safe ground. You can back
out of changes easily because you always proceed from green tests. If this wasn’t the case, then when there were issues you would have to bring the whole design into your head to think through what could be causing the issue. With normal testing, localisation of the issue is very important as you don't know when or what changes caused the test to break. With TDD, a red test means there was an issue in the last change you made. As you know what changes caused the issue in the worst case you can just reverse them. This makes localisation of the issue is less important. 
 - BDD - TDD is often implemented poorly. It is meant to be about testing behavior, but people often end up over testing by adding tests whenever a new  method or class is added. This easily leads to testing implementation details. BDD evolved out of TDD and is about bringing the fiocus back to testing behaviour.
 - DDD - you need domain knowledge to know the right behaviours you should build into your code. This means you need domain knowledge to know the next test you should write. DDD revolves around building a ubiquitous language that is shared by both developers and domain exports This language is built through interacting with domain experts to distill out critical domain knowledge. This domain knowledge is then incorporated into the tests and code.

## Good architecture exposes stable expectations

Adaptability and stability are both important attributes of well designed software systems. Adaptability means that a system can cope readily with a wide range of requirements. Stability, on the other hand, means that the system is resistant or protected from change. Stability ensures that a system will continue to do what it is designed to do. Adaptability and stability are forces that are in constant tension. On one hand, systems must be able to confront novelty, but they must also expose stable behaviours. 

One of the characteristics of a good software architecture is that it is very easy to know where the stable expectations are. That is, it is very easy to know where tests should be written and what can be safely mocked in the tests if that is required. Bad software architectures couple parts of the code that should have stable expectations with other parts that are unstable or adaptable. This is bad because it leads to things like testing implementation details or over mocking in which you treat an unstable expectation as if it was a stable one.

Good architecture segments components built for adaptability from components that are built for stablity. This segmentation often occurs using layers.

# Layers

## Chunking enables the comprehension of complex and complicated problems

As humans, our attention is serial and our short-term memory is very limited. This means that we can only think about a small number of units at once. The brain overcomes this limitation by chunking information. Chunking is essentially re-coding information in a more efficient way. For example, the 9-digit binary number 101000111 can be re-coded as the 3-digit decimal number 327. This makes it easier to process and memorise.

Chunking is a fundamental part of how we perceive and reason about the world. For example, when reading we perceive words, sentences or even paragraphs as single units. We bypass their representation as collections of letters or phonemes. 

An expert is someone who has spent a lot of time developing and refining their chunks in a particular domain. What seperates experts from novices is that an expert reasons about a problem using their well developed chunks while a novice reasons about problems using the lower level units that it is made of. Reasoning about the problem using chunks makes the expert capable of solving problems that are much more complicated and complex than what a novice can solve. 

## Layers are a software implementation of chunking

As software grows, it becomes harder to reason about and to understand. At a certain size, it becomes useful to be able to take a whole chunk of the code and be able to talk about it as if it was a single unit. This is commonly done by creating a layer. A layer takes a whole chunk of code and and hides it behind a stable interface. This allows you to think about the chunk using the interface and you don't need to worry about the implementation details.

Layers remove the ability for changes to implementation details to ripple through the whole system. They also mean that the components the system is made of can replaced by alternative implementations without affecting the rest of the system. Layer boundaries are where the stable expectations are exposed. This makes it is easy to know what should be tested. 

# Domain knowledge

## Different chunks are used in different domains

In the real world, chunks are often externalised as concepts and terms. Chunks by their nature only make sense in a given context. That is, to know what these terms and concepts mean you would need knowledge in a particular domain. For example, to know what the following terms means you would need domain knowledge of the quantive trading domain or some similar domain. Arbitrage, sharpe ratio, time weighted average price, alpha, beta etc.

Across different domains the exact same terms can mean different things. For example, the word client can mean a human identity with a username and password used to authenticate within a webpage. It could also be a system service which consumes an API. Similarly, the term booking could mean reserving a ticket for an event, but it could also refer to a player being punished by the referee for foul play.

To accurately model problems and write solutions fpr them in code you need to know the right chunks to use. The right chunks to use are often those of the domain experts.

## Subdomains and shared domains

As applications get more complicated, it becomes apparent that there are relationships between the domains. There are subdomains or groups of domains that only make sense as a group. These types of domains have a parent grouping folder. There are also shared domains. These domains are not meant to expose meaningful functionality in and of themselves, but are meant to provide common or core functionality that is used by other domains. Shared domains are how you share content across multiple domains. There are three types of shared domains based on the level at which they apply. These levels are:

 - application - this is for content that can be used across any application. An example would be the domain "shared/table" which is for the libraries related to a table component that can be used in any application
 - inside an application -It is for content that belongs to a single application. In general, extra care should be taken with these shared domains as it is likely that they are used by many different domains which means a large number of libraries will be affected when they are updated
 - subdomain - parent and child domains exist when there is a group of domains that all share particular functionality that is not used anywhere else in the application. For example, a cash account in a bank application might have domains for transaction history, account details, etc. these domains could all have the same header components or utility files. The common code would belong in a shared domain.