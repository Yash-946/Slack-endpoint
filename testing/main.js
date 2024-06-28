export function formatMeetingInput(input) {
  // Split the input into lines
  const lines = input.split('\n');

  // Join all lines into a single string without newlines
  const formattedOutput = lines.join('');

  return formattedOutput;
}

// Example usage
const input = `ï»¿Title: Note Taker Test Call
Location: google
Date: 2024-05-01T10:29:41Z UTC
Attendees: Manish Srivastava, Tanweer Alam
Link: https://app.meetgeek.ai/meeting/b39b2157-5ce0-43cb-a9db-90917371dde5
Agenda: 30-Minute General Meeting AgendaOpening and Welcome (1 minute)Quick welcome and introduction to the meeting's objectives.Review of Action Items (3 minutes)Brief update on the status of action items from the previous meeting.Key Discussions (20 minutes)Focused discussion on one or two key issues that need input or decision-making.Time-bound to ensure brevity and relevance.Next Steps (3 minutes)Quick summary of action items arising from the meeting's discussions.Assigning of responsibilities for these items.Wrap-Up (3 minutes)Final thoughts or comments.Confirm the time for the next meeting.

Meeting Summary
The meeting discussed the DMI Meeting Node Keeper and Joom Account Activation, with the decision that participants do not need to activate Joom accounts. Manish mentioned sending a separate Joom for further discussion. The conversation then shifted to Marjara's Audit Questionnaire and Form Filling, focusing on the specific details needed in a particular format and the questionnaire's purpose based on ISA 315R. Manish requested to fill the form but faced challenges in finding all required details, leading to a task to complete. Tanweer suggested sending the form for review and planning to fill it out in the coming days for future action.

Meeting Highlights
1. Discussion on DMI Meeting Node Keeper and Joom Account Activation
* Manish mentioned sending a separate Joom for further discussion, indicating a plan to continue the conversation.
2. Discussion on Marjara's Audit Questionnaire and Form Filling
* Manish asked to fill a form related to Marjara's audit but faced challenges in finding all the required details, indicating a task to complete.
* Tanweer suggested sending the form for review and planning to fill it out in the coming days, indicating a plan for future action.
Meeting Transcript

Unknown speaker - 01:47
Seems you joined the wrong meeting the previous month, is that correct?
So when I joined this call, this DMI meeting node keeper is already here.

Manish Srivastava - 02:01
And if we see this console, what is there?
So it is recording this particular thing.
And the interesting thing is I have not activated the Joom account associated with the DMI meetings.
It seems it does not require any Joom account as such.
Yes, for participants it is not required to Joom.
I don't think we need to activate this.

Manish Srivastava - 02:40
If we end this call, I am sending you a separate Joom so that we could check So I think we can discuss two or three minutes more.

Tanweer Alam - 02:52
I have one more thing that needs to be discussed.
So just I am saving my screen.
Let us do one thing.
So once we have this transcript, if we receive this transcript over email, I will inform Siv that I am going to test this particular thing.
And I will ask Manish to add this email id in view of the SIV's call.
Yes, I think he could add this email id as a participant.

Tanweer Alam - 03:25
Yes.
Then let us see what is going to happen.
But the primary thing is that we receive an email, at least me and you receive an email from this email id.
What is the transcript and what is the purpose of the meeting?
And then try to check what else we can do.
Now, let me know.

Tanweer Alam - 03:44
So, I am setting my screen.
So, I think one thing is pending for Marjara's audit.
So, just I have opened the requirements.
A list of participants is a list of participants that may occur during meeting
Yes, this one.
So, Manish is asking to fill this form but I am not able to find all the details which is available in this list actually.

Tanweer Alam - 04:57
And why they need this?
I don't know why this is.
After completion of audit, he required some details in this format.
Purpose of the questionnaire.
Obtaining and understanding of the IT environment in capacity step in our audit methodology.
This questionnaire contains matters that the auditor may consider in obtaining and understanding of the IT environment and is based on ISA 315R.

Tanweer Alam - 05:41
Completed with a specific subject from the majora's audit methodology.
That this tab is a calling permission is required, so just call it down.
Send this form to me, just send this form to me, let me have a look of it.
Sure, sure, sure.
And then we will connect our call and we could try to fill it out, maybe tomorrow or day after.
Sure, sure, so I am just setting.

Tanweer Alam - 06:17
And you can uninstall this firethumb.
This firethumb is no more required.
Tick, tick, ok, I will do Tick, I am ending this call and sending you a separate room.
Sure, sure, ok.`;

const output = formatMeetingInput(input);
console.log(output);
