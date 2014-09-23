echo "catting base"
cat d3.andy.js jquery-1.11.0.min.js bootstrap.js > base-all.js
echo "minifying base"
# minify --type js base-all.js > base-all.min.js

echo "catting index"
cat d3.andy.js d3.geo.zoom.js topojson.v1.min.js jquery-1.11.0.min.js bootstrap.js urllib.js shift.js plotShift.js index-on-load.js > index-all.js
echo "minifying index"
# minify --type js index-all.js > index-all.min.js




