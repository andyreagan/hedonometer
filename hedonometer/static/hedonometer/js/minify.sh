# /usr/share/nginx/wiki/mysite/mysite/static/hedonometer/js/minify.sh

if [ $USER == "andyreagan" ]; then
    alias minify="yuicompressor"
fi

# cat first
echo "catting index"
cat d3.andy.js jquery-1.11.0.min.js bootstrap.js bootstrap-datepicker.js urllib.js loadlabMT.js shift.js hedotools.init.js hedotools.shifter.js timeline.js > index-all.js

echo "catting books"
cat d3.andy.js jquery-1.11.0.min.js bootstrap.js typeahead.bundle.js urllib.js hedotools.init.js hedotools.shifter.js drawLens-chapters.js drawBookTimeseries.js selectChapter.js selectChapterTop.js computeHappsChapters.js books-on-load.js > books-all.js

# echo "catting maps"
# cat jquery-1.11.0.min.js bootstrap.min.js d3.andy.js urllib.js topojson.v1.min.js drawLens-geo.js drawMap.js computeHapps-geo.js drawList.js maps-on-load.js > maps-all.js

# minify second
echo "minifying index"
minify --type js index-all.js > index-all.min.js
# echo "minifying books"
# minify --type js books-all.js > books-all.min.js
# echo "minifying maps"
# minify --type js maps-all.js > maps-all.min.js

# could move them, but copy for now
cp index-all{,.min}.js compiled
cp books-all{,.min}.js compiled
# cp maps-all{,.min}.js compiled

