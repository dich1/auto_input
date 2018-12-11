# TODO 使用しているモジュールの定義のみを抽出する
FROM drecom/centos-base:latest

# rbenv
RUN git clone git://github.com/rbenv/rbenv.git /usr/local/rbenv \
  &&  git clone git://github.com/rbenv/ruby-build.git \
/usr/local/rbenv/plugins/ruby-build \
  &&  git clone git://github.com/jf/rbenv-gemset.git \
/usr/local/rbenv/plugins/rbenv-gemset \
  &&  /usr/local/rbenv/plugins/ruby-build/install.sh
ENV PATH="/usr/local/rbenv/bin:$PATH" \
    RBENV_ROOT="/usr/local/rbenv"

RUN echo 'export RBENV_ROOT=/usr/local/rbenv' >> /etc/profile.d/rbenv.sh \
  &&  echo 'export PATH=/usr/local/rbenv/bin:$PATH' >> /etc/profile.d/rbenv.sh \
  &&  echo 'eval "$(rbenv init -)"' >> /etc/profile.d/rbenv.sh

RUN echo 'export RBENV_ROOT=/usr/local/rbenv' >> /root/.bashrc \
  &&  echo 'export PATH=/usr/local/rbenv/bin:$PATH' >> /root/.bashrc \
  &&  echo 'eval "$(rbenv init -)"' >> /root/.bashrc

ENV CONFIGURE_OPTS="--disable-install-doc" \
    PATH="/usr/local/rbenv/bin:/usr/local/rbenv/shims:$PATH"

# ruby
RUN eval "$(rbenv init -)"; rbenv install 2.3.3 \
  &&  eval "$(rbenv init -)"; rbenv global 2.3.3 \
  &&  eval "$(rbenv init -)"; gem update --system \
  &&  eval "$(rbenv init -)"; gem install bundler --no-document --force

# selenium
RUN mkdir /selenium_ruby
WORKDIR /selenium_ruby
COPY . /selenium_ruby/app
WORKDIR /selenium_ruby/app
RUN bundle install
WORKDIR /

# chromedriver
ARG CHROME_DRIVER_VER=2.44
RUN yum install -y unzip
RUN curl -O https://chromedriver.storage.googleapis.com/${CHROME_DRIVER_VER}/chromedriver_linux64.zip
RUN unzip chromedriver_linux64.zip
RUN mv chromedriver /usr/local/bin/

# dependencies
RUN yum install -y libX11 \
                   GConf2 \
                   fontconfig

# chrome
COPY ./google-chrome.repo /etc/yum.repos.d/google-chrome.repo
RUN yum install -y google-chrome-stable \
                   libOSMesa
RUN yum install -y google-noto-cjk-fonts \
                   ipa-gothic-fonts

# xvfb
RUN yum install -y zlib-devel xorg-x11-server-Xvfb gtk+-devel gtk2-devel
RUN yum groupinstall -y base "Development Tools" --setopt=group_package_types=mandatory,default,optional

# firefox
ENV FF_LANG="ja" \
    FF_BASE_URL="https://archive.mozilla.org/pub" \
    FF_PLATFORM="linux-x86_64" \
    FF_INNER_PATH="firefox/releases"

ARG FF_VER="45.7.0esr"

ENV FF_COMP="firefox-${FF_VER}.tar.bz2"
ENV FF_URL="${FF_BASE_URL}/${FF_INNER_PATH}/${FF_VER}/${FF_PLATFORM}/${FF_LANG}/${FF_COMP}"
RUN cd /opt \
  && wget -nv "${FF_URL}" -O "firefox.tar.bz2" \
  && bzip2 -d "firefox.tar.bz2" \
  && tar xf "firefox.tar" \
  && rm "firefox.tar" \
  && ln -fs /opt/firefox/firefox /usr/bin/firefox \
  && chmod -R 777 /opt/firefox

ENV DISPLAY :1
CMD Xvfb :1 -screen 0 1024x768x24

WORKDIR /selenium_ruby/app

CMD bundle exec rackup -p 4567
#CMD tail -f /dev/null
