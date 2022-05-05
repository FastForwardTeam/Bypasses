FROM node:16

LABEL "com.github.actions.name"="Puppeteer Headful"
LABEL "com.github.actions.description"="A GitHub Action / Docker image for Puppeteer, the Headful Chrome Node API"
LABEL "com.github.actions.icon"="layout"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/mujo-code/puppeteer-headful"
LABEL "homepage"="https://github.com/mujo-code/puppeteer-headful"
LABEL "maintainer"="Jacob Lowe"

RUN  apt-get update \
     && apt-get install -yq wget gnupg xvfb dumb-init dbus \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
     && rm -rf /var/lib/apt/lists/* \
     && npm config set update-notifier false

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/usr/bin/dumb-init", "--", "/entrypoint.sh"]
