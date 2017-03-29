# Optimizely Bot for Slack

### Work in Progress

At the moment the bot just listens for changes in projects and experiments (not
all fields within the experiments though, just a few ones). I still need to add support
for [schedules](https://developers.optimizely.com/classic/rest/v1/#schedules),
[variations](https://developers.optimizely.com/classic/rest/v1/#variations) and
[goals](https://developers.optimizely.com/classic/rest/v1/#goals).
[Results](https://developers.optimizely.com/classic/rest/v1/#results) are not
necessarily important since they can be better consulted at the Optimizely site.


### Getting started

Clone the repository and install all dependencies (you can also use `npm i` instead):

```bash
$ git clone https://github.com/rmngrc/optimizely-slack-bot.git

$ cd optimizely-slack

$ yarn
```

To run the project you need to pass three environment variables to the nodejs executable:

```
OPTIMIZELY_TOKEN=abcd111 SLACK_TOKEN=efgh222 UPDATE_CHANNEL=general node index.js
```

### TODO

- Containerise the solution using docker.
- Add serverless.com support.
- Remove the intervals and rely in serverless execution intervals instead.
