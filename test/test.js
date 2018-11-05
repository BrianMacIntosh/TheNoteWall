
const testconfig = require('./config');
const config = require('../config');

const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(require('../index'), config.appId, testconfig.userId);
alexaTest.initializeI18N(require("../text"));

var launchRequest = alexaTest.getLaunchRequest();
var brianFeedSeymourRequest = alexaTest.getIntentRequest("LeaveMessageIntent",
	{
		"RemindeeName": "brian",
		"ReminderMessage": "feed seymour"
	});
var brianEatDinnerRequest = alexaTest.getIntentRequest("LeaveMessageIntent",
	{
		"RemindeeName": "brian",
		"ReminderMessage": "eat dinner"
	});
var momIWentToThePartyRequest = alexaTest.getIntentRequest("LeaveMessageIntent",
	{
		"RemindeeName": "mom",
		"ReminderMessage": "i went to the party"
	});
var unknownRemindeeRequest = alexaTest.getIntentRequest("LeaveMessageIntent",
	{
		"ReminderMessage": "go to the store"
	});
var unknownMessageRequest = alexaTest.getIntentRequest("LeaveMessageIntent",
	{
		"RemindeeName": "brian"
	});
var emptyLeaveMessageRequest = alexaTest.getIntentRequest("LeaveMessageIntent");
var readBrianRequest = alexaTest.getIntentRequest("GetMessagesIntent", { "RemindeeName": "brian" });
var getAllMessagesRequest = alexaTest.getIntentRequest("GetAllMessagesIntent");
var clearBrianMessagesRequest = alexaTest.getIntentRequest("ClearMessagesIntent", { "RemindeeName": "brian" });
var brianRequest = alexaTest.getIntentRequest("RepromptNameIntent", { "RemindeeName": "brian" });
var nobodyRequest = alexaTest.getIntentRequest("NobodyIntent");
var goToTheStoreRequest = alexaTest.getIntentRequest("RepromptMessageIntent", { "ReminderMessage": "go to the store" });
var deleteLastMessageRequest = alexaTest.getIntentRequest("DeleteLastMessageIntent");
var getMyMessagesRequest = alexaTest.getIntentRequest("GetMyMessagesIntent");
var deleteMyMessagesRequest = alexaTest.getIntentRequest("DeleteMyMessagesIntent");
var clearAllMessagesRequest = alexaTest.getIntentRequest("ClearAllMessagesIntent");
var nextMessageRequest = alexaTest.getIntentRequest("NextMessageIntent");
var leaveMessageRequest = alexaTest.getIntentRequest("LeaveMessageGenericIntent");
var getMessagesGenericRequest = alexaTest.getIntentRequest("GetMessagesGenericIntent");
var yesRequest = alexaTest.getIntentRequest("AMAZON.YesIntent");
var noRequest = alexaTest.getIntentRequest("AMAZON.NoIntent");
var helpRequest = alexaTest.getIntentRequest("AMAZON.HelpIntent");
var repeatRequest = alexaTest.getIntentRequest("AMAZON.RepeatIntent");
var startOverRequest = alexaTest.getIntentRequest("AMAZON.StartOverIntent");
var stopRequest = alexaTest.getIntentRequest("AMAZON.StopIntent");
var cancelRequest = alexaTest.getIntentRequest("AMAZON.CancelIntent");

