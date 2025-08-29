FROM public.ecr.aws/lambda/nodejs:20

# install a static ffmpeg build and untar and ln ffmpeg to use in lambda
RUN curl -L -o /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
 && tar -xJf /tmp/ffmpeg.tar.xz -C /opt \
 && ln -s /opt/ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg

# lambda expects /var/task so place everything there
WORKDIR /var/task
COPY package*.json ./
RUN npm ci --only=production
COPY index.js ./

CMD [ "index.handler" ]