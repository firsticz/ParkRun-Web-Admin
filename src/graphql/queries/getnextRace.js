import gql from 'graphql-tag'

export default gql`
query{
	nextRace{
		name
		slug
		deleted
		startTime
		endTime
		haveChipTime
		checkpoints{
			_id
			name
			position
			cutOffTime
			distance
		}
	}
}
`