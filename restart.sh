PIDFILE="/usr/share/nginx/prod/django.pid"

echo "old PID is $(cat ${PIDFILE}), issuing"
echo "kill -9 $(cat ${PIDFILE})"
kill -9 $(cat ${PIDFILE})

echo "wait a second to start the server again"
sleep 1

./manage.py runfcgi method=threaded host=127.0.0.1 port=8080 pidfile=${PIDFILE}

echo "server started"
echo "there has got to be a better method than this"

