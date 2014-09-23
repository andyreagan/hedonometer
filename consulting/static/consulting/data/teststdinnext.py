import sys
import tarfile
tar = tarfile.open(mode="r|", fileobj=sys.stdin)

while True:
    member = tar.next()
    if member:
        if member.isfile():
            # feedback of where this script is
            print member.name
    else:
        break
tar.close()
