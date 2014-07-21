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
        print "adding {0}".format(curr.strftime('%Y-%m-%d'))
        try:
            f = open('word-vectors/{0}-all-word-vector.csv'.format(curr.strftime('%Y-%m-%d')),'r')
            # split into states
            tmp = f.read().split('\n')
            f.close()
            # clean to 51 states
            while len(tmp) > 51:
                del(tmp[-1])
            # clean to 10222 in each state
            for i in xrange(51):
                tmp[i] = map(int,tmp[i].split(','))
                while len(tmp[i]) > 10222:
                    del(tmp[i][-1])
                    
            array=array+numpy.array(tmp)

        except:
            print "could not load {0}".format(curr.strftime('%Y-%m-%d'))
            
        curr+=datetime.timedelta(days=1)

    return array,curr

if __name__ == '__main__':
    if sys.argv[1] == 'prevvectors':
        [year,month,day] = map(int,sys.argv[2].split('-'))
        start = datetime.datetime(year,month,day)
        [year,month,day] = map(int,sys.argv[3].split('-'))
        end = datetime.datetime(year,month,day)
        maincurr = copy.copy(start+datetime.timedelta(days=-1))
        while maincurr<end:
            array = numpy.zeros(10222)
            # added the try loop to handle failure inside the sumfiles
            # try:
            [total,date] = sumfiles(maincurr+datetime.timedelta(days=-6),maincurr+datetime.timedelta(days=0),array)
            
            # write the total into a file for date
            print "printing to {0}-prev7.csv".format(date.strftime('%Y-%m-%d'))
            f = open('word-vectors/{0}-prev7.csv'.format(date.strftime('%Y-%m-%d')),'w')
            for i in xrange(10222):
                f.write('{0:.0f}\n'.format(total[i]))
            f.close()
            # except:
            #     print "failed on {0}".format(date.strftime('%Y-%m-%d'))
            #     print "-------------------------------"
            maincurr+=datetime.timedelta(days=1)

    if sys.argv[1] == 'range':
        [year,month,day] = map(int,sys.argv[2].split('-'))
        start = datetime.datetime(year,month,day)
        [year,month,day] = map(int,sys.argv[3].split('-'))
        end = datetime.datetime(year,month,day)
        outfile = sys.argv[4]

        array = numpy.zeros((51,10222))

        [total,date] = sumfiles(start,end,array)
            
        # write the total into a file for date
        print "printing to {0}".format(outfile)
        f = open(outfile,'w')
        for j in xrange(51):
            f.write('{0:.0f}'.format(total[j][0]))
            for i in xrange(1,10222):
                f.write(',{0:.0f}'.format(total[j][i]))
            # don't write that last newline
            if j < 50:
                f.write('\n')
        f.close()

    if sys.argv[1] == 'list':
        days = []
        # note that [1:] is one longer than needed, but xrange won't hit it
        for i in xrange(2,len(sys.argv[1:])):
            [year,month,day] = map(int,sys.argv[i].split('-'))
            days.append(datetime.datetime(year,month,day))
        print days

        outfile = sys.argv[-1]
        print outfile
        array = numpy.zeros(10222)
        for day in days:
            # this should handle the array object by reference
            [tmp,date] = sumfiles(day,day,array)
            array+=tmp
            
        # write the total into a file for date
        print "printing to {0}".format(outfile)
        f = open(outfile,'w')
        for i in xrange(10222):
            f.write('{0:.0f}\n'.format(array[i]))
        f.close()








