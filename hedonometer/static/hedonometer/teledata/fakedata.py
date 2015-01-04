import random

f = open("teledata-50y-maxT.csv","w")

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
