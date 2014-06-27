# this job runs from cron every hour
# check to get the most recent parsed word vector from bluemoon

cd /users/s/t/storylab/website/data/hedonometer

rsync -avzr vacc2:/users/c/d/cdanfort/scratch/twitter/daily-wordcounts/parsed.$(date +%Y-%m-%d).csv .

python transform10k.py $(date +%Y-%m-%d)