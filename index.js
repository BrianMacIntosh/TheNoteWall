
//The Note Wall
//Alexa skill

// started 4 Feb 2017
// by Brian MacIntosh

//TODO: allow passwords to be set for particular people
//TODO: undo deletion
//TODO: notes for everybody

'use strict';
var Alexa = require('alexa-sdk');
const config = require('./config');
const text = require('./text');

var Helpers = {

	/** Returns a summary of all the messages currently held. */
	'GetMessageSummaryString': function(context) {
		var reminders = context.attributes.reminders;

		// emergency: clear empty arrays
		for (var key in context.attributes.reminders)
		{
			if (context.attributes.reminders[key].length == 0) delete context.attributes.reminders[key];
		}

		var names = reminders ? Object.keys(reminders) : undefined;
		if (names && names.length > 0)
		{
			var message = "";

			for (var i = 0; i < names.length; i++)
			{
				if (names.length > 1 && i == names.length - 1)
				{
					message += context.t("AND") + " ";
				}

				var reminderCount = reminders[names[i]].length;
				message += context.t("NOTE_COUNT_CLAUSE", { count: reminderCount, name: names[i] });

				if (i < names.length - 1) message += ", ";
			}

			return context.t("NOTES_SUMMARY", message);
		}
		else
		{
			return context.t("NO_NOTES");
		}
	},

	/**
	 * @returns False if there was an error, which I have already emitted.
	 */
	'DeleteReminder': function(context, remindeeKey, index)
	{
		var reminders = context.attributes.reminders ? context.attributes.reminders[remindeeKey] : undefined;
		if (!reminders)
		{
			context.emit(":tell", "ERROR: No notes were found.");
			return false;
		}
		else if (index >= reminders.length)
		{
			context.emit(":tell", "ERROR: Note index out of bounds when deleting.");
			return false;
		}
		else
		{
			reminders.splice(index, 1);
			if (reminders.length == 0) delete context.attributes.reminders[remindeeKey];
			return true;
		}
	},

	/**
	 * Deletes the note specified by attributes.temporary.readTarget and attributes.temporary.lastNoteIndex.
	 */
	'ConfirmDeletion': function(context) {
		var remindeeKey = context.attributes.temporary.readTarget.toUpperCase();
		
		if (Helpers.DeleteReminder(context, remindeeKey, context.attributes.temporary.lastNoteIndex))
		{
			Helpers.GetMessages(context, context.attributes.temporary.readTarget, context.attributes.temporary.lastNoteIndex, { deleted: true });
		}
	},

	'IsIteratingMessages': function(context) {
		return context.attributes.temporary && context.attributes.temporary.readTarget;
	},

	'StopModes': function(context) {
		if (context.attributes.temporary) delete context.attributes.temporary;
	},

	'IsReprompting': function(context) {
		return context.attributes.temporary && context.attributes.temporary.repromptFunction;
	},

	'IsClearingMessages': function(context) {
		return context.attributes.temporary
			&& (context.attributes.temporary.clearTarget || context.attributes.temporary.clearAll);
	},

	'IsQueryingToRead': function(context) {
		return context.attributes.temporary && context.attributes.temporary.queryReadKey;
	},

	'IsHelpReprompt': function(context) {
		return context.attributes.temporary && context.attributes.temporary.isHelpReprompt;
	},

	'NextMessage': function(context) {
		Helpers.GetMessages(context, context.attributes.temporary.readTarget, context.attributes.temporary.lastNoteIndex);
	},

	'GetMessages': function(context, remindeeName, lastNoteIndex, options) {
		var remindeeKey = remindeeName.toUpperCase();
		var reminderCount = context.attributes.reminders && context.attributes.reminders[remindeeKey]
			? context.attributes.reminders[remindeeKey].length
			: 0;

		var response;
		if (options && options.deleted) response = context.t("DELETED_A_MESSAGE") + " ";
		else response = "";

		if (reminderCount == 0)
		{
			if (options && options.deleted)
			{
				response += context.t("THAT_WAS_ALL", remindeeName);
			}
			else
			{
				response += context.t("NO_NOTES_FOR", remindeeName);
			}
			Helpers.StopModes(context);
			context.emit(":tell", response);
			return;
		}

		var noteContent = "error";

		if (lastNoteIndex >= 0)
		{
			// continue reading through notes
			if (!options || !options.repeat) lastNoteIndex++;

			if (lastNoteIndex >= reminderCount)
			{
				Helpers.StopModes(context);
				response += context.t("THAT_WAS_ALL", remindeeName);
				context.emit(":tell", response);
				return;
			}
			else
			{
				noteContent = context.attributes.reminders[remindeeKey][lastNoteIndex];
				if (options && options.repeat)
					response += context.t("READ_NOTE", noteContent);
				else
					response += context.t("READ_NEXT_NOTE", noteContent);
			}
		}
		else
		{
			// start reading through notes
			noteContent = context.attributes.reminders[remindeeKey][0];

			// skip the summary if we came from the read-all line,
			// and there is only one reminder
			if (Object.keys(context.attributes.reminders).length > 1 || !options || !options.isFromQueryRead)
			{
				response += context.t("NOTES_SUMMARY", context.t("NOTE_COUNT_CLAUSE", { count: reminderCount, name: remindeeName })) + " ";
			}

			response += context.t("START_READING_NOTES", { content: noteContent, count: reminderCount });

			lastNoteIndex = 0;
		}

		if (!context.attributes.temporary) context.attributes.temporary = {};
		context.attributes.temporary.readTarget = remindeeName;
		context.attributes.temporary.lastNoteIndex = lastNoteIndex;
		context.emit(":ask",
			response + " " + context.t("QUERY_DELETE_NOTE"),
			context.t("ITERATE_MESSAGE_REPEAT", remindeeName, noteContent));
	},

	'ClearMessages': function(context, remindeeName, options) {
		var remindeeKey = remindeeName.toUpperCase();

		if (context.attributes.reminders && context.attributes.reminders[remindeeKey])
		{
			if (options && options.isConfirmedDelete)
			{
				// delete with no further confirmation
				delete context.attributes.reminders[remindeeKey];
				Helpers.StopModes(context);
				context.emit(":tell", context.t("CLEAR_ALL_FOR_COMPLETE", remindeeName));
			}
			else
			{
				if (!context.attributes.temporary) context.attributes.temporary = {};
				context.attributes.temporary.clearTarget = remindeeName;

				context.emit(":ask",
					context.t("CLEAR_ALL_NOTES_FOR", { count: context.attributes.reminders[remindeeKey].length, name: remindeeName }),
					context.t("CLEAR_ALL_NOTES_FOR_REPEAT", remindeeName));
			}
		}
		else
		{
			context.emit(":tell", context.t("NO_NOTES_FOR", remindeeName));
		}
	},
}

