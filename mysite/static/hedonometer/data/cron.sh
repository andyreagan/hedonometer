# this job runs from cron every hour
# check to get the most recent parsed word vector from bluemoon

# for the vacc
# cd /users/s/t/storylab/website/data/hedonometer
# for linode
cd /usr/share/nginx/wiki/mysite/mysite/static/hedonometer/data

# today
DAY=$(date +%Y-%m-%d)
# yesterday
DAY=$(date +%Y-%m-%d -d "yesterday")
# some other date
# DAY="2014-07-08"

echo "processing $DAY"

if [ ! -f word-vectors/parsed.${DAY}.csv ]; then
    echo "word-vectors/parsed.${DAY}.csv not found, attempting to copy"

    # may need to try both user nodes
    # echo "rsync -avzr vacc1:/users/c/d/cdanfort/scratch/twitter/daily-wordcounts/parsed.${DAY}.csv word-vectors"
    rsync -avzr vacc1:/users/c/d/cdanfort/scratch/twitter/daily-wordcounts/parsed.${DAY}.csv word-vectors
    # rsync -avzr vacc2:/users/c/d/cdanfort/scratch/twitter/daily-wordcounts/parsed.${DAY}.csv word-vectors

    # get rid of the file
    # rm word-vectors/parsed.$(date +%Y-%m-%d).csv 

    echo "python transform10k.py parsed.${DAY}.csv"
    python transform10k.py parsed.${DAY}.csv

    echo "python rest.py prevvectors ${DAY} ${DAY}"
    python rest.py prevvectors ${DAY} ${DAY}

    echo "python timeseries.py prevvectors ${DAY} ${DAY} append"
    python timeseries.py ${DAY} ${DAY} append

    echo "python preshift.py prevvectors ${DAY} ${DAY}"
    python preshift.py ${DAY} ${DAY}
else
    echo "word-vectors/parsed.${DAY}.csv found"
fi

# fixed the python script to save there
# mv word-vectors/${DAY}-{meta,}shift.csv shifts

# rm allhappsday.csv 
# echo "date,value" >> allhappsday.csv 
# for f in word-vectors/*sumhapps.csv; do (cat "${f}"; echo) >> allhappsday.csv; done



