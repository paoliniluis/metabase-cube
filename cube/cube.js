// Use case 1. Custom user configuration
const users = [
  {
    username: 'myusername',
    password: 'mypassword',
    // All cubes available
    cubes: ['Orders', 'People', 'Products', 'Reviews'],
    team: 'data team'
  },
  {
    username: 'user_1',
    password: 'password_1',
    // Only two cubes available
    cubes: ['Orders', 'People']
  },
  {
    username: 'user_2',
    password: 'password_2',
    // Two other cubes available
    cubes: ['Products', 'Reviews']
  },
  {
    username: 'user_3',
    password: 'password_3',
    // Two cubes available, once of them from a different database
    cubes: ['Reviews', 'Suppliers']
  }
]

module.exports = {
  // Use case 1. User authentication
  checkSqlAuth: (request, username) => {
    // Find user by the username
    const user = users.find(_ => _.username === username);

    // Return the password (to be checked) and security context (meta info associated with user) 
    if (user) {
      return {
        password: user.password,
        securityContext: {
          cubes: user.cubes,
          team: user.team
        }
      }
    }

    // Diallow access to unknown users
    throw new Error('Incorrect user name or password');
  },

  // Use case 1. Query validation
  queryRewrite: (query, { securityContext }) => {
    // Check cubes in the query
    const cubeNames = [
        ...(query.dimensions || []),
        ...(query.measures || [])
      ]
      .map(_ => _.split('.')[0])
      .filter((value, index, self) => self.indexOf(value) === index);

    // Allow query if all cubes in it are included into the security context
    if (securityContext.cubes !== undefined && cubeNames.every(_ => securityContext.cubes.includes(_))) {
      // Use case 2. Restrict access to historical data for "non-data" teams
      if (securityContext.team !== undefined && securityContext.team === 'data team') {
        // Don't apply filters for the "data team"
      }
      else {
        // Apply filters for all other teams
        cubeNames.forEach(_ => {
          if (!query.filters) {
            query.filters = {};
          }
  
          // Add a time range filter to every cube by the "created_at" dimension
          cubeNames.forEach(_ => query.filters.push({
            member: _ + '.created_at',
            operator: 'afterDate',
            values: [ '2019-01-01' ]
          }))
        });
      }

      return query;
    }

    // Disallow query otherwise
    throw new Error('Access to some of these cubes is denied');
  },

  // Use case 1. Multiple database connections
  driverFactory: ({ dataSource }) => {
    if (dataSource === 'custom') {
      return {
        type: 'postgres',
        host: 'demo-db.cube.dev',
        port: 5432,
        database: 'ecom',
        user: 'cube',
        password: '12345'
      }
    }

    // Default data source
    return {
      type: 'postgres',
      host: 'postgres-data-cubejs',
      port: 5432,
      database: 'sample',
      user: 'metabase',
      password: 'metasample123'
    }
  },
};