var launchNoNotesResult = {
	request: launchRequest,
	says: alexaTest.t("NO_NOTES") + " " + alexaTest.t("SIMPLE_HELP_QUERY_NO_NOTES"),
	reprompts: alexaTest.t("SIMPLE_HELP_QUERY_NO_NOTES"),
	shouldEndSession: false
};
var launchBrianOneMessageResult = {
	request: launchRequest,
	says: "The Note Wall has 1 note for BRIAN. " + alexaTest.t("SIMPLE_HELP_QUERY"),
	reprompts: alexaTest.t("SIMPLE_HELP_QUERY"),
	shouldEndSession: false
};
var launchBrianTwoMessagesResult = {
	request: launchRequest,
	says: "The Note Wall has 2 notes for BRIAN. " + alexaTest.t("SIMPLE_HELP_QUERY"),
	reprompts: alexaTest.t("SIMPLE_HELP_QUERY"),
	shouldEndSession: false
};
var brianFeedSeymourResult = {
	request: brianFeedSeymourRequest,
	says: alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "feed seymour"),
	shouldEndSession: true
};
var brianEatDinnerResult = {
	request: brianEatDinnerRequest,
	says: alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "eat dinner"),
	shouldEndSession: true
};
var momIWentToThePartyResult = {
	request: momIWentToThePartyRequest,
	says: alexaTest.t("LEAVEMESSAGE_CONFIRM", "mom", "i went to the party"),
	shouldEndSession: true
};
var unknownRemindeeResult = {
	request: unknownRemindeeRequest,
	says: alexaTest.t("LEAVEMESSAGE_REPROMPT_FOR_NAME", "go to the store"),
	reprompts: alexaTest.t("LEAVEMESSAGE_REPROMPT_FOR_NAME_REPEAT", "go to the store"),
	shouldEndSession: false
};
var unknownMessageResult = {
	request: unknownMessageRequest,
	says: alexaTest.t("PROMPT_FOR_MESSAGE", "brian"),
	reprompts: alexaTest.t("PROMPT_FOR_MESSAGE_SHORT", "brian"),
	shouldEndSession: false
};
var emptyLeaveMessageResult = {
	request: emptyLeaveMessageRequest,
	says: alexaTest.t("LEAVEMESSAGE_PROMPT"),
	reprompts: alexaTest.t("LEAVEMESSAGE_PROMPT"),
	shouldEndSession: false
};
var readBrianResultNoMessages = {
	request: readBrianRequest,
	says: alexaTest.t("NO_NOTES_FOR", "brian"),
	shouldEndSession: true
};
//TODO: getAllMessagesRequest
var clearBrianMessagesWithNoneResult = {
	request: clearBrianMessagesRequest,
	says: alexaTest.t("NO_NOTES_FOR", "brian"),
	shouldEndSession: true
};
var clearBrianMessagesWithOneResult = {
	request: clearBrianMessagesRequest,
	says: alexaTest.t("CLEAR_ALL_NOTES_FOR", { name: "brian", count: 1 }),
	says: alexaTest.t("CLEAR_ALL_NOTES_FOR_REPEAT", "brian"),
	shouldEndSession: false
};
var clearBrianMessagesWithTwoResult = {
	request: clearBrianMessagesRequest,
	says: alexaTest.t("CLEAR_ALL_NOTES_FOR", { name: "brian", count: 2 }),
	says: alexaTest.t("CLEAR_ALL_NOTES_FOR_REPEAT", "brian"),
	shouldEndSession: false
};
//TODO: brianRequest
var leaveMessageForBrianResult = {
	request: brianRequest,
	says: alexaTest.t("PROMPT_FOR_MESSAGE_SHORT", "brian"),
	reprompts: alexaTest.t("PROMPT_FOR_MESSAGE_SHORT", "brian"),
	shouldEndSession: false
};
var brianNoNotesResult = {
	request: brianRequest,
	says: alexaTest.t("NO_NOTES_FOR", "brian"),
	shouldEndSession: true
};
//TODO: nobodyRequest
//TODO: goToTheStoreRequest
var leaveMessageForBrianGoToTheStoreResult = {
	request: goToTheStoreRequest,
	says: alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "go to the store"),
	repromptsNothing: true,
	shouldEndSession: true
};
//TODO: deleteLastMessageRequest
var getMyMessagesResult = {
	request: getMyMessagesRequest,
	says: alexaTest.t("QUERY_WHO_TO_READ_ME"),
	reprompts: alexaTest.t("QUERY_WHO_TO_READ_ME"),
	shouldEndSession: false
};
//TOOD: deleteMyMessagesRequest
//TODO: clearAllMessagesRequest
//TODO: nextMessageRequest
var leaveMessageResult = {
	request: leaveMessageRequest,
	says: alexaTest.t("LEAVEMESSAGE_PROMPT"),
	reprompts: alexaTest.t("LEAVEMESSAGE_PROMPT"),
	shouldEndSession: false
};
var getMessagesGenericResult = {
	request: getMessagesGenericRequest,
	says: alexaTest.t("QUERY_WHO_TO_READ"),
	reprompts: alexaTest.t("QUERY_WHO_TO_READ"),
	shouldEndSession: false
};
//TODO: yesRequest
//TODO: noRequest
var noValidResult = {
	request: noRequest,
	saysNothing: true,
	shouldEndSession: true
}
var helpResult = {
	request: helpRequest,
	says: alexaTest.t("SIMPLE_HELP") + " " + alexaTest.t("SIMPLE_HELP_QUERY"),
	reprompts: alexaTest.t("SIMPLE_HELP_QUERY"),
	shouldEndSession: false
};
//TODO: repeatRequest
//TODO: startOverRequest
//TODO: stopRequest
var stopValidResult = { request: stopRequest, saysNothing: true, repromptsNothing: true, shouldEndSession: true };
//TODO: cancelRequest
var cancelValidResult = { request: stopRequest, saysNothing: true, repromptsNothing: true, shouldEndSession: true };

