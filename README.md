Introduction
------------
Asterisk removed code 16 so that no flash can be sent to trunk and PSTN despite the flash event from FXS and phone is detected.
This is a nodeJS script that make use of AMI to detect flash event and forward the flash event to turnk.


Prerequisite
------------
1. Install nodeJS sand asterisk-ami-client
```nodeJS
npm install asterisk-ami-client
```
2. Apply patch for main/app.c and res/res_rtp_asterisk.c to add back code 16 from https://github.com/life-of-e/asterisk_sip_hook_flash

Sample Setup
------------
PSTN - HT813 FXO - FreePBX - HT802 - Analogue Phone

HT802: Need to send flash hook and use RFC2833

HT813: Need to send flash hook to PSTN and use RFC2833

FreePBX: Tested at 17.0.19.32. Need to use RFC4733 for trunk and extension

Asterisk: Tested at 22.5.2

Operated under RaspberryPi5 8GB with latest RaspBerryPi OS.

Usage
-----
Edit trunk and ext(optional) in the script. They are the prefix of the channels
Execute ```bash node forwardFlash.js``` or create a service for it

For raspberryPi building, make sure app.c and res_rtp_asterisk.c are updated before compiling. Or you can edit the files, copy them to the same path as install script and add a copy line like I showned in the patch. 

