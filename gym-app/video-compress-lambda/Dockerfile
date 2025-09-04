FROM public.ecr.aws/lambda/nodejs:20

# Put ffmpeg binaries in a dedicated folder and add it to PATH
RUN mkdir -p /ffmpeg \
 && curl -sSL -o /ffmpeg/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
 && tar -xJf /ffmpeg/ffmpeg.tar.xz -C /ffmpeg \
 && mv /ffmpeg/ffmpeg-*-amd64-static/* /ffmpeg \
 && rm -rf /ffmpeg/ffmpeg-*-amd64-static /ffmpeg/ffmpeg.tar.xz

# Make ffmpeg & ffprobe globally accessible
ENV PATH="/ffmpeg:${PATH}"

# lambda expects /var/task so place everything there
WORKDIR /var/task
COPY package*.json ./
RUN npm ci --only=production
COPY index.js ./

CMD [ "index.handler" ]