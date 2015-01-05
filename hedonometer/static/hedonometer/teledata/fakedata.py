import random

for y in ["1","10","20","50"]:
    f = open("teledata-"+y+"y-maxT.csv","w")
    
    numy = 100
    ystart = 1865
    years = [ystart+i for i in range(numy)]
    
    numcities = 1218
    
    f.write(",".join(map(str,years)))
    for i in range(numcities):
        temps = [random.random()*50+50 for i in range(numy)]
        f.write("\n")
        f.write(",".join(map(str,temps)))
    
    f.close()

for y in ["1","10","20","50"]:
    f = open("teledata-"+y+"y-minT.csv","w")
    
    numy = 100
    ystart = 1865
    years = [ystart+i for i in range(numy)]
    
    numcities = 1218
    
    f.write(",".join(map(str,years)))
    for i in range(numcities):
        temps = [random.random()*50 for i in range(numy)]
        f.write("\n")
        f.write(",".join(map(str,temps)))
    
    f.close()


for y in ["1","10","20","50"]:
    f = open("teledata-"+y+"y-summer_day.csv","w")
    
    numy = 100
    ystart = 1865
    years = [ystart+i for i in range(numy)]
    
    numcities = 1218
    
    f.write(",".join(map(str,years)))
    for i in range(numcities):
        temps = [random.randint(1,200) for i in range(numy)]
        f.write("\n")
        f.write(",".join(map(str,temps)))
    
    f.close()

for y in ["1","10","20","50"]:
    f = open("teledata-"+y+"y-summer_extent.csv","w")
    
    numy = 100
    ystart = 1865
    years = [ystart+i for i in range(numy)]
    
    numcities = 1218
    
    f.write(",".join(map(str,years)))
    for i in range(numcities):
        temps = [random.randint(1,20) for i in range(numy)]
        f.write("\n")
        f.write(",".join(map(str,temps)))
    
    f.close()

for y in ["1","10","20","50"]:
    f = open("teledata-"+y+"y-winter_day.csv","w")
    
    numy = 100
    ystart = 1865
    years = [ystart+i for i in range(numy)]
    
    numcities = 1218
    
    f.write(",".join(map(str,years)))
    for i in range(numcities):
        temps = [random.randint(1,200) for i in range(numy)]
        f.write("\n")
        f.write(",".join(map(str,temps)))
    
    f.close()

for y in ["1","10","20","50"]:
    f = open("teledata-"+y+"y-winter_extent.csv","w")
    
    numy = 100
    ystart = 1865
    years = [ystart+i for i in range(numy)]
    
    numcities = 1218
    
    f.write(",".join(map(str,years)))
    for i in range(numcities):
        temps = [random.randint(1,20) for i in range(numy)]
        f.write("\n")
        f.write(",".join(map(str,temps)))
    
    f.close()
