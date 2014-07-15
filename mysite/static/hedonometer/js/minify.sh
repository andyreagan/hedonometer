echo "catting index"
cat d3.andy.js jquery-1.11.0.min.js bootstrap.js bootstrap-datepicker.js urllib.js loadlabMT.js shift.js timeline.js > index-all.js
echo "minifying index"
minify --type js index-all.js > index-all.min.js

echo "catting dev"
cat d3.andy.js jquery-1.11.0.min.js bootstrap.js bootstrap-datepicker.js urllib.js loadlabMT.js shift.js timelinedev.js > dev-all.js
echo "minifying dev"
minify --type js dev-all.js > dev-all.min.js

echo "catting books"
cat d3.andy.js jquery-1.11.0.min.js bootstrap.js typeahead.bundle.js urllib.js plotShift-books.js shift-foreign.js drawLens-chapters.js selectChapter.js selectChapterTop.js drawBookTimeseries.js computeHappsChapters.js books-on-load.js > books-all.js
echo "minifying books"
minify --type js books-all.js > books-all.min.js

# not using yet
# echo "catting maps"
# cat d3.andy.js jquery-1.11.0.min.js bootstrap.js urllib.js plotShift-geo.js shift-maps.js maps-on-load.js > maps-all.js
# echo "minifying maps"
# minify --type js maps-all.js > maps-all.min.js

