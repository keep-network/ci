# This Dockerfile can be used to quickly generate the needed artifacts when
# updating `notify-workflow-completed`, `run-workflow` and `upstream-builds-query`
# custom GH actions after changes in the `./config/config.json` file.
# To update the artifacts:
# 1. Push the modified `./config/config.json` to a feature branch.
# 2. Provide the name of the feature branch to the `BRANCH_NAME` parameter below.
# 3. Build the Docker image by executing the following command from the
#    `./actions` folder:
#      ```
#      docker build --tag actions .
#      ```
# 4. Run the built Docker image (the container will run in the background and
#    will update the code of the actions):
#      ```
#      docker run -d actions
#      ```
# 5. Within 5 min list the run Docker conteiners and copy the container id:
#      ```
#      docker ps
#      ```
# 6. Replace the container id in the below commands and run them from the
#    the `./actions` folder. The commands will copy the updated `dist` folders
#    from the container filesystem to your local code.
#      ```
#      docker cp 66c205e35635:/workdir/ci/actions/notify-workflow-completed/dist/ ./notify-workflow-completed
#      docker cp 66c205e35635:/workdir/ci/actions/run-workflow/dist/ ./run-workflow             
#      docker cp 66c205e35635:/workdir/ci/actions/upstream-builds-query/dist/ ./upstream-builds-query
#      ```
# 7. Commit & push the changes in the actions to your feature branch.

FROM node:14-alpine3.13 AS build

ENV BRANCH_NAME=feature_branch_with_the_new_config

RUN apk add --update --no-cache \
  git \
  bash

WORKDIR /workdir

RUN git clone https://github.com/keep-network/ci -b $BRANCH_NAME

WORKDIR ci/actions/notify-workflow-completed
RUN yarn install
RUN yarn run prepare
WORKDIR ../run-workflow
RUN yarn install
RUN yarn run prepare
WORKDIR ../upstream-builds-query
RUN yarn install
RUN yarn run prepare

CMD sleep 300