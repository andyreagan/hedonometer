HEDOTOOLS_DIR=/Users/andyreagan/work/2015/07-hedotools/js
for FILE in d3.js hedotools.barchart.js hedotools.init.js hedotools.lens.js hedotools.map.js hedotools.sankey.js hedotools.shifter.js shift-crowbar.js topojson.js urllib.js
do
    \rm $FILE
    ln /Users/andyreagan/work/2015/07-hedotools/js/$FILE $FILE
done

# other hard-link directories
# ~/work/2014/09-hedonometer/hedonometer/static/hedonometer/js
# ~/work/2014/03-labMTsimple/labMTsimple/static

# copied places:
# various 2015/03-sentiment-comparison folders
# 2015/02-mathcounts
# 2014/10-panometer
# 2014/05-twitter-calories

