Gainbridge
Technical Assessment for Sr QA Automation Engineer applicant Shana Hoddy

General Test Outline for the SteadyPace Growth Calculator can be viewed at:
https://www.dropbox.com/scl/fi/10p48l47cbkvlaojoftzy/Gainbridge.paper?rlkey=nf9gg7pzxoefbucv3pa99lzif&dl=0

A small subset of the functional tests as outlined in the link above has been automated against url:
"https://enrollment-2.gainbridge.io/product-selection/steadypace"
* Validation for the investment amounts
* Validation for the investment duration & expected interest rates
* Validation for calculations for amount,duration, and rates.

Due to time restraints not all solutions are ideal, for example error handling has been ommited. I've made note
of some limitations in the code comments. 

Project structure:
* data: containing test data
* pageobjects: contains the page accessors for the tested page
* test: the automated tests
* utilities: Helper methods for calculating compound interest rates
* config.*.json files: I would place test environment specifics here such as URL or API endpoints. However, due to time
I was unable to complete this portion and instead hard-coded the test URL. 

