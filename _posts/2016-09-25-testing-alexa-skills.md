---
title:  "Testing Alexa Skills"
categories: [testing]
tags: [tests, alexa]
---
If you want to test Alexa features without owning an Echo, there are several possibilities:

* [Alexa on a Raspberry Pi][alexa-raspberrypi], which can be deployed on any computer
* [Echosim.io][echosim], that gives you an Echo in your browser

But those are not really easy to automate, as you still have to be in front of your screen and actually say the sentences for Alexa.

The next step is to remove the human random input, and that means using either pre-recorded voice commands for Alexa, or a TTS. As my english pronunciation is not that perfect, I went with a TTS. I still had the problem of having to play the audio file to Alexa and check manually that the response was the expected one.

I started to go through [Alexa on a Raspberry Pi][alexa-raspberrypi] to see if it was modifiable to take input from a file rather than the microphone, but luckily for me I then found that [Sam Machin][sammachin] did a much simpler version of the client, [AlexaPi][alexa-raspberrypi-sammachin], that consists of two python scripts: one to get a token, another to record from the microphone when getting a signal on the GPIO and sending the saved file to Alexa. This is still not what I needed, but the code in python is very easy to read and extract the query to send a WAV file to Alexa.

```python
url = 'https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize'
headers = {'Authorization' : 'Bearer %s' % gettoken()}
d = {
    "messageHeader": {
        "deviceContext": [
            {
                "name": "playbackState",
                "namespace": "AudioPlayer",
                "payload": {
                    "streamId": "",
                "offsetInMilliseconds": "0",
                    "playerActivity": "IDLE"
                }
            }
        ]
  },
    "messageBody": {
        "profile": "alexa-close-talk",
        "locale": "en-us",
        "format": "audio/L16; rate=16000; channels=1"
    }
}
with open(path+'recording.wav') as inf:
  files = [
      ('file', ('request', json.dumps(d), 'application/json; charset=UTF-8')),
      ('file', ('audio', inf, 'audio/L16; rate=16000; channels=1'))
      ]
  r = requests.post(url, headers=headers, files=files)
```

To run a few tests, I wrote a shell script that save the result of TTS to a file, uses ffmpeg to convert the file to the expected format and post it to Alexa. Not shown here, the code also reads the response from Alexa and save the result to a mp3. Alexa response format is unusual: it is a multipart body that contains an instruction for the speaker (i.e. do not mute, and play mp3) and the mp3 itself. This script worked perfectly, and I got the expected responses. It was time to integrate those query in our test framework at work.

After a few updates on our framework, as it didn't handle multipart queries and responses well, my tests can be run with the following scenario:

1. Make sure devices are in expected state
2. Send command to Alexa. Commands are pre-recorded voice messages
3. Check that Alexa response has the correct instructions for the speaker, and the mp3 matches the expected message. I check the mp3 using an md5 on the files
4. Check that corresponding actions were taken by Alexa (device state changed)

Improvements to the mp3 check can be made, for example by cutting the mp3s to compare before the device name, as this can vary, or by using a speech to text engine and compare text.

I added a [GitHub repo][alexa-behave-test] with the behave steps to send commands to Alexa and check the response:

```
 Feature: Alexa Smart Home Skill integration # features/alexa.feature:1

  Scenario: Device Discovery                                 # features/alexa.feature:3
    Given I discover my devices on Alexa                     # features/steps/alexa.py:7 6.519s
    Then Alexa response is valid and can be extracted        # features/steps/alexa.py:15 0.012s
    And Alexa instruction is "HomeAutomation.StartDiscovery" # features/steps/alexa.py:19 0.000s

  Scenario: Set On Television                         # features/alexa.feature:8
    Given I discover my devices on Alexa              # features/steps/alexa.py:7 3.934s
    When I send command "setOnTelevision"             # features/steps/alexa.py:11 3.185s
    Then Alexa response is valid and can be extracted # features/steps/alexa.py:15 0.001s
    And Alexa instruction is "DeviceTTSRenderer"      # features/steps/alexa.py:19 0.000s
    And Alexa response is "ok"                        # features/steps/alexa.py:24 0.000s

1 feature passed, 0 failed, 0 skipped
2 scenarios passed, 0 failed, 0 skipped
8 steps passed, 0 failed, 0 skipped, 0 undefined
Took 0m13.651s
```


[alexa-raspberrypi]:            https://github.com/alexa/alexa-avs-raspberry-pi
[echosim]:                      https://echosim.io/
[sammachin]:                    http://sammachin.com
[alexa-raspberrypi-sammachin]:  https://github.com/sammachin/AlexaPi
[alexa-behave-test]:            https://github.com/mockersf/alexa-test
