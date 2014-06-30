# rest.py
#
# goal here is to expose function for taking two dates and adding the frequency vectors between those dates

import datetime
import numpy
import sys
import copy

def sumfiles(start,end,array):
    curr = copy.copy(start)
    while curr <= end:
        # print "adding {0}".format(curr.strftime('%Y-%m-%d'))
        f = open('word-vectors/{0}-sum.csv'.format(curr.strftime('%Y-%m-%d')),'r')
        tmp = f.read().split('\n')
        f.close()
        while len(tmp) > 10222:
            del(tmp[-1])
        array=array+numpy.array(map(int,tmp))
        curr+=datetime.timedelta(days=1)

    return array,curr

if __name__ == '__main__':
    [year,month,day] = map(int,sys.argv[1].split('-'))
    start = datetime.datetime(year,month,day)
    [year,month,day] = map(int,sys.argv[2].split('-'))
    end = datetime.datetime(year,month,day)

    maincurr = copy.copy(start+datetime.timedelta(days=-1))
    while maincurr<end:
        array = numpy.zeros(10222)
        try:
            [total,date] = sumfiles(maincurr+datetime.timedelta(days=-6),maincurr+datetime.timedelta(days=0),array)
    
            # write the total into a file for date
            print "printing to {0}".format(date.strftime('%Y-%m-%d'))
            f = open('word-vectors/{0}-prev7.csv'.format(date.strftime('%Y-%m-%d')),'w')
            for i in xrange(10222):
                f.write('{0}\n'.format(total[i]))
            f.close()
        except:
            print "failed on {0}".format(date.strftime('%Y-%m-%d'))
            print "-------------------------------"
        maincurr+=datetime.timedelta(days=1)





