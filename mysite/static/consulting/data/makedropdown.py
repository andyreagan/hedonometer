import codecs

if __name__ == '__main__':

    f = codecs.open('/users/a/r/areagan/fun/twitter/unilever/keywords.txt','r','utf8')
    keyWords = [line.rstrip().lower() for line in f]
    f.close()
    del(keyWords[-1])
    del(keyWords[-1])
    
    # check these are the right keywords!
    print keyWords
    print len(keyWords)

    for key in keyWords:
        print "<li><a href=\"index.html?key={0}\">{1}</a></li>".format(key,key)
