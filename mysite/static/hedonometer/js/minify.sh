cat d3.js jquery-1.11.0.min.js bootstrap.js bootstrap-datepicker.js urllib.js loadlabMT.js shift.js timeline.js > index-all.js
minify --type js index-all.js > index-all.min.js

cat d3.js jquery-1.11.0.min.js bootstrap.js bootstrap-datepicker.js urllib.js loadlabMT.js shift.js timelinedev.js > dev-all.js
minify --type js dev-all.js > dev-all.min.js