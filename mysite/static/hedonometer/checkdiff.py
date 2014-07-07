
f = open("dailyFull.csv","r")
f.readline()
mitre = []
for line in f:
    mitre.append(line.split(","))
f.close()

f = open("data/word-vectors/sumhapps.csv","r")
f.readline()
reagan = []
for line in f:
    reagan.append(line.split(","))
f.close()

maxd = 0.0
day = ""
for x in mitre:
    for y in reagan:
        if x[0] == y[0]:
            if (float(x[1])-float(y[1])) > maxd:
                maxd = float(x[1])-float(y[1])
                day = x[0]
            print x[0]+",",
            print float(x[1])-float(y[1])

print "max difference of ",
print maxd,
print " on ",
print day
