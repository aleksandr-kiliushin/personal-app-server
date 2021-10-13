import { gql, useQuery } from '@apollo/client'

// Types
import { QueryHookOptions } from '@apollo/client'
import { IUser } from '#interfaces/user'

const GET_CURRENT_USER_DATA = gql`
	query {
		getCurrentUserData {
			username
			id
		}
	}
`

interface IGetCurrentUserData {
	id: IUser['id']
	username: IUser['username']
}

interface IGetCurrentUserVars {}

export const useGetCurrentUserDataQuery = (options?: QueryHookOptions) =>
	useQuery<IGetCurrentUserData, IGetCurrentUserVars>(GET_CURRENT_USER_DATA, options)
