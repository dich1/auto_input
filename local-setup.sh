brew install socat
brew tap caskroom/cask
brew cask install xquartz
open -a XQuartz
socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\"