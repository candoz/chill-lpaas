FROM node

RUN mkdir web-chill

COPY ./ /web-chill

RUN cd /web-chill ; npm run build

CMD cd /web-chill; node server.js
