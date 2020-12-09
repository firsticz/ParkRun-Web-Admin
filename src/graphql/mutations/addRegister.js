import gql from 'graphql-tag'

export default gql`
mutation($name:String,$userId:MongoID,$eventId:MongoID,$raceId:MongoID,$regisType:String, $status:EnumregisStatus){
  createRegis(record:{
    name:$name,
    userId:$userId,
    eventId:$eventId,
    raceId:$raceId,
    regisType:$regisType,
    status: $status
  }){
    recordId
  }
}
`