var IntentImpl = {

	'LeaveMessage': function(context, remindeeName, reminderMessage) {
		var repromptSkipError = context.attributes.temporary ? context.attributes.temporary.repromptSkipError : false;
		Helpers.StopModes(context);

		if (!remindeeName && !reminderMessage)
		{
			context.emit('LeaveMessageGenericIntent');
			return;
		}
		else if (!remindeeName)
		{
			if (!context.attributes.temporary) context.attributes.temporary = {};
			context.attributes.temporary.repromptMessage = reminderMessage;
			context.attributes.temporary.repromptFunction = 'LeaveMessage';
			context.emit(":ask",
				context.t("LEAVEMESSAGE_REPROMPT_FOR_NAME", reminderMessage),
				context.t("LEAVEMESSAGE_REPROMPT_FOR_NAME_REPEAT", reminderMessage));
			return;
		}
		else if (!reminderMessage)
		{
			if (!context.attributes.temporary) context.attributes.temporary = {};
			context.attributes.temporary.repromptName = remindeeName;
			context.attributes.temporary.repromptFunction = 'LeaveMessage';
			context.emit(":ask",
				context.t(repromptSkipError ? "PROMPT_FOR_MESSAGE_SHORT" : "PROMPT_FOR_MESSAGE", remindeeName),
				context.t("PROMPT_FOR_MESSAGE_SHORT", remindeeName));
			return;
		}

		var remindeeKey = remindeeName.toUpperCase();

		if (!context.attributes.reminders) context.attributes.reminders = {};
		if (!context.attributes.reminders[remindeeKey]) context.attributes.reminders[remindeeKey] = [];

		// convert third-person pronouns to second-person
		//HACK: loc
		reminderMessage = reminderMessage.replace("his", "your");
		reminderMessage = reminderMessage.replace("her", "your");

		context.attributes.reminders[remindeeKey].push(reminderMessage);

		context.attributes.lastMessage = { remindeeName: remindeeName, index: context.attributes.reminders[remindeeKey].length-1 };

		var response = context.t("LEAVEMESSAGE_CONFIRM", remindeeName, reminderMessage);
		context.emit(":tell", response);
	},

	'GetMessages': function(context, remindeeName, reminderMessage) {
		var isFromQueryRead = context.attributes.temporary
			&& (context.attributes.temporary.isFromQueryRead || context.attributes.temporary.queryReadKey);
		Helpers.StopModes(context);

		if (!remindeeName)
		{
			if (!context.attributes.temporary) context.attributes.temporary = {};
			context.attributes.temporary.repromptFunction = 'GetMessages';
			context.emit(":ask", context.t("GETMESSAGES_BADNAME"), context.t("GETMESSAGES_BADNAME_REPEAT"));
			return;
		}

		var lastNoteIndex = -1;
		if (context.attributes.temporary && context.attributes.temporary.lastNoteIndex !== undefined)
			lastNoteIndex = context.attributes.temporary.lastNoteIndex;

		Helpers.GetMessages(context, remindeeName, lastNoteIndex, { isFromQueryRead: isFromQueryRead });
	},

	'ClearMessages': function(context, remindeeName) {
		var isConfirmedDelete = context.attributes.temporary && context.attributes.temporary.isConfirmedDelete;
		Helpers.StopModes(context);

		if (!remindeeName)
		{
			if (!context.attributes.temporary) context.attributes.temporary = {};
			context.attributes.temporary.repromptFunction = 'ClearMessages';
			context.emit(":ask", context.t("DELETEMESSAGES_BADNAME"), context.t("DELETEMESSAGES_BADNAME_REPEAT"));
			return;
		}

		Helpers.ClearMessages(context, remindeeName, { isConfirmedDelete: isConfirmedDelete });
	},

}

