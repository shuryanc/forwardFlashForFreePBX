const AsteriskAmiClient = require('asterisk-ami-client');

const client = new AsteriskAmiClient();

let trunk="PJSIP/{your trunk id}"
Let ext="PJSIP/{your ext id}"
let targetChannel = "";
let sourceChannle = "";


client.connect('user', 'password', {
  host: 'host',
  port: 5038,
}).then(async () => {
  console.log('Connected to Asterisk AMI');

  // Example: also listen for other events like Newchannel, Link, Hangup
  client.on('Newchannel', event => {
    if (event.Channel.startsWith(trunk))
      console.log('Trunk Channel: ', event.Channel);
    else
      console.log('New Channel:', event.Channel);
  });

  client.on('event', event => {
  // Check if the event is related to a channel starting with 'PJSIP/{trunk id}'
    if (event.Event === 'Newchannel' && event.Channel && event.Channel.startsWith(trunk)) {
      targetChannel=event.Channel
    }
    if (event.Event === 'Newchannel' && event.Channel && event.Channel.startsWith(ext)) {
      sourceChannel=event.Channel
    }
  });

  // Listen for flash events
  client.on('Flash', (evt) => {
    console.log('Flash Event Detected:', evt);

    // Check if we have a target channel
    if (targetChannel && evt.Channel === sourceChannel) {
      // Send flash command to the target channel
      sendFlashCommand(targetChannel);
    } else if(targetChannel) {
      console.log('No target channel available to send flash command.');
    }
    if (evt.Channel === targetChannel){
      console.log('targetChannel evt: ', evt);
    }
  });

  client.on('event', (event) => {
    if (event.event === 'Flash') {
      console.log('Flash event detectedE:', event);
      if (event.Channel === targetChannel) {
        console.log('Flash received on channel:', event.Channel);
      }
    }
  });

  // Function to send flash command
  function sendFlashCommand(channel) {
    console.log('sendFlashCommand to: ', channel);

    try { 
      const playDTMFResponse = client.action({
        'action': 'PlayDTMF',
        'Channel': channel,
        'Digit': 'f',
        'Duration':  300
        })
        console.log('PlayDTMF response:', playDTMFResponse);
    } catch (err) {
        console.error('Error playing DTMF command:', err);
    }

  }


  client.on('Link', event => {
    console.log('Call established between:', event.Channel1, 'and', event.Channel2);
  });

  client.on('Hangup', event => {
    console.log('Channel hung up:', event.Channel);
  });

}).catch(err => {
  console.error('Connection error:', err);
});
