
module.exports.deviceTypes =`
  type Device {
    id: ID!
    sensor_type: String!
    group: JSON
  }

  extend type Query {
    devicebyId(id:ID!,sensor_type:String!): Device
    getonlinedevices: Int!
    
  }
  extend type Mutation {
    Insert(id: ID!, sensor_type: String!, group_id:Int!): Device!
  }
`;