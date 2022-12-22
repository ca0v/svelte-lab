import sqlite3

sourceConnection = sqlite3.connect('./photo.sqlite')
targetConnection = sqlite3.connect('./jbc.sqlite')

source = sourceConnection.cursor()

# list all the table in source and the number of rows in each table
for table in source.execute('SELECT name FROM sqlite_master WHERE type="table"').fetchall():
    tableName = table[0]
    print(tableName, source.execute(
        'SELECT COUNT(1) FROM ' + tableName).fetchone()[0])


def copyCollageData():
    # Get the source data
    sourcerows = source.execute('SELECT * FROM collages')

    target = targetConnection.cursor()

    for sourcerow in sourcerows:
        print(sourcerow[0])
        target.execute(
            'INSERT INTO collages (userid, id, data, note, title) VALUES ("114145788115194360686", ?, ?, ?, ?)', sourcerow)

    targetConnection.commit()


copyCollageData()
