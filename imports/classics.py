import sys, os
# sys.path.append('/home/prod/hedonometer')
sys.path.append('/Users/andyreagan/work/2014/2014-09hedonometer')
os.environ.setdefault('DJANGO_SETTINGS_MODULE','mysite.settings')
from django.conf import settings
import re

classics = {
    "blank": {
        "language": "",
        "fulltitle": "",
        "wiki": "",
        "ignore": [],
        "author": "",
    },
    "moby_dick": {
        "language": "english",
        "fulltitle": "Moby Dick",
        "wiki": "http://en.wikipedia.org/wiki/Moby-Dick",
        "ignore": ["cried", "cry", "coffin"],
        "author": "Herman Melville",
    },
    "luther": {
        "language": "english",
        "fulltitle": "I Have a Dream",
        "wiki": "",
        "ignore": [],
        "author": "",
    },
    "luther": {
        "language": "english",
        "fulltitle": "I Have a Dream",
        "wiki": "",
        "ignore": [],
        "author": "",
    },
    "anna_karenina": {
        "language": "russian",
        "fulltitle": "Anna Karenina",
        "wiki": "http://en.wikipedia.org/wiki/Anna_Karenina",
        "ignore": [],
        "author": "Leo Tolstoy",
    },
    "count_of_monte_cristo": {
        "language": "french",
        "fulltitle": "Count of Monte Cristo",
        "wiki": "http://en.wikipedia.org/wiki/The_Count_of_Monte_Cristo",
        "ignore": [],
        "author": "Alexandre Dumas",
    },
    "crime_and_punishment": {
        "language": "russian",
        "fulltitle": "Crime and Punishment",
        "wiki": "http://en.wikipedia.org/wiki/Crime_and_Punishment",
        "ignore": [],
        "author": "Fyodor Dostoyevsky",
    },
    "crime_and_punishment_en": {
        "language": "english",
        "fulltitle": "Crime and Punishment: English Translation",
        "wiki": "http://en.wikipedia.org/wiki/Crime_and_Punishment",
        "ignore": [],
        "author": "Fyodor Dostoyevsky",
    },
    "die_verwandlung_en": { 
        "language": "english", 
        "fulltitle": "Die Verwandlung: English Translation",
        "wiki": "http://en.wikipedia.org/wiki/The_Metamorphosis",
        "ignore": [],
        "author": "Franz Kafka",
    },
    "die_verwandlung": { 
        "language": "german",
        "fulltitle": "Die Verwandlung",
        "wiki": "http://en.wikipedia.org/wiki/The_Metamorphosis",
        "ignore": [],
        "author": "Franz Kafka",
    },
    "don_quixote": {
        "language": "spanish",
        "fulltitle": "Don Quixote",
        "wiki": "http://en.wikipedia.org/wiki/Don_Quixote",
        "ignore": [],
        "author": "Miguel de Cervantes Saavedra",
    },
    "the_three_musketeers": {
        "language": "french",
        "fulltitle": "The Three Musketeers",
        "wiki": "http://en.wikipedia.org/wiki/The_Three_Musketeers",
        "ignore": [],
        "author": "Alexandre Dumas",
    },
    "twoCities": {
        "language": "english",
        "fulltitle": "A Tale of Two Cities",
        "wiki": "http://en.wikipedia.org/wiki/A_Tale_of_Two_Cities",
        "ignore": [],
        "author": "Charles Dickens",
    },
    "expectations": {
        "language": "english",
        "fulltitle": "Great Expectations",
        "wiki": "http://en.wikipedia.org/wiki/Great_Expectations",
        "ignore": [],
        "author": "Charles Dickens",
    },
    "pride": {
        "language": "english",
        "fulltitle": "Pride and Prejudice",
        "wiki": "http://en.wikipedia.org/wiki/Pride_and_Prejudice",
        "ignore": [],
        "author": "Jane Austen",
    },
    "huck": {
        "language": "english",
        "fulltitle": "Adventures of Huckleberry Finn",
        "wiki": "http://en.wikipedia.org/wiki/Adventures_of_Huckleberry_Finn",
        "ignore": [],
        "author": "Mark Twain",
    },
    "alice": {
        "language": "english",
        "fulltitle": "Alice's Adventures in Wonderland",
        "wiki": "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
        "ignore": [],
        "author": "Charles Lutwidge Dodgson",
    },
    "tom": {
        "language": "english",
        "fulltitle": "The Adventures of Tom Sawyer",
        "wiki": "http://en.wikipedia.org/wiki/The_Adventures_of_Tom_Sawyer",
        "ignore": [],
        "author": "Mark Twain",
    },
    "sherlock": {
        "language": "english",
        "fulltitle": "The Adventures of Sherlock Holmes",
        "wiki": "http://en.wikipedia.org/wiki/Sherlock_Holmes",
        "ignore": [],
        "author": "Sir Arthur Conan Doyle",
    },
    "leaves": {
        "language": "english",
        "fulltitle": "Leaves of Grass",
        "wiki": "http://en.wikipedia.org/wiki/Leaves_of_Grass",
        "ignore": [],
        "author": "Walt Whitman",
    },
    "ulysses": {
        "language": "english",
        "fulltitle": "Ulysses",
        "wiki": "http://en.wikipedia.org/wiki/Ulysses_(novel)",
        "ignore": [],
        "author": "James Joyce",
    },
    "frankenstein": {
        "language": "english",
        "fulltitle": "Frankenstein; Or the Modern Prometheus",
        "wiki": "http://en.wikipedia.org/wiki/Frankenstein",
        "ignore": [],
        "author": "Mary Shelley",
    },
    "heights": {
        "language": "english",
        "fulltitle": "Wuthering Heights",
        "wiki": "http://en.wikipedia.org/wiki/Wuthering_Heights",
        "ignore": [],
        "author": "Emily Bronte",
    },
    "sense": {
        "language": "english",
        "fulltitle": "Sense and Sensibility",
        "wiki": "http://en.wikipedia.org/wiki/Sense_and_Sensibility",
        "ignore": [],
        "author": "Jane Austen",
    },
    "twist": {
        "language": "english",
        "fulltitle": "Oliver Twist",
        "wiki": "http://en.wikipedia.org/wiki/Oliver_Twist",
        "ignore": [],
        "author": "Charles Dickens",
    }
}

print classics

from hedonometer.models import Book

for book in classics:
    # print book
    b = classics[book]
    # print b
    # c = Book(title=b["fulltitle"],language=b["language"],wiki=b["wiki"],length=50000,filename=book,happs=-1,ignorewords="")
    # c.save()
    print "<li><a href=\"/books.html?book={0}\">{1}</a></li>".format(re.sub(" ","%20",b["fulltitle"]),b["fulltitle"])

