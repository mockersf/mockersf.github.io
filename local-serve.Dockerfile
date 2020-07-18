FROM ruby

EXPOSE 4000

VOLUME /site

RUN gem install bundler jekyll

CMD cd /site && bundle install && bundle exec jekyll serve --host 0.0.0.0
