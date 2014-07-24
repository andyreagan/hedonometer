cat bootstrap.css font-awesome.min.css site.css > base-all.css
minify --type css base-all.css > base-all.min.css

cat bootstrap.css font-awesome.min.css site.css index.css > index-all.css
minify --type css index-all.css > index-all.min.css
