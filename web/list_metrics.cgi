#!/bin/bash
#
# Proxy requests from Numpebble watch app to the Numerous API
#
# This script depends on a request header containing a pre-encoded
# authorization string which is used to authenticate to the Numerous API
#

AUTH_HEADER="$HTTP_X_ERNIE_HEADER"

# date >> /tmp/numpebblecgi.log
# set >> /tmp/numpebblecgi.log
# env >> /tmp/numpebblecgi.log

echo "Content-Type: text/json"
echo

if [ ! "$AUTH_HEADER" ]
then
  echo "{ \"error\": \"No authentication provided\" }"
  exit 2
fi


header_tempfile=$(mktemp /tmp/numpebble.headers.XXXXXX)
output_tempfile=$(mktemp /tmp/numpebble.output.XXXXXX)

curl --silent --dump-header $header_tempfile --header "Authorization: Basic $AUTH_HEADER" https://api.numerousapp.com/v1/users/me/metrics > $output_tempfile 2>&1

STATUS=$(grep "HTTP/1.1 " $header_tempfile | tr -d \\n\\r)
if [ "$STATUS" = "HTTP/1.1 200 OK" ]
then
  cat $output_tempfile
  exit 0
else
  echo "{ \"error\": \"$STATUS\" }"
  exit 3
fi
