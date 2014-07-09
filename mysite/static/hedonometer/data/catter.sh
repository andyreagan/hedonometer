for FOLDER in dessert #$(\ls -1 keywords) # flavor
do
    echo ${FOLDER}
    cd keywords/${FOLDER}

    \rm allhappsday.csv 
    echo "date,value" >> allhappsday.csv 
    for f in *happs*-sum.csv; do (cat "${f}"; echo) >> allhappsday.csv; done

    # \rm allfreqday.csv 
    # echo "date,value" >> allfreqday.csv 
    # for f in *frequency*-sum.csv; do (cat "${f}"; echo) >> allfreqday.csv; done

    # scp areagan@bluemoon-user1.uvm.edu:fun/twitter/unilever/keywords/${FOLDER}/tweets/*happs*-sum.csv keywords/${FOLDER}

    cd ../../
done
