import log from '../log.js'
import {query} from '../database.js'

export default class User {
  id
  name

  constructor(properties) {
    Object.keys(this)
      .filter((k) => typeof this[k] !== 'function')
      .map((k) => (this[k] = properties[k]))
  }

  static fromDBRow = (row) => {
    const user = new User({
      id: row.id,
      name: row.name,
    })

    return user
  }

  static list = async (ids) => {
    log.info('Model::User::list', {ids})

    const params = []

    let query_sql = `
        select *
        from users
    `;

    if (ids) {
      query_sql += `where id in (?)`;
      params.push(ids);
    }

    const rows = await query(query_sql, params);

    const users = rows.map(User.fromDBRow)

    return users
  }
}