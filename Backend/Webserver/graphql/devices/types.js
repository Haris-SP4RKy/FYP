
module.exports.deviceTypes =`
  type Device {
    id: ID!
    sensor_type: String!
    group: JSON
  }

  extend type Query {
    devicebyId(id:ID!,sensor_type:String!): Device
    getonlinedevices: JSON!
    getdevicesstatus: JSON!
    getgraph(sensor_type:String!):JSON!
    getdashboard(by:Int!):JSON!
    gettemperature(by:Int!):JSON!
    gethumidity(by:Int!):JSON!
    getcarbondioxide(by:Int!):JSON!
    getcarbonmonoxide(by:Int!):JSON!
    getmethane(by:Int!):JSON!
    getfilterss(area:Int!,sensor:String!):JSON!

    
  }
  extend type Mutation {
    Insert(id: ID!, sensor_type: String!, group_id:Int!): Device!
  }
`;