describe("LaunchRequest", function(){
	describe("with no notes", function(){
		alexaTest.test([
			launchNoNotesResult,
			[
				launchNoNotesResult,
				brianFeedSeymourResult,
				brianEatDinnerResult,
				momIWentToThePartyResult,
				unknownRemindeeResult,
				unknownMessageResult,
				emptyLeaveMessageResult,
				readBrianResultNoMessages,

				clearBrianMessagesWithNoneResult,
				leaveMessageForBrianGoToTheStoreResult,
				
				leaveMessageResult,
				getMessagesGenericResult,

				stopValidResult,
				cancelValidResult
			]
		]);
	});

	describe("with one note", function(){
		alexaTest.test([
			brianFeedSeymourResult,
			launchBrianOneMessageResult
		]);
	});

	describe("with two notes (same person)", function(){
		alexaTest.test([
			brianFeedSeymourResult,
			brianEatDinnerResult,
			launchBrianTwoMessagesResult
		]);
	});
});

describe("LeaveMessageIntent", function(){
	describe("basic test", function(){
		alexaTest.test([
			brianEatDinnerResult
		]);
	});

	describe("no name provided", function(){
		alexaTest.test([
			unknownRemindeeResult,
			{ request: brianRequest, says: alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "go to the store"), shouldEndSession: true },
		]);
	});

	describe("no message provided", function(){
		alexaTest.test([
			{ request: unknownMessageRequest, says: alexaTest.t("PROMPT_FOR_MESSAGE", "brian"), reprompts: alexaTest.t("PROMPT_FOR_MESSAGE_SHORT", "brian"), shouldEndSession: false },
			{ request: goToTheStoreRequest, says: alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "go to the store"), shouldEndSession: true },
		]);
	});

	describe("no name or message provided", function(){
		alexaTest.test([
			emptyLeaveMessageResult
		]);
	});
});

describe("GetAllMessagesIntent", function(){
	describe("with no notes", function(){
		alexaTest.test([
			{ request: getAllMessagesRequest, says: alexaTest.t("NO_NOTES"), shouldEndSession: true }
		]);
	});
	
	describe("with one note, confirmed, deleted", function(){
		alexaTest.test([
			brianEatDinnerResult,
			{ request: getAllMessagesRequest, says: "The Note Wall has 1 note for BRIAN. Should I read it?", shouldEndSession: false },
			{ request: yesRequest, says: "It says, \"eat dinner\". " + alexaTest.t("QUERY_DELETE_NOTE"), shouldEndSession: false },
			{ request: yesRequest, says: alexaTest.t("DELETED_A_MESSAGE") + " " + alexaTest.t("THAT_WAS_ALL", "BRIAN"), shouldEndSession: true }
		]);
	});

	describe("with one note, confirmed, not deleted", function(){
		alexaTest.test([
			brianEatDinnerResult,
			{ request: getAllMessagesRequest, says: "The Note Wall has 1 note for BRIAN. Should I read it?", shouldEndSession: false },
			{ request: yesRequest, says: "It says, \"eat dinner\". " + alexaTest.t("QUERY_DELETE_NOTE"), shouldEndSession: false },
			{ request: noRequest, says: alexaTest.t("THAT_WAS_ALL", "BRIAN"), shouldEndSession: true }
		]);
	});

	describe("with one note, not confirmed", function(){
		alexaTest.test([
			brianEatDinnerResult,
			{ request: getAllMessagesRequest, says: "The Note Wall has 1 note for BRIAN. Should I read it?", shouldEndSession: false },
			{ request: noRequest, saysNothing: true, shouldEndSession: true }
		]);
	});

	describe("with two notes (same person), not confirmed", function(){
		alexaTest.test([
			brianEatDinnerResult,
			brianFeedSeymourResult,
			{ request: getAllMessagesRequest, says: "The Note Wall has 2 notes for BRIAN. Should I read them?", shouldEndSession: false },
			noValidResult
		]);
	});
});

describe("AMAZON.HelpIntent", function(){
	describe("with no notes, leave a note", function(){
		alexaTest.test([
			helpResult,
			leaveMessageResult,
			leaveMessageForBrianResult,
			leaveMessageForBrianGoToTheStoreResult,
		]);
	});

	describe("read notes for brian (no notes)", function(){
		alexaTest.test([
			helpResult,
			{ request: getMyMessagesRequest, says: alexaTest.t("QUERY_WHO_TO_READ_ME"), reprompts: alexaTest.t("QUERY_WHO_TO_READ_ME"), shouldEndSession: false },
			brianNoNotesResult,
		]);
	});
});

