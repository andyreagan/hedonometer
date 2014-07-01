import sys
import tarfile
from json import loads
import cProfile, pstats, StringIO


if __name__ == "__main__":
    pr = cProfile.Profile()
    pr.enable()
    # ... do something ...

    tar = tarfile.open(mode="r|", fileobj=sys.stdin)
    for tarinfo in tar:
        if tarinfo.isfile():
            print tarinfo.name
            f = tar.extractfile(tarinfo)
            count = 0
            nocount = 0
            for line in f:
                try:
                    tweet = loads(line)
                except:
                    print "failed to load a tweet"
                try:
                    if tweet['text']:
                        count += 1
                except:
                    # print "no text"
                    nocount += 1
            print count
            print nocount
            f.close()
    tar.close()

    # profile that run
    pr.disable()
    s = StringIO.StringIO()
    sortby = 'cumulative'
    ps = pstats.Stats(pr, stream=s).sort_stats(sortby)
    ps.print_stats()
    print s.getvalue()


