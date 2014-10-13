echo "base"
cat bootstrap.css font-awesome.min.css site.css paper.css > base-all.css
minify --type css base-all.css > base-all.min.css

echo "timeline"
cat bootstrap.css font-awesome.min.css site.css timeline.css datepicker.css hedotools.shift.css > timeline-all.css
minify --type css timeline-all.css > timeline-all.min.css

echo "books"
cat bootstrap.css font-awesome.min.css site.css books.css datepicker.css paper.css hedotools.shift.css > books-all.css
minify --type css books-all.css > books-all.min.css

echo "maps"
cat bootstrap.css font-awesome.min.css site.css maps.css paper.css > maps-all.css
minify --type css maps-all.css > maps-all.min.css

