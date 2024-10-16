# Build with docker build -f local-serve.Dockerfile -t website .
# Run with docker run -v `pwd`:/site website

FROM ruby:2.7

EXPOSE 4000

VOLUME /site

RUN gem install bundler -v 2.4

CMD cd /site && bundle install && bundle exec jekyll serve --host 0.0.0.0