var handler = {

	// called by a generic no-param invocation
	'LaunchRequest': function() {
		Helpers.StopModes(this);
		if (!this.attributes.temporary) this.attributes.temporary = {};
		this.attributes.temporary.isHelpReprompt = true;

		var response = Helpers.GetMessageSummaryString(this);
		var names = this.attributes.reminders ? Object.keys(this.attributes.reminders) : undefined;
		var nameCount = names ? names.length : 0;
		var query = this.t(nameCount == 0 ? "SIMPLE_HELP_QUERY_NO_NOTES" : "SIMPLE_HELP_QUERY");
		this.emit(':ask',
			response + " " + query,
			query);
	},

	// called when user exits or times out
	// not called when program ends with shouldEndSession
	'SessionEndedRequest': function() {
		if (this.attributes.temporary) delete this.attributes.temporary;
		this.emit(':saveState', true);
	},

	/** Create a new message for someone. */
	'LeaveMessageIntent': function() {
		var slots = this.event.request.intent.slots;
		IntentImpl.LeaveMessage(this,
			slots && slots.RemindeeName ? slots.RemindeeName.value : undefined,
			slots && slots.ReminderMessage ? slots.ReminderMessage.value : undefined);
	},

	'RepromptNameIntent': function() {
		if (Helpers.IsReprompting(this))
		{
			var slots = this.event.request.intent.slots;
			IntentImpl[this.attributes.temporary.repromptFunction](this,
				slots && slots.RemindeeName ? slots.RemindeeName.value : undefined,
				this.attributes.temporary.repromptMessage);
		}
		else
		{
			this.emit('Unhandled');
		}
	},

	'NobodyIntent': function() {
		if (Helpers.IsReprompting(this))
		{
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else
		{
			this.emit('Unhandled');
		}
	},

	'RepromptMessageIntent': function() {
		if (Helpers.IsReprompting(this))
		{
			var slots = this.event.request.intent.slots;
			IntentImpl[this.attributes.temporary.repromptFunction](this,
				this.attributes.temporary.repromptName,
				slots && slots.ReminderMessage ? slots.ReminderMessage.value : undefined);
		}
		else
		{
			this.emit('Unhandled');
		}
	},

	'DeleteLastMessageIntent': function() {
		//TODO: work while reading
		if (this.attributes.lastMessage && this.attributes.reminders)
		{
			var remindeeName = this.attributes.lastMessage.remindeeName;
			var remindeeKey = remindeeName.toUpperCase();
			var reminders = this.attributes.reminders[remindeeKey];
			var lastIndex = this.attributes.lastMessage.index;
			var reminderMessage = reminders[lastIndex];
			delete this.attributes.lastMessage;
			if (reminders && lastIndex < reminders.length)
			{
				if (Helpers.DeleteReminder(this, remindeeKey, lastIndex))
				{
					this.emit(":tell", this.t("DELETED_SPECIFIC_MESSAGE", remindeeName, reminderMessage));
				}
				return;
			}
		}
		
		this.emit(":tell", this.t("NO_LAST_REMINDER"));
	},

	'GetMyMessagesIntent': function() {
		Helpers.StopModes(this);

		if (!this.attributes.temporary) this.attributes.temporary = {};
		this.attributes.temporary.repromptFunction = 'GetMessages';
		this.emit(":ask", this.t("QUERY_WHO_TO_READ_ME"), this.t("QUERY_WHO_TO_READ_ME"));
	},

	'GetMessagesGenericIntent': function() {
		Helpers.StopModes(this);

		if (!this.attributes.temporary) this.attributes.temporary = {};
		this.attributes.temporary.repromptFunction = 'GetMessages';
		this.emit(":ask", this.t("QUERY_WHO_TO_READ"), this.t("QUERY_WHO_TO_READ"));
	},

	'DeleteMyMessagesIntent': function() {
		Helpers.StopModes(this);

		if (!this.attributes.temporary) this.attributes.temporary = {};
		this.attributes.temporary.repromptFunction = 'ClearMessages';
		this.attributes.temporary.isConfirmedDelete = true;
		this.emit(":ask", this.t("QUERY_WHO_TO_DELETE_ME"), this.t("QUERY_WHO_TO_DELETE_ME"));
	},

	'GetAllMessagesIntent': function() {
		Helpers.StopModes(this);

		var response = Helpers.GetMessageSummaryString(this);
		var names = this.attributes.reminders ? Object.keys(this.attributes.reminders) : undefined;
		var nameCount = names ? names.length : 0;
		if (nameCount == 1)
		{
			// there is one person. Should I read their notes?
			var remindeeKey = names[0];
			var reminders = this.attributes.reminders[remindeeKey];
			var reminderCount = reminders ? reminders.length : undefined;
			if (reminderCount == 0)
			{
				this.emit(":tell", this.t("NO_NOTES"));
			}
			else
			{
				// they have one
				if (!this.attributes.temporary) this.attributes.temporary = {};
				this.attributes.temporary.queryReadKey = remindeeKey;
				//TODO: reprompt better
				response += " " + this.t("QUERY_TO_READ", { count: reminderCount });
				this.emit(":ask", response, response);
			}
		}
		else if (nameCount > 0)
		{
			// there are notes for multiple people. Whose notes should be read?
			if (!this.attributes.temporary) this.attributes.temporary = {};
			this.attributes.temporary.repromptFunction = 'GetMessages';
			this.attributes.temporary.isFromQueryRead = true;
			response += " " + this.t("QUERY_WHO_TO_READ");
			this.emit(":ask", response, this.t("QUERY_WHO_TO_READ"));
		}
		else
		{
			// there are no notes
			this.emit(":tell", response);
		}
	},

	/** Start or continue reading the messages for a particular person. */
	'GetMessagesIntent': function() {
		Helpers.StopModes(this);
		
		var slots = this.event.request.intent.slots;
		IntentImpl.GetMessages(this,
			slots && slots.RemindeeName ? slots.RemindeeName.value : undefined);
	},

	/** Stops iterating through notes. */
	'AMAZON.StopIntent': function() {
		this.emit("AMAZON.CancelIntent");
	},

	/** Stops iterating through notes. */
	'AMAZON.CancelIntent': function() {
		if (Helpers.IsIteratingMessages(this)
			|| Helpers.IsReprompting(this)
			|| Helpers.IsHelpReprompt(this)
			|| Helpers.IsClearingMessages(this)
			|| Helpers.IsQueryingToRead(this))
		{
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else
		{
			this.emit("Unhandled");
		}
	},

	/** Deletes the current note. */
	'AMAZON.YesIntent': function() {
		if (Helpers.IsIteratingMessages(this))
		{
			Helpers.ConfirmDeletion(this);
		}
		else if (Helpers.IsClearingMessages(this))
		{
			if (this.attributes.temporary && this.attributes.temporary.clearTarget)
			{
				Helpers.ClearMessages(this, this.attributes.temporary.clearTarget, { isConfirmedDelete : true });
			}
			else
			{
				delete this.attributes.reminders;
				Helpers.StopModes(this);
				this.emit(":tell", this.t("CLEAR_ALL_COMPLETE"));
			}
		}
		else if (Helpers.IsQueryingToRead(this))
		{
			IntentImpl.GetMessages(this, this.attributes.temporary.queryReadKey);
		}
		else if (Helpers.IsHelpReprompt(this))
		{
			this.emit("LeaveMessageGenericIntent");
		}
		else
		{
			this.emit("Unhandled");
		}
	},

	/** Skips to the next note. */
	'AMAZON.NoIntent': function() {
		if (Helpers.IsIteratingMessages(this))
		{
			Helpers.NextMessage(this);
		}
		else if (Helpers.IsClearingMessages(this))
		{
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else if (Helpers.IsQueryingToRead(this))
		{
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else if (Helpers.IsHelpReprompt(this))
		{
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else
		{
			this.emit("Unhandled");
		}
	},

	/** Repeats the current note. */
	'AMAZON.RepeatIntent': function() {
		if (Helpers.IsIteratingMessages(this))
		{
			Helpers.GetMessages(this, this.attributes.temporary.readTarget, this.attributes.temporary.lastNoteIndex, { repeat: true });
		}
		else
		{
			this.emit("Unhandled");
		}
	},

	/** Starts over note iteration from the beginning. */
	'AMAZON.StartOverIntent': function() {
		if (Helpers.IsIteratingMessages(this))
		{
			Helpers.GetMessages(this, this.attributes.temporary.readTarget, -1);
		}
		else
		{
			this.emit("Unhandled");
		}
	},

	/** Skips to the next note. */
	'NextMessageIntent': function() {
		if (Helpers.IsIteratingMessages(this))
		{
			Helpers.NextMessage(this);
		}
		else
		{
			this.emit("GetAllMessagesIntent");
		}
	},

	'ClearMessagesIntent': function() {
		var slots = this.event.request.intent.slots;
		IntentImpl.ClearMessages(this, slots && slots.RemindeeName ? slots.RemindeeName.value : undefined);
	},

	'ClearAllMessagesIntent': function() {
		if (this.attributes.reminders && Object.keys(this.attributes.reminders).length > 0)
		{
			if (!this.attributes.temporary) this.attributes.temporary = {};
			this.attributes.temporary.clearAll = true;

			this.emit(":ask", this.t("CLEAR_ALL_CONFIRM"), this.t("CLEAR_ALL_CONFIRM_REPEAT"));
		}
		else
		{
			this.emit(":tell", this.t("NO_NOTES"));
		}
	},

	'LeaveMessageGenericIntent': function() {
		Helpers.StopModes(this);
		if (!this.attributes.temporary) this.attributes.temporary = {};
		this.attributes.temporary.repromptFunction = 'LeaveMessage';
		this.attributes.temporary.repromptSkipError = true;
		this.emit(":ask", this.t("LEAVEMESSAGE_PROMPT"), this.t("LEAVEMESSAGE_PROMPT"));
	},

	'AMAZON.HelpIntent': function() {
		Helpers.StopModes(this);
		if (!this.attributes.temporary) this.attributes.temporary = {};
		this.attributes.temporary.isHelpReprompt = true;
		this.emit(':ask',
			this.t("SIMPLE_HELP") + " " + this.t("SIMPLE_HELP_QUERY"),
			this.t("SIMPLE_HELP_QUERY"));
		
		// should naturally fall into LeaveNoteGeneric or GetMyMessagesIntent
	},

	'Unhandled': function() {
		if (Helpers.IsIteratingMessages(this)
			|| Helpers.IsClearingMessages(this)
			|| Helpers.IsQueryingToRead(this))
		{
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else if (Helpers.IsReprompting(this))
		{
			//TODO:
			Helpers.StopModes(this);
			this.emit(":responseReady");
		}
		else
		{
			this.emit(':tell', this.t("UNRECOGNIZED_IDLE"));
		}
	}

};

exports.handler = function(event, context, callback, TESTING)
{
	var alexa = Alexa.handler(event, context);
	alexa.resources = text;
	alexa.appId = config.appId;
	if (!TESTING) alexa.dynamoDBTableName = config.dbName;
	alexa.registerHandlers(handler);
	alexa.execute();
};