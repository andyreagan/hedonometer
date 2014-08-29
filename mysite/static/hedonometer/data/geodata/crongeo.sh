# this job runs from cron every hour
# check to get the most recent parsed word vector from bluemoon

# for the vacc
# cd /users/s/t/storylab/website/data/hedonometer
# for linode
cd /usr/share/nginx/wiki/mysite/mysite/static/hedonometer/data/geodata

# today
# DAY=$(date +%Y-%m-%d)
# yesterday
for OFFSET in 1; do
    DAY=$(date +%Y-%m-%d -d "${OFFSET} day ago")
    # some other date
    # DAY="2014-07-08

    echo "looking for $DAY"

    if [ ! -f word-vectors/${DAY}-all-word-vector.csv ]; then
	echo "word-vectors/${DAY}-all-word-vector.csv not found, attempting to copy"

	# may need to try both user nodes
	rsync -avzr vacc1:/users/a/r/areagan/fun/twitter/jake/pullTweets/${DAY}-all-word-vector.csv word-vectors
	# rsync -avzr vacc1:/users/a/r/areagan/fun/twitter/jake/pullTweets/*-all-happs.csv happs
	if [ -f word-vectors/${DAY}-all-word-vector.csv ]; then
	    echo "creating lastweek.csv"
	    python rest.py range $(date +%Y-%m-%d -d "7 days ago") $(date +%Y-%m-%d -d "1 days ago") wordCountslastweek.csv    
	    echo "creating lastmonth.csv"
	    python rest.py range $(date +%Y-%m-%d -d "30 days ago") $(date +%Y-%m-%d -d "1 days ago") wordCountslastmonth.csv    
	    echo "creating lastquarter.csv"
	    python rest.py range $(date +%Y-%m-%d -d "90 days ago") $(date +%Y-%m-%d -d "1 days ago") wordCountslastquarter.csv    
	    # echo "python addtomodel.py $(tail -n 1 word-vectors/sumhapps.csv)"
	    # python addtomodel.py $(tail -n 1 word-vectors/sumhapps.csv)
	    python importhapps.py $(date +%Y-%m-%d -d "1 day ago")
	fi
    else
	echo "word-vectors/${DAY}-all-word-vector.csv found"
    fi
done

# fixed the python script to save there
# mv word-vectors/${DAY}-{meta,}shift.csv shifts

# rm allhappsday.csv 
# echo "date,value" >> allhappsday.csv 
# for f in word-vectors/*sumhapps.csv; do (cat "${f}"; echo) >> allhappsday.csv; done



