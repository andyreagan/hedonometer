for FOLDER in $(\ls -1 keywords) # flavor
do
    #scp areagan@bluemoon-user1.uvm.edu:fun/twitter/unilever/keywords/${FOLDER}/tweets/*happs*-sum.csv keywords/${FOLDER}
    scp areagan@bluemoon-user1.uvm.edu:fun/twitter/unilever/keywords/${FOLDER}/tweets/*word-vector*-sum.csv keywords/${FOLDER}
done