const { db } = require("../app/lib/db")

db.selectFrom("person")
  .selectAll()
  .execute()
  .then((result: any) => {
    console.log(result)
  })
