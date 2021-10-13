import { useState } from 'react'
import cx from 'classnames'

// Fetching
import { useUpdateFinanceRecordMutation } from '#models/fetching/update-finance-record.mutation'
import { useDeleteFinanceRecordMutation } from '#models/fetching/delete-finance-record.mutation'

// Components
import { Svg } from '#components/lib/svg'
import { InputRow } from './input-row'

// Styles
import s from './index.module.css'

// Types
import { IFinanceRecord } from '#interfaces/finance'

export const Row = ({ record }: IProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const { amount, category, date, id } = record

	const [updateFinanceRecord] = useUpdateFinanceRecordMutation()

	const [deleteFinanceRecord] = useDeleteFinanceRecordMutation()

	const dateFormatted = new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' })

	const cxAmount = cx({
		[s.Cell]: true,
		[s.ExpenseRecordCell]: category.type.name === 'expense',
		[s.IncomeRecordCell]: category.type.name === 'income',
	})

	if (isEditing) {
		return <InputRow closeInputRow={() => setIsEditing(false)} record={record} />
	}

	if (record.isTrashed) {
		return (
			<div className={s.Row}>
				<div className={cxAmount}>{amount}</div>
				<div className={s.Cell}>{category.name}</div>
				<div className={s.Cell}>{dateFormatted}</div>
				<div
					className={s.Cell}
					onClick={() => updateFinanceRecord({ variables: { id, isTrashed: false } })}
				>
					<Svg name="reply" />
				</div>
				<div className={s.Cell} onClick={() => deleteFinanceRecord({ variables: { id } })}>
					<Svg name="trash-can" />
				</div>
			</div>
		)
	}

	return (
		<div className={s.Row}>
			<div className={cxAmount}>{amount}</div>
			<div className={s.Cell}>{category.name}</div>
			<div className={s.Cell}>{dateFormatted}</div>
			<div className={s.Cell} onClick={() => setIsEditing(!isEditing)}>
				<Svg name="pencil" />
			</div>
			<div
				className={s.Cell}
				onClick={() => updateFinanceRecord({ variables: { id, isTrashed: true } })}
			>
				<Svg name="trash-can" />
			</div>
		</div>
	)
}

interface IProps {
	record: IFinanceRecord
}