/*
describe("GetAllMessagesIntent with two notes (same person).", function(){

	before(alexaTest.beforeGenerator(brianFeedSeymourRequest, brianEatDinnerRequest, getAllMessagesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak("The Note Wall has 2 notes for BRIAN. Should I read them?"));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["feed seymour","eat dinner"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("GetAllMessagesIntent with multiple notes (different people).", function(){

	before(alexaTest.beforeGenerator(
		brianFeedSeymourRequest, brianEatDinnerRequest, momIWentToThePartyRequest, getAllMessagesRequest
	));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak("The Note Wall has 2 notes for BRIAN, and 1 note for MOM. " + alexaTest.t("QUERY_WHO_TO_READ")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["feed seymour","eat dinner"],"MOM":["i went to the party"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("GetAllMessagesIntent with one note and followup.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, getAllMessagesRequest, yesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak("It says, \"eat dinner\". " + alexaTest.t("QUERY_DELETE_NOTE")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["eat dinner"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("GetAllMessagesIntent with two notes (different people) and followup.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, momIWentToThePartyRequest, getAllMessagesRequest, brianRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak("The Note Wall has 1 note for brian. It says, \"eat dinner\". " + alexaTest.t("QUERY_DELETE_NOTE")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["eat dinner"],"MOM":["i went to the party"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("GetMessagesIntent with one note.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, readBrianRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak("The Note Wall has 1 note for brian. It says, \"eat dinner\". Should I delete it?"));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["eat dinner"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("GetMessagesIntent with two notes (same person).", function(){

	before(alexaTest.beforeGenerator(brianFeedSeymourRequest, brianEatDinnerRequest, readBrianRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak("The Note Wall has 2 notes for brian. The first one says, \"feed seymour\". Should I delete it?"));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["feed seymour","eat dinner"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("DeleteLastMessageIntent with one note.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, deleteLastMessageRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(response.response.outputSpeech.ssml, speak(alexaTest.t("DELETED_SPECIFIC_MESSAGE", "brian", "eat dinner")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{}');
		});
		it('ends the session', function(){ assert.ok(response.response.shouldEndSession); });
	});

});

describe("Leave a note with no existing notes.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "eat dinner")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["eat dinner"]}');
		});
		it('ends the session', function(){ assert.ok(response.response.shouldEndSession); });
	});

});

describe("Leave a note with one existing note.", function(){

	before(alexaTest.beforeGenerator(brianFeedSeymourRequest, brianEatDinnerRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("LEAVEMESSAGE_CONFIRM", "brian", "eat dinner")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["feed seymour","eat dinner"]}');
		});
		it('ends the session', function(){ assert.ok(response.response.shouldEndSession); });
	});

});

describe("Clear messages with no messages.", function(){

	before(alexaTest.beforeGenerator(clearBrianMessagesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("NO_NOTES_FOR", "brian")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes),
				'{}');
		});
		it('ends the session', function(){ assert.ok(response.response.shouldEndSession); });
	});

});

describe("Clear messages with one message.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, clearBrianMessagesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("CLEAR_ALL_NOTES_FOR", { count: 1, name: "brian" })));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["eat dinner"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("Clear messages with two messages.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, brianFeedSeymourRequest, clearBrianMessagesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("CLEAR_ALL_NOTES_FOR", { count: 2, name: "brian" })));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{"BRIAN":["eat dinner","feed seymour"]}');
		});
		it('does not end the session', function(){ assert.ok(!response.response.shouldEndSession); });
	});

});

describe("Clear messages with one message and followup.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, clearBrianMessagesRequest, yesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("CLEAR_ALL_FOR_COMPLETE", "brian")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{}');
		});
		it('ends the session', function(){ assert.ok(response.response.shouldEndSession); });
	});

});

describe("Clear messages with two messages and followup.", function(){

	before(alexaTest.beforeGenerator(brianEatDinnerRequest, brianFeedSeymourRequest, clearBrianMessagesRequest, yesRequest));

	describe("Response", function(){
		it('has correct speech', function(){
			assert.equal(
				response.response.outputSpeech.ssml,
				speak(alexaTest.t("CLEAR_ALL_FOR_COMPLETE", "brian")));
		});
		it('has the correct attributes', function(){
			assert.equal(
				JSON.stringify(response.sessionAttributes.reminders),
				'{}');
		});
		it('ends the session', function(){ assert.ok(response.response.shouldEndSession); });
	});

});